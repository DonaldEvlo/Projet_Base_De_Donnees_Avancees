const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 5000; // Port fixe

app.use(express.json());
app.use(cors()); 

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

// Appel de la fonction pour récupérer l'utilisateur au démarrage



// ✅ Vérifie et crée les buckets si nécessaires
const createBucketIfNotExists = async (bucketName) => {
  const { data, error } = await supabase.storage.getBucket(bucketName);
  if (!data) {
    console.log(`Le bucket "${bucketName}" n'existe pas. Création...`);
    const { error: createError } = await supabase.storage.createBucket(bucketName, { public: false });
    if (createError) console.error(`Erreur création bucket "${bucketName}":`, createError.message);
    else console.log(`✅ Bucket "${bucketName}" créé !`);
  }
};

const initializeStorage = async () => {
  await createBucketIfNotExists("exercices");
  await createBucketIfNotExists("rapports");
};

initializeStorage();

// Message de bienvenue
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Express pour le projet de BD!");
});

// Ajouter un exercice (Professeur uniquement)

//Version fonctionnelle
// app.post('/exercices', upload.single('pdf'), async (req, res) => {
//     const { commentaire, date_limite } = req.body;
//     const { file } = req;

//     if (!file) {
//         return res.status(400).json({ error: 'Fichier PDF requis' });
//     }

//     const { data, error } = await supabase.storage.from('exercices').upload(`exercice_${Date.now()}.pdf`, file.buffer, {
//         contentType: file.mimetype
//     });

//     if (error) return res.status(500).json({ error: error.message });

//     const { data: insertData, error: insertError } = await supabase.from('exercices').insert([
//         {pdf_url: data.path, commentaire, date_limite }
//     ]);

//     if (insertError) return res.status(500).json({ error: insertError.message });

//     res.status(201).json({ message: 'Exercice ajouté', exercice: insertData });
// });

// Fonction pour générer l'URL publique
const generatePublicUrl = (bucket, filePath) => {
  return `${SUPABASE_STORAGE_BASE_URL}/${bucket}/${filePath}`;
};

// Route pour l'upload
app.post('/exercices', upload.single('pdf'), async (req, res) => {
    const { commentaire, date_limite,professeur_id } = req.body;
    console.log("Proff reçu" , professeur_id)
  const { file } = req;
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
      { pdf_url: publicURL, commentaire, date_limite,professeur_id }
  ]);

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

// Soumettre un rapport (Étudiant)
// app.post('/exercices/:id/submit', upload.single('pdf'), async (req, res) => {
//     const { etudiant_id } = req.body;
//     const { file } = req;
//     const { id } = req.params;

//     if (!file) {
//         return res.status(400).json({ error: 'Fichier PDF requis' });
//     }

//     const { data, error } = await supabase.storage.from('rapports').upload(`rapport_${Date.now()}.pdf`, file.buffer, {
//         contentType: file.mimetype
//     });

//     if (error) return res.status(500).json({ error: error.message });

//     const { data: insertData, error: insertError } = await supabase.from('rapports').insert([
//         { exercice_id: id, etudiant_id, pdf_url: data.path }
//     ]);

//     if (insertError) return res.status(500).json({ error: insertError.message });

//     res.status(201).json({ message: 'Rapport soumis', rapport: insertData });
// });

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


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`); 
});
