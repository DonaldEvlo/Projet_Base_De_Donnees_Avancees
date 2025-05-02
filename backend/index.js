const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const natural = require('natural');

const app = express();
const port = 5000; // Port fixe

app.use(express.json());
// app.use(cors()); 
app.use(cors({
  origin: ['http://localhost:5173',
    'http://localhost:4173'
  ], // 🔐 Spécifie ton front
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
    // Récupérer le token d'authentification de la requête
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authentification requise" });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Utiliser le token pour obtenir l'utilisateur depuis Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("Erreur d'authentification:", userError);
      return res.status(401).json({ error: "Session invalide ou expirée" });
    }
    
    const professeurId = userData.user.id;
    
    // D'abord, récupérer les exercices créés par ce professeur
    const { data: exercicesProf, error: exercicesError } = await supabase
      .from('exercices')
      .select('id')
      .eq('professeur_id', professeurId);
      
    if (exercicesError) {
      console.error("Erreur récupération des exercices du professeur:", exercicesError);
      return res.status(500).json({ error: exercicesError.message });
    }
    
    // Obtenir un tableau des IDs d'exercices
    const exerciceIds = exercicesProf.map(ex => ex.id);
    
    if (exerciceIds.length === 0) {
      // Si le professeur n'a pas d'exercices, retourner un tableau vide
      return res.json([]);
    }
    
    // Maintenant récupérer les notes correspondant à ces exercices
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
      `)
      .in('exercice_id', exerciceIds);
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
      
      // Important: Return note as null if not available (instead of a string)
      return {
        exercice_id: exercice.id,
        exercice: `Exercice ${exercice.id}`,
        titre: exercice.titre || 'Non défini',
        note: soumission?.notes?.note_finale !== undefined ? 
              Number(soumission.notes.note_finale) : 
              null
      };
    });
    
    res.json(notesEtExercices);
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});


//détection de plagiat
// app.post('/exercices/:id/detecter-plagiat', async (req, res) => {
//   const { id } = req.params; // ID de l'exercice
  
//   try {
//     // 1. Récupérer toutes les soumissions pour cet exercice
//     const { data: submissions, error: submissionsError } = await supabase
//       .from('soumissions')
//       .select('id, etudiant_id, fichier_reponse')
//       .eq('exercice_id', id);
    
//     if (submissionsError) {
//       console.error("Erreur lors de la récupération des soumissions:", submissionsError);
//       return res.status(500).json({ error: 'Erreur lors de la récupération des soumissions' });
//     }

//     if (!submissions || submissions.length < 2) {
//       return res.status(200).json({ 
//         message: 'Pas assez de soumissions pour détecter les plagiats',
//         plagiatDetecte: false,
//         nombrePlagiats: 0
//       });
//     }

//     // 2. Supprimer toutes les anciennes entrées de plagiat pour cet exercice
//     const { error: deleteError } = await supabase
//       .from('plagiat')
//       .delete()
//       .eq('exercice_id', id);
      
//     if (deleteError) {
//       console.error("Erreur lors de la suppression des anciens résultats:", deleteError);
//     }

//     // 3. Calculer et stocker toutes les comparaisons
//     const SIMILARITY_THRESHOLD = 0.5;
    
//     // Stocker toutes les comparaisons pour éviter les calculs redondants
//     // clé: "id1-id2" (avec id1 < id2 pour assurer la cohérence), valeur: similarité
//     const comparisonsMap = {};
    
//     // Matrice des similarités pour chaque soumission
//     const similarityMatrix = {};
//     submissions.forEach(sub => {
//       similarityMatrix[sub.id] = {
//         id: sub.id,
//         etudiant_id: sub.etudiant_id,
//         similarSubmissions: []
//       };
//     });

//     // Calculer toutes les similarités possibles (une seule fois par paire)
//     for (let i = 0; i < submissions.length; i++) {
//       for (let j = i + 1; j < submissions.length; j++) {
//         // Identifiant unique pour cette comparaison
//         const sub1 = submissions[i];
//         const sub2 = submissions[j];
        
//         // Calculer la similarité une seule fois par paire
//         const similarity = calculateSimilarity(
//           sub1.fichier_reponse,
//           sub2.fichier_reponse
//         );
        
//         // Arrondir à 2 décimales pour éviter les problèmes de précision
//         const roundedSimilarity = parseFloat(similarity.toFixed(2));
        
//         // Stocker le résultat de la comparaison
//         comparisonsMap[`${sub1.id}-${sub2.id}`] = roundedSimilarity;
        
//         // Si la similarité dépasse le seuil, mettre à jour la matrice
//         if (roundedSimilarity >= SIMILARITY_THRESHOLD) {
//           // Ajouter à la liste des similarités pour sub1
//           similarityMatrix[sub1.id].similarSubmissions.push({
//             id: sub2.id,
//             etudiant_id: sub2.etudiant_id,
//             similarity: roundedSimilarity
//           });
          
//           // Ajouter à la liste des similarités pour sub2
//           similarityMatrix[sub2.id].similarSubmissions.push({
//             id: sub1.id,
//             etudiant_id: sub1.etudiant_id,
//             similarity: roundedSimilarity
//           });
//         }
//       }
//     }

//     // 4. Identifier les cas de plagiat et enregistrer dans la base de données
//     const plagiatEntries = [];
//     const plagiatCases = [];
    
//     // Pour chaque soumission ayant des similarités, créer une entrée dans la table plagiat
//     for (const subId in similarityMatrix) {
//       const submissionData = similarityMatrix[subId];
      
//       if (submissionData.similarSubmissions.length > 0) {
//         // Calculer la similarité maximale pour cette soumission
//         const maxSimilarity = Math.max(
//           ...submissionData.similarSubmissions.map(s => s.similarity)
//         );
        
//         // Créer l'entrée pour la table plagiat
//         plagiatEntries.push({
//           soumission_id: subId,
//           exercice_id: id,
//           similarite: maxSimilarity,
//           details: JSON.stringify({
//             message: "Possibilité de plagiat détectée",
//             similarSubmissions: submissionData.similarSubmissions
//           })
//         });
        
//         // Ajouter aux cas de plagiat pour la réponse
//         plagiatCases.push({
//           soumission_id: subId,
//           etudiant_id: submissionData.etudiant_id,
//           similarite: maxSimilarity,
//           similarWith: submissionData.similarSubmissions
//         });
//       }
//     }
    
//     // Insérer toutes les entrées de plagiat en une seule opération
//     if (plagiatEntries.length > 0) {
//       const { error: insertError } = await supabase
//         .from('plagiat')
//         .insert(plagiatEntries);
        
//       if (insertError) {
//         console.error("Erreur lors de l'insertion des résultats de plagiat:", insertError);
//       }
//     }

//     // 5. Renvoyer le résultat global
//     const nombrePlagiats = plagiatCases.length;
    
//     // Transformer l'objet similarityMatrix en tableau pour la réponse
//     const soumissionsAvecSimilarites = Object.values(similarityMatrix)
//       .filter(sub => sub.similarSubmissions.length > 0);
    
//     // Liste de toutes les comparaisons pour le débogage
//     const allComparisons = Object.keys(comparisonsMap).map(key => {
//       const [id1, id2] = key.split('-');
//       return {
//         soumission1_id: id1,
//         soumission2_id: id2,
//         similarite: comparisonsMap[key]
//       };
//     });
    
//     res.status(200).json({
//       message: nombrePlagiats > 0 
//         ? `${nombrePlagiats} soumissions avec plagiat détecté` 
//         : 'Aucun plagiat détecté',
//       plagiatDetecte: nombrePlagiats > 0,
//       nombrePlagiats,
//       soumissions: soumissionsAvecSimilarites,
//       comparaisons: allComparisons
//     });
    
//   } catch (err) {
//     console.error("Erreur dans la détection de plagiat:", err);
//     res.status(500).json({ error: 'Erreur interne du serveur' });
//   }
// });




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




//détection de plagiat
app.post('/soumissions/:id/detecter-plagiat', async (req, res) => {
  const { id } = req.params; // ID de l'exercice
  
  try {
    // 1. Récupérer toutes les soumissions pour cet exercice
    const { data: submissions, error: submissionsError } = await supabase
      .from('soumissions')
      .select('id, etudiant_id, fichier_reponse')
      .eq('exercice_id', id);
    
    if (submissionsError) {
      console.error("Erreur lors de la récupération des soumissions:", submissionsError);
      return res.status(500).json({ error: 'Erreur lors de la récupération des soumissions' });
    }

    if (!submissions || submissions.length < 2) {
      return res.status(200).json({ 
        message: 'Pas assez de soumissions pour détecter les plagiats',
        plagiatDetecte: false,
        nombrePlagiats: 0
      });
    }

    // 2. Supprimer toutes les anciennes entrées de plagiat pour cet exercice
    const { error: deleteError } = await supabase
      .from('plagiat')
      .delete()
      .eq('exercice_id', id);
      
    if (deleteError) {
      console.error("Erreur lors de la suppression des anciens résultats:", deleteError);
    }

    // 3. Calculer et stocker toutes les comparaisons
    const SIMILARITY_THRESHOLD = 0.5;
    
    // Structure pour stocker toutes les comparaisons
    let allComparisons = [];
    // Structure pour stocker les cas de plagiat détectés
    let plagiatCases = [];
    // Structure pour stocker les similarités par soumission
    let similaritiesBySubmission = {};
    
    // Initialiser la structure de similarités pour chaque soumission
    submissions.forEach(sub => {
      similaritiesBySubmission[sub.id] = {
        id: sub.id,
        etudiant_id: sub.etudiant_id,
        similarSubmissions: []
      };
    });

    // Calculer toutes les similarités possibles (une seule fois par paire)
    for (let i = 0; i < submissions.length; i++) {
      for (let j = i + 1; j < submissions.length; j++) {
        const sub1 = submissions[i];
        const sub2 = submissions[j];
        
        // Calculer la similarité
        const similarity = calculateSimilarity(
          sub1.fichier_reponse,
          sub2.fichier_reponse
        );
        
        // Arrondir à 2 décimales pour éviter les problèmes de précision
        const roundedSimilarity = parseFloat(similarity.toFixed(2));
        
        // Stocker toutes les comparaisons pour la traçabilité
        allComparisons.push({
          soumission1_id: sub1.id,
          soumission2_id: sub2.id,
          similarite: roundedSimilarity
        });
        
        // Si la similarité dépasse le seuil, c'est un plagiat potentiel
        if (roundedSimilarity >= SIMILARITY_THRESHOLD) {
          const plagiatCase = {
            soumission1: {
              id: sub1.id,
              etudiant_id: sub1.etudiant_id
            },
            soumission2: {
              id: sub2.id,
              etudiant_id: sub2.etudiant_id
            },
            similarite: roundedSimilarity
          };
          
          plagiatCases.push(plagiatCase);
          
          // Ajouter à la liste des similarités pour sub1
          similaritiesBySubmission[sub1.id].similarSubmissions.push({
            id: sub2.id,
            etudiant_id: sub2.etudiant_id,
            similarity: roundedSimilarity
          });
          
          // Ajouter à la liste des similarités pour sub2
          similaritiesBySubmission[sub2.id].similarSubmissions.push({
            id: sub1.id,
            etudiant_id: sub1.etudiant_id,
            similarity: roundedSimilarity
          });
        }
      }
    }

    // 4. Identifier les cas de plagiat et enregistrer dans la base de données
    const plagiatEntries = [];
    
    // Pour chaque soumission ayant des similarités, créer une entrée dans la table plagiat
    for (const subId in similaritiesBySubmission) {
      const submissionData = similaritiesBySubmission[subId];
      
      if (submissionData.similarSubmissions.length > 0) {
        // Calculer la similarité maximale pour cette soumission
        const maxSimilarity = Math.max(
          ...submissionData.similarSubmissions.map(s => s.similarity)
        );
        
        // Créer l'entrée pour la table plagiat
        plagiatEntries.push({
          soumission_id: subId,
          exercice_id: id,
          similarite: maxSimilarity,
          details: JSON.stringify({
            message: "Possibilité de plagiat détectée",
            similaire_avec: submissionData.similarSubmissions.map(s => ({
              soumission_id: s.id,
              etudiant_id: s.etudiant_id,
              similarite: s.similarity
            }))
          })
        });
      }
    }
    
    // Insérer toutes les entrées de plagiat en une seule opération
    if (plagiatEntries.length > 0) {
      const { error: insertError } = await supabase
        .from('plagiat')
        .insert(plagiatEntries);
        
      if (insertError) {
        console.error("Erreur lors de l'insertion des résultats de plagiat:", insertError);
      }
    }

    // 5. Renvoyer le résultat global
    const nombrePlagiats = plagiatCases.length;
    
    // Transformer la structure en tableau pour l'API
    const soumissionsAvecSimilarites = Object.values(similaritiesBySubmission)
      .filter(sub => sub.similarSubmissions.length > 0);
    
    res.status(200).json({
      message: nombrePlagiats > 0 
        ? `${nombrePlagiats} cas de plagiat détectés` 
        : 'Aucun plagiat détecté',
      plagiatDetecte: nombrePlagiats > 0,
      nombrePlagiats,
      details: plagiatCases,
      soumissions: soumissionsAvecSimilarites,
      comparaisons: allComparisons
    });
    
  } catch (err) {
    console.error("Erreur dans la détection de plagiat:", err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
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

// Route pour récupérer les informations de plagiat d'une soumission
app.get('/soumissions/:id/plagiat', async (req, res) => {
  try {
    const exerciceId = req.params.id;
    
    // Récupérer toutes les soumissions pour cet exercice
    const { data: soumissions, error: soumissionsError } = await supabase
      .from('soumissions')
      .select('id, etudiant_id')
      .eq('exercice_id', exerciceId);
    
    if (soumissionsError) {
      throw soumissionsError;
    }

    if (!soumissions || soumissions.length === 0) {
      // Retourner un tableau vide si aucune soumission n'est trouvée
      return res.status(200).json([]);
    }

    // Extraire les IDs de soumission
    const soumissionIds = soumissions.map(s => s.id);
    
    // Récupérer les informations de plagiat pour ces soumissions
    const { data: plagiatInfos, error: plagiatError } = await supabase
      .from('plagiat')
      .select('*')
      .in('soumission_id', soumissionIds);
    
    if (plagiatError) {
      throw plagiatError;
    }

    // Si aucune information de plagiat n'est trouvée, retourner un tableau vide
    if (!plagiatInfos || plagiatInfos.length === 0) {
      return res.status(200).json([]);
    }

    // Récupérer les informations des étudiants associés aux soumissions
    const { data: etudiants, error: etudiantsError } = await supabase
      .from('etudiants')
      .select('id, nom');
    
    if (etudiantsError) {
      throw etudiantsError;
    }

    // Associer les informations des étudiants aux soumissions et au plagiat
    const rapportComplet = plagiatInfos.map(plagiat => {
      // Trouver la soumission correspondante
      const soumission = soumissions.find(s => s.id === plagiat.soumission_id);
      
      // Trouver l'étudiant correspondant à cette soumission
      const etudiant = etudiants.find(e => e.id === soumission?.etudiant_id);

      // Vérifier si plagiat.details existe et contient similarSubmissions
      const similaritesDetails = plagiat.details && plagiat.details.similarSubmissions 
        ? plagiat.details.similarSubmissions.map(similarSub => {
            const similarSoumission = soumissions.find(s => s.id === similarSub.id);
            const similarEtudiant = etudiants.find(e => e.id === similarSoumission?.etudiant_id);
            
            return {
              ...similarSub,
              soumission_id: similarSub.id,
              etudiant_nom: similarEtudiant?.nom || 'Inconnu'
            };
          })
        : [];

      return {
        id: plagiat.id,
        soumission_id: plagiat.soumission_id,
        etudiant_id: soumission?.etudiant_id,
        etudiant_nom: etudiant?.nom || 'Inconnu',
        similarite: plagiat.similarite,
        message: plagiat.details?.message || 'Analyse de plagiat',
        similarites: similaritesDetails
      };
    });

    res.status(200).json(rapportComplet);
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports de plagiat:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des rapports de plagiat' });
  }
});


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`); 
});

