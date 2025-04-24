const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 5000; // Port fixe

app.use(express.json());
// app.use(cors()); 
app.use(cors({
  origin: 'http://localhost:5173', // 🔐 Spécifie ton front
  credentials: true               // 🔐 Autorise les cookies
}));

// 🔥 Définition manuelle des identifiants Supabase
SUPABASE_URL="https://sfaastgptbcmxjmxyzjt.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYWFzdGdwdGJjbXhqbXh5emp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDg2MjQsImV4cCI6MjA1Nzc4NDYyNH0.kDuYCQmO1F4D-fjxwigFjLCVQNi9zMWzKAMix3GX3PM"
const SUPABASE_STORAGE_BASE_URL = "https://sfaastgptbcmxjmxyzjt.supabase.co/storage/v1/object/public"

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const upload = multer({ storage: multer.memoryStorage() });

let userId = null; // Variable globale pour stocker l'ID utilisateur

// 🔥 Fonction pour récupérer l'utilisateur connecté
const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
  } else if (data && data.user) {
    userId = data.user.id;
    console.log("Utilisateur connecté :", userId);
  }
};


// Message de bienvenue
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Express pour le projet de BD!");
});


// Fonction pour générer l'URL publique
const generatePublicUrl = (bucket, filePath) => {
  return `${SUPABASE_STORAGE_BASE_URL}/${bucket}/${filePath}`;
};

// Route pour l'upload
app.post('/exercices', upload.single('pdf'), async (req, res) => {
    const { commentaire, date_limite,professeur_id,titre } = req.body;
    console.log("Proff reçu" , professeur_id)
  const { file } = req;
  console.log("le titre : ", titre, "le commentaire : ", commentaire, "la date limite : ", date_limite)
  const BUCKET_NAME = "exercices"; // Définir le bucket ici

  if (!file) {
      return res.status(400).json({ error: 'Fichier PDF requis' });
  }

//   const fileName = `exercice_${Date.now()}.pdf`;
const fileName = `${file.originalname}`;
const filePath = `${professeur_id}/${fileName}`;
console.log("le path ",filePath)
// Chemin sous-dossier utilisateur
console.log("le prof est : ", professeur_id)
  // Upload vers Supabase Storage
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file.buffer, {
      contentType: file.mimetype
  });

  if (error) {
      console.error("Erreur lors de l'upload :", error);
      return res.status(500).json({ error: error.message });
  }

  if (!data || !data.path) {
      console.error("Aucune donnée renvoyée après upload.");
      return res.status(500).json({ error: "Le fichier n'a pas été téléchargé correctement." });
  }

  // Génération dynamique de l'URL publique en fonction du bucket utilisé
  const publicURL = generatePublicUrl(BUCKET_NAME, data.path);

  console.log("URL publique générée :", publicURL);

  // Insérer dans la BDD
  const { data: insertData, error: insertError } = await supabase.from('exercices').insert([
      { pdf_url: publicURL, commentaire, date_limite,professeur_id, titre }
  ]).select();
  console.log("Données insérées :", insertData);
  if (insertError) {
      console.error("Erreur lors de l'insertion dans la base de données :", insertError);
      return res.status(500).json({ error: insertError.message });
  }

  res.status(201).json({ message: 'Exercice ajouté', exercice: insertData });
});







// Récupérer tous les exercices
app.get('/exercices', async (req, res) => {
    const { data, error } = await supabase.from('exercices').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Récupérer un exercice par ID
app.get('/exercices/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('exercices').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'Exercice non trouvé' });
    res.json(data);
});


app.post('/exercices/:id/submit', upload.single('pdf'), async (req, res) => {
    const { etudiant_id, exercice_id, } = req.body; // L'ID de l'étudiant (en supposant qu'il est envoyé dans le corps de la requête)
    const { file } = req; // Le fichier envoyé par l'étudiant
    const { id } = req.params; // L'ID de l'exercice, passé comme paramètre
  
    const BUCKET_NAME = "rapports"; // Bucket de stockage des rapports
  
    if (!file) {
        return res.status(400).json({ error: 'Fichier PDF requis' });
    }
  
    const fileName = `${file.originalname}`;
    const filePath = `${etudiant_id}/${fileName}`; // Chemin sous-dossier étudiant pour organiser les fichiers par étudiant
  
    console.log("L'ID de l'étudiant est : ", etudiant_id);
  
    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file.buffer, {
        contentType: file.mimetype,
    });
  
    if (error) {
        console.error("Erreur lors de l'upload :", error);
        return res.status(500).json({ error: error.message });
    }
  
    if (!data || !data.path) {
        console.error("Aucune donnée renvoyée après upload.");
        return res.status(500).json({ error: "Le fichier n'a pas été téléchargé correctement." });
    }
  
    // Génération dynamique de l'URL publique en fonction du bucket utilisé
    const publicURL = generatePublicUrl(BUCKET_NAME, data.path);
  
    console.log("URL publique générée :", publicURL);
  
    // Insérer dans la BDD (table `rapports`)
    const { data: insertData, error: insertError } = await supabase.from('soumissions').insert([
        { exercice_id: id, etudiant_id, fichier_reponse: publicURL }
    ]);
  
    if (insertError) {
        console.error("Erreur lors de l'insertion dans la base de données :", insertError);
        return res.status(500).json({ error: insertError.message });
    }
  
    res.status(201).json({ message: 'Travail soumis avec succès', rapport: insertData });
  });
  

