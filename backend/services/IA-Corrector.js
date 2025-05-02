const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs/promises');
const { existsSync } = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const compression = require('compression');

// Configuration de l'application
const app = express();
const PORT = process.env.PORT || 5001;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const MODEL = process.env.MODEL || 'deepseek-r1:7b';
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// S'assurer que le dossier uploads existe
(async () => {
  if (!existsSync(UPLOAD_DIR)) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log('📁 Dossier uploads créé');
  }
})();

// Configuration de multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// Fonction pour extraire la note de la réponse d'Ollama
function extractGrade(rawResponse) {
  const match = rawResponse.match(/\b([0-9]|1[0-9]|20)\b/);
  return match ? parseInt(match[0]) : 10;
}

// Fonction améliorée pour tronquer le contenu avec une limite plus élevée
function truncateContent(content, maxLength = 1500) {
  if (content.length <= maxLength) return content;
  
  // Prendre le début (60%)
  const start = content.substring(0, Math.floor(maxLength * 0.6));
  // Prendre la fin (40%)
  const end = content.substring(content.length - Math.floor(maxLength * 0.4));
  
  return `${start}\n\n[...contenu tronqué...]\n\n${end}`;
}

// Fonction pour estimer la qualité basique d'un texte
function analyzeQuality(text) {
  // Critères basiques pour déterminer la qualité
  const wordCount = text.split(/\s+/).length;
  const hasCodeBlocks = text.includes('```') || /function\s+\w+\s*\(/.test(text);
  const hasLists = text.includes('• ') || text.includes('- ') || /\d+\.\s+/.test(text);
  const hasFormalStructure = /introduction|conclusion|chapitre|partie/i.test(text);
  const hasExamples = /exemple|par exemple|comme suit|tel que/i.test(text);
  const hasExplanations = /en effet|ainsi|donc|par conséquent/i.test(text);
  
  // Mots spécifiques à rechercher pour déterminer le domaine
  const isDatabaseContent = /base de données|sql|select|from|where|join|table/i.test(text);
  const isProgrammingContent = /code|function|variable|class|programming|algorithm|algorithme/i.test(text);
  const isMathContent = /mathématique|équation|formule|calcul|dérivée|intégrale/i.test(text);
  
  // Calcul d'un score de qualité basique (entre 0 et 20)
  let qualityScore = 10; // Score de base
  
  // Longueur du texte
  if (wordCount < 10) qualityScore -= 5;
  else if (wordCount > 50) qualityScore += 2;
  
  // Structure et contenu
  if (hasCodeBlocks) qualityScore += 2;
  if (hasLists) qualityScore += 1;
  if (hasFormalStructure) qualityScore += 2;
  if (hasExamples) qualityScore += 2;
  if (hasExplanations) qualityScore += 2;
  
  // Ajustements spécifiques au domaine
  if (isDatabaseContent && text.toLowerCase().includes('select * from')) {
    // Évaluer la qualité d'une requête SQL basique
    const sqlComplexity = (text.toLowerCase().match(/where|join|group by|having|order by|limit|offset/g) || []).length;
    qualityScore = 8 + Math.min(sqlComplexity * 2, 10); // Max 18
  }
  
  // Limiter le score entre 0 et 20
  return Math.max(0, Math.min(20, Math.round(qualityScore)));
}

// Route principale pour corriger un PDF
app.post('/api/correct', upload.single('pdf'), async (req, res) => {
  console.time('⏱️ Temps total de traitement');
  
  // Déclarer fallbackScore au niveau de la fonction pour qu'il soit accessible partout
  let fallbackScore = 10;
  
  try {
    if (!req.file) {
      console.log('❌ Aucun fichier reçu');
      return res.status(400).json({ error: "Aucun fichier PDF n'a été fourni" });
    }
    
    console.log(`📄 Fichier reçu: ${req.file.originalname} (${req.file.size} octets)`);
    
    // Extraction du texte du PDF
    console.time('⏱️ Extraction du texte PDF');
    const pdfData = await pdfParse(req.file.buffer);
    let fileContent = pdfData.text;
    console.timeEnd('⏱️ Extraction du texte PDF');
    
    // Pré-analyse du contenu pour avoir une note de secours en cas de timeout
    fallbackScore = analyzeQuality(fileContent);
    console.log(`📊 Score de secours calculé: ${fallbackScore}/20`);
    
    // Tronquer le contenu pour les fichiers très longs
    const originalLength = fileContent.length;
    if (originalLength > 1500) {
      console.log(`📝 Texte original: ${originalLength} caractères (sera tronqué)`);
      fileContent = truncateContent(fileContent, 1500);
      console.log(`📝 Texte tronqué: ${fileContent.length} caractères`);
    } else {
      console.log(`📝 Texte extrait: ${fileContent.length} caractères`);
    }
    
    // Prompt plus détaillé pour une meilleure évaluation
    const prompt = `Évalue cet exercice d'étudiant sur 20 en te basant sur le contenu, la pertinence et la qualité des réponses:

${fileContent}

Donne uniquement une note entre 0 et 20 sans explication.`;

    // Paramètres pour inférence avec deepseek-r1:7b
    console.time('⏱️ Traitement par Ollama');
    console.log(`🤖 Envoi à Ollama (modèle: ${MODEL})`);
    
    // Définir un timeout pour éviter que la requête ne prenne trop de temps
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 115000); // 115 secondes max
    
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt: prompt,
      stream: false,
      options: {
        num_predict: 10,        // Un peu plus pour permettre une réponse plus nuancée
        temperature: 0.3,       // Un peu plus de créativité tout en restant cohérent
        stop: ["\n", ".", ","], // Arrêter dès qu'on a un chiffre
        num_ctx: 1024,          // Contexte suffisant pour l'analyse
        num_thread: 0,          // Utiliser tous les threads disponibles
        num_gpu: 99,            // Utiliser tous les GPUs disponibles si disponibles
      }
    }, { signal: controller.signal });
    
    clearTimeout(timeoutId);
    console.timeEnd('⏱️ Traitement par Ollama');
    
    // Extraction de la note
    const raw = response.data.response;
    const note = extractGrade(raw);
    console.log(`🎓 Note attribuée: ${note}/20`);
    
    res.json({ note, success: true });
    
  } catch (error) {
    console.error("❌ Erreur lors de la correction:", error.message);
    
    // Si l'erreur est due au timeout ou à l'abort
    if (error.name === 'AbortError' || error.name === 'CanceledError' || error.message.includes('aborted') || error.message.includes('canceled')) {
      const fallbackNote = Math.round(fallbackScore); // Utiliser la note de secours
      console.log(`⏱️ Timeout atteint - utilisation de la note de secours: ${fallbackNote}/20`);
      
      return res.status(200).json({ 
        note: fallbackNote,
        success: true,
        timeout: true,
        message: "Le traitement a pris trop de temps, attribution d'une note basée sur analyse rapide"
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: "Impossible de se connecter à Ollama. Vérifiez qu'il est bien démarré.",
        success: false
      });
    }
    
    res.status(500).json({ 
      error: "Erreur lors de la correction: " + error.message,
      success: false
    });
  } finally {
    console.timeEnd('⏱️ Temps total de traitement');
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`
✅ Serveur démarré sur http://localhost:${PORT}
🤖 Configuration:
   - Model: ${MODEL}
   - Ollama URL: ${OLLAMA_URL}
   - Limite fichiers: 5MB
   - Limite texte: 1500 caractères
   - Analyse qualitative: activée
  `);
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n👋 Arrêt du serveur...');
  process.exit(0);
});