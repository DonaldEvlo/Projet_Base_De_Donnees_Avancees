const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const app = express();
const PORT = 5001;
app.use(cors());

// Configuration de multer pour stocker temporairement les fichiers
const upload = multer({ dest: 'uploads/' });

app.post('/api/correct', upload.single('pdf'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        const pdfBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(pdfBuffer);
        const fileContent = data.text;
        fs.unlinkSync(filePath); // Suppression après traitement

        const prompt = `
Tu es un professeur strict. Donne une note sur 20 à cet exercice d'étudiant, sans aucune explication :

${fileContent}

Réponds uniquement avec le nombre, sans justification.
`.trim();

        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'deepseek-r1:7b',
            prompt: prompt,
            stream: false
        });

        const raw = response.data.response;
        const match = raw.match(/\b\d{1,2}\b/);
        const note = match ? parseInt(match[0]) : 10;

        res.json({ note });
    } catch (error) {
        console.error("❌ Erreur lors de la correction :", error);
        res.status(500).json({ error: "Erreur lors de la correction." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Serveur en cours sur http://localhost:${PORT}`);
});