//Afficher les exrcices publiés par un professeur
app.get('/mes-exercices', async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log("Header Authorization reçu:", authHeader);

  if (!authHeader) {
      return res.status(401).json({ error: "Token manquant" });
  }

  const token = authHeader.split(' ')[1]; // Extraction du token
  console.log("Token extrait:", token);

  // Vérification de l'utilisateur avec le token
  const { data, error: userError } = await supabase.auth.getUser(token);

  if (userError || !data || !data.user) {
      console.error("Erreur Supabase:", userError);
      return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  console.log("Utilisateur authentifié:", data.user);

  const professeurId = data.user.id; // Utiliser l'ID récupéré
  console.log("ID du professeur est :", professeurId);

  // Récupération des exercices du professeur
  const { data: exercices, error } = await supabase
      .from('exercices')
      .select('*')
      .eq('professeur_id', professeurId);

  if (error) {
      console.error("Erreur BDD:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des exercices." });
  }

  res.json(exercices);
});

//Suppression des exercices par le prof 
// Exemple avec Express.js (Backend)


app.delete('/exercices/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Récupérer l'exercice de la base de données pour obtenir l'URL du fichier
    const { data: exercice, error: dbError } = await supabase
      .from('exercices')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !exercice) {
      return res.status(400).json({ success: false, message: "Exercice introuvable" });
    }
    console.log("Exercice récupéré :", exercice);
    // Extraire le chemin du fichier
    const filePath = exercice.pdf_url.replace('https://sfaastgptbcmxjmxyzjt.supabase.co/storage/v1/object/public/exercices/', '');

    console.log("Chemin du fichier à supprimer :", filePath);
    // Supprimer le fichier de Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('exercices')
      .remove([filePath]);

    if (storageError) {ru 
      return res.status(500).json({ success: false, message: "Erreur lors de la suppression du fichier" });
    }

    // Supprimer l'exercice de la base de données
    const { error: deleteError } = await supabase
      .from('exercices')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(500).json({ success: false, message: "Erreur lors de la suppression de l'exercice" });
    }

    // Réponse de succès
    res.json({ success: true, message: "Exercice supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur interne du serveur" });
  }
});


//modfification 
app.put('/exercices/:id', upload.single('pdf'), async (req, res) => {
  const { id } = req.params; // ID de l'exercice à modifier
  const { commentaire, date_limite, professeur_id } = req.body; // Données envoyées par le professeur
  const { file } = req; // Le fichier envoyé par le professeur (si modifié)
  const BUCKET_NAME = "exercices"; // Bucket de stockage des exercices

  try {
    // Récupérer l'exercice à modifier
    const { data: exercice, error: dbError } = await supabase
      .from('exercices')
      .select('*')
      .eq('id', id)
      .single();

    console.log("Exercice récupéré :", exercice);
    if (dbError || !exercice) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }

    // Si un fichier PDF a été envoyé, l'upload du fichier
    let pdfUrl = exercice.pdf_url;
    if (file) {
      // Supprimer le fichier existant du bucket
      const existingFilePath = pdfUrl.replace(`${SUPABASE_STORAGE_BASE_URL}/exercices/`, '');
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([existingFilePath]);
      if (deleteError) {
        return res.status(500).json({ error: "Erreur lors de la suppression du fichier précédent" });
      }

      // Téléverser le nouveau fichier PDF
      const newFileName = `${file.originalname}`;
      const newFilePath = `${professeur_id}/${newFileName}`;
      const { data, error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(newFilePath, file.buffer, {
        contentType: file.mimetype
      });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message });
      }

      // Mettre à jour l'URL du fichier
      pdfUrl = generatePublicUrl(BUCKET_NAME, data.path);
    }

    // Mettre à jour les informations de l'exercice dans la base de données
    const { data: updatedData, error: updateError } = await supabase
      .from('exercices')
      .update({ commentaire, date_limite, pdf_url: pdfUrl })
      .eq('id', id)
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    res.status(200).json({ message: 'Exercice mis à jour avec succès', exercice: updatedData });
  } catch (err) {
    console.error("Erreur lors de la modification de l'exercice :", err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});