function calculateSimilarity(text1, text2) {
  if (typeof text1 !== 'string' || typeof text2 !== 'string') {
    return 0;
  }

  // 1. Normalisation des textes
  const normalize = (text) => {
    return text
      .toLowerCase()
      .replace(/[\W_]+/g, ' ')  // Supprime toute ponctuation
      .replace(/\s+/g, ' ')      // Remplace les espaces multiples
      .trim();
  };

  const normalizedText1 = normalize(text1);
  const normalizedText2 = normalize(text2);
  console.log("Texte 1 normalisé :", normalizedText1);
  console.log("Texte 2 normalisé :", normalizedText2);

  // 2. Tokenisation
  const tokenizer = new natural.WordTokenizer();
  const tokens1 = tokenizer.tokenize(normalizedText1);
  const tokens2 = tokenizer.tokenize(normalizedText2);

  if (tokens1.length === 0 || tokens2.length === 0) {
    return 0;
  }

  // 3. Construction des vecteurs de fréquence
  const buildFrequencyVector = (tokens) => {
    const freqMap = {};
    tokens.forEach(token => {
      freqMap[token] = (freqMap[token] || 0) + 1;
    });
    return freqMap;
  };

  const freqMap1 = buildFrequencyVector(tokens1);
  const freqMap2 = buildFrequencyVector(tokens2);

  // 4. Calcul de la similarité cosinus
  let dotProduct = 0;
  const allTokens = new Set([...tokens1, ...tokens2]);

  allTokens.forEach(token => {
    dotProduct += (freqMap1[token] || 0) * (freqMap2[token] || 0);
  });

  const magnitude1 = Math.sqrt(Object.values(freqMap1).reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(Object.values(freqMap2).reduce((sum, val) => sum + val * val, 0));

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  const similarity = dotProduct / (magnitude1 * magnitude2);

  return parseFloat(similarity.toFixed(2)); // Retourne un pourcentage de similarité entre 0 et 1
}