//Récupérer les rapports soumis par un étudiant
app.get("/exercices/:exerciseId/soumissions", async (req, res) => {
  const { exerciseId } = req.params;

  try {
    console.log("ID d'exercice reçu :", exerciseId);
    // Requête Supabase pour récupérer les soumissions d'un exercice
    const { data, error } = await supabase
      .from('soumissions')  // Assure-toi que le nom de la table est correct
      .select('*')  // Sélectionne toutes les colonnes
      .eq('exercice_id', exerciseId);  // Filtrer les soumissions par ID d'exercice
    console.log("Données récupérées :", data.length);
    if (error) {
      console.error("Erreur Supabase:", error);
      return res.status(500).json({ message: "Erreur serveur lors de la récupération des soumissions." });
    }

    if (!data || data.length === 0) {
      return res.status(200).json({ message: "Aucune soumission trouvée pour cet exercice." });
    }

    // Répondre avec les soumissions
    res.status(200).json(data);
  } catch (err) {
    console.error("Erreur dans la requête :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});


app.post("/:submissionId/noter", async (req, res) => {
  const { submissionId } = req.params;
  const { grade,exerciseId } = req.body;

  console.log("ID de soumission reçu :", submissionId);
  console.log("Note reçue :", grade);
  console.log("ID d'exercice reçu :", exerciseId);

  if (!grade) {
    return res.status(400).json({ message: "La note est requise." });
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .insert({ note_professeur: grade, note_ia : grade , soumission_id : submissionId , exercice_id : exerciseId})
      .select()
      ;

    console.log("Données insérées :", data);

    if (error) {
      console.error("Erreur Supabase:", error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour de la note." });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Soumission non trouvée." });
    }

    res.status(200).json({ message: "Note ajoutée avec succès", soumission: data[0] });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});


//Voir toutes les notes données par le prof
app.get('/professeur/notes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        note_finale,
        soumission_id,
        exercice_id,
        soumissions (
          id,
          etudiant_id,
          exercice_id,
          etudiants (
            nom
          )
        )
      `);

    if (error) {
      console.error("Erreur récupération des notes :", error);
      return res.status(500).json({ error: error.message });
    }

    const notes = data.map(n => ({
      exercice: `Exercice ${n.exercice_id}`,
      etudiant: n.soumissions?.etudiants?.nom || 'Étudiant inconnu',
      note: n.note_finale ?? 'Non notée'
    }));

    res.json(notes);
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

//Récupérer les notes d'un étudiant
app.get('/etudiant/:id/notes', async (req, res) => {
  const { id } = req.params;

  try {
    // First, get all available exercises
    const { data: exercices, error: exercicesError } = await supabase
      .from('exercices')
      .select('*')
      .order('id');

    if (exercicesError) {
      console.error("Erreur récupération des exercices:", exercicesError);
      return res.status(500).json({ error: exercicesError.message });
    }

    // Then, get the student's submissions and notes
    const { data: soumissions, error: soumissionsError } = await supabase
      .from('soumissions')
      .select(`
        id,
        etudiant_id,
        exercice_id,
        notes (
          note_finale
        )
      `)
      .eq('etudiant_id', id);

    if (soumissionsError) {
      console.error("Erreur récupération des soumissions:", soumissionsError);
      return res.status(500).json({ error: soumissionsError.message });
    }

    // Map exercises and merge with submission data
    const notesEtExercices = exercices.map(exercice => {
      // Find submission for this exercise if it exists
      const soumission = soumissions?.find(s => s.exercice_id === exercice.id);
      
      return {
        exercice_id: exercice.id,
        exercice: `Exercice ${exercice.id}`,
        titre: exercice.titre || 'Non défini', // Using titre instead of commentaire, with default value
        note: soumission?.notes?.note_finale || 'Pas encore de note'
      };
    });
    
    res.json(notesEtExercices);
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

//Performances
app.get('/performances', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const token = authHeader.split(' ')[1];
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData) {
      return res.status(401).json({ error: 'Token invalide' });
    }
    if (userError) throw userError;

    const userId = userData.user.id;

    // Fetch all submissions and notes for the student
    const { data: submissions, error: submissionsError } = await supabase
      .from('soumissions')
      .select(`
        id,
        exercice_id,
        date_soumission,
        exercices (
          pdf_url,
          commentaire
        ),
        notes (
          note_finale
        )
      `)
      .eq('etudiant_id', userId)
      .order('date_soumission', { ascending: false });

    if (submissionsError) throw submissionsError;

    const { data: exercices, error: exercicesError } = await supabase
      .from('exercices')
      .select(`*
      `);

    if (exercicesError) throw exercicesError;

    // Calculate performance metrics
    const totalExercises = exercices.length;
    const completedExercises = submissions.filter(s => s.notes).length;
    const scores = submissions
      .filter(s => s.notes)
      .map(s => s.notes.note_finale);

    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;
    const bestScore = scores.length > 0 
      ? Math.round(Math.max(...scores)) 
      : 0;

    // Get recent submissions
    const recentSubmissions = submissions
      .slice(0, 3)
      .map(sub => ({
        id: sub.id,
        exerciceId: sub.exercice_id,
        titre: sub.exercices.commentaire || `Exercice ${sub.exercice_id}`,
        score: sub.notes ? Math.round(sub.notes.note_finale) : 0,
        date: sub.date_soumission
      }));

    // Calculate monthly progress
    const monthlyScores = new Map();
    submissions.forEach(sub => {
      if (sub.notes) {
        const month = new Date(sub.date_soumission).toLocaleString('fr', { month: 'short' });
        if (!monthlyScores.has(month)) {
          monthlyScores.set(month, []);
        }
        monthlyScores.get(month).push(sub.notes.note_finale);
      }
    });

    const monthlyProgress = Array.from(monthlyScores.entries())
      .map(([month, scores]) => ({
        month,
        score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      }))
      .slice(-4);

    res.json({
      completionRate: Math.round((completedExercises / totalExercises) * 100) || 0,
      averageScore,
      bestScore,
      exercisesCompleted: completedExercises,
      totalExercises,
      recentSubmissions,
      monthlyProgress,
      skillsRadar: [
        { skill: "SQL Basique", value: averageScore },
        { skill: "Jointures", value: averageScore },
        { skill: "Agrégation", value: averageScore },
        { skill: "Optimisation", value: averageScore },
        { skill: "Normalisation", value: averageScore }
      ]
    });

  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ error: error.message });
  }
});

//Performances des étudiants
app.get('/performance-etudiants', async (req, res) => {
  try {
    // Récupérer le token d'autorisation de l'en-tête
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant ou invalide' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier et décoder le token avec Supabase
    const { data: { user }, error: jwtError } = await supabase.auth.getUser(token);
    
    if (jwtError || !user) {
      return res.status(401).json({ error: 'Token invalid ou expiré' });
    }
    
    // Récupérer les informations du professeur à partir de l'ID utilisateur
    const { data: professeur, error: professeurError } = await supabase
      .from('professeurs')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (professeurError || !professeur) {
      return res.status(401).json({ error: 'Professeur non trouvé' });
    }
    
    const professeurId = professeur.id;
    
    // Le reste du code reste inchangé
    
    // Récupérer le nombre total d'étudiants
    const { data: etudiantsData, error: etudiantsError } = await supabase
      .from('etudiants')
      .select('count');
    
    if (etudiantsError) throw etudiantsError;
    
    const totalEtudiants = parseInt(etudiantsData[0].count);
    
    // Récupérer les exercices du professeur connecté
    const { data: exercicesData, error: exercicesError } = await supabase
      .from('exercices')
      .select('id, commentaire')
      .eq('professeur_id', professeurId);
    
    if (exercicesError) throw exercicesError;
    
    // Si aucun exercice trouvé pour ce professeur
    if (exercicesData.length === 0) {
      return res.json({
        averageScore: 0,
        totalStudents: totalEtudiants,
        completionRate: 0,
        recentSubmissions: 0,
        topPerformers: [],
        needHelp: [],
        courseStats: []
      });
    }
    
    // Créer un tableau des IDs des exercices du professeur
    const exerciceIds = exercicesData.map(ex => ex.id);
    
    // Récupérer toutes les notes pour les exercices du professeur connecté
    const { data: notesData, error: notesError } = await supabase
      .from('notes')
      .select(`
        note_finale,
        soumission_id,
        exercice_id,
        soumissions (
          etudiant_id,
          date_soumission,
          etudiants (
            nom
          )
        )
      `)
      .in('exercice_id', exerciceIds);
    
    if (notesError) throw notesError;
    
    // Calculer la moyenne des notes (sur 20)
    const totalNotes = notesData.reduce((sum, note) => sum + note.note_finale, 0);
    const averageScore = notesData.length > 0 ? (totalNotes / notesData.length) : 0;
    
    // Calculer le taux de complétion (en pourcentage)
    const totalSoumissions = notesData.length;
    const totalPossibleSoumissions = totalEtudiants * exercicesData.length;
    const completionRate = totalPossibleSoumissions > 0 
      ? Math.round((totalSoumissions / totalPossibleSoumissions) * 100) 
      : 0;
    
    // Récupérer les soumissions récentes (dernières 24 heures)
    const hier = new Date();
    hier.setDate(hier.getDate() - 1);
    
    const soumissionsRecentes = notesData.filter(note => 
      new Date(note.soumissions.date_soumission) > hier
    ).length;
    
    // Trouver les meilleurs étudiants
    // Créer un dictionnaire pour stocker les moyennes par étudiant
    const etudiantsMoyennes = {};
    
    notesData.forEach(note => {
      const etudiantId = note.soumissions.etudiant_id;
      const etudiantNom = note.soumissions.etudiants.nom;
      
      if (!etudiantsMoyennes[etudiantId]) {
        etudiantsMoyennes[etudiantId] = {
          id: etudiantId,
          name: etudiantNom,
          // Modification: utilisez uniquement la première lettre du nom pour l'avatar
          avatar: etudiantNom.charAt(0).toUpperCase(),
          totalScore: 0,
          count: 0
        };
      }
      
      etudiantsMoyennes[etudiantId].totalScore += note.note_finale;
      etudiantsMoyennes[etudiantId].count += 1;
    });
    
    // Calculer la moyenne pour chaque étudiant (sur 20)
    const etudiantsAvecMoyennes = Object.values(etudiantsMoyennes).map(etudiant => {
      return {
        ...etudiant,
        score: parseFloat((etudiant.totalScore / etudiant.count).toFixed(2))
      };
    });
    
    // Trier et récupérer les 3 meilleurs
    const topPerformers = etudiantsAvecMoyennes
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    // Récupérer les étudiants en difficulté (moyenne < 10/20)
    const needHelp = etudiantsAvecMoyennes
      .filter(etudiant => etudiant.score < 10)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
    
    // Statistiques par exercice
    const exerciceStats = {};
    
    exercicesData.forEach(exercice => {
      exerciceStats[exercice.id] = {
        name: exercice.commentaire || `Exercice ${exercice.id}`,
        submissions: 0,
        totalScore: 0,
        count: 0
      };
    });
    
    // Remplir les stats pour chaque exercice
    notesData.forEach(note => {
      if (exerciceStats[note.exercice_id]) {
        exerciceStats[note.exercice_id].submissions += 1;
        exerciceStats[note.exercice_id].totalScore += note.note_finale;
        exerciceStats[note.exercice_id].count += 1;
      }
    });
    
    // Calculer les moyennes et taux de complétion par exercice
    const courseStats = Object.values(exerciceStats).map(stat => {
      // Modification: conversion des notes en pourcentage pour correspondre au frontend
      const averageScoreOnTwenty = stat.count > 0 ? (stat.totalScore / stat.count) : 0;
      const averageScorePercent = Math.round((averageScoreOnTwenty / 20) * 100);
      
      return {
        name: stat.name,
        // Le frontend attend les scores en pourcentage (0-100%)
        averageScore: averageScorePercent,
        submissions: stat.submissions,
        completion: Math.round((stat.submissions / totalEtudiants) * 100)
      };
    });
    
    // Créer l'objet de réponse
    const responseData = {
      averageScore: parseFloat(averageScore.toFixed(2)),
      totalStudents: totalEtudiants,
      completionRate: completionRate,
      recentSubmissions: soumissionsRecentes,
      topPerformers: topPerformers,
      needHelp: needHelp,
      courseStats: courseStats
    };
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des données' });
  }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`); 
});
