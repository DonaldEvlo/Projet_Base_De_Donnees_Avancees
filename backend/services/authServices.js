import supabase from "../../supabaseClient";



/**
 * Inscription avec email et mot de passe.
 */
export const signUpWithEmail = async (username, email, password,role, subject) => {
  try {
    if (!username || !email || !password) {
      throw new Error("Tous les champs sont requis !");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email invalide !");
    }

    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role } // Ajout du rôle dans les metadata
      }
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!data || !data.user) {
      throw new Error("Impossible de créer l'utilisateur");
    }

    if (role == "professeur")

   { await supabase.from('professeurs').insert([
      {
        id: data.user.id,
        nom: username,
        email: data.user.email,
        mot_de_passe: password,
        matiere_nom: "BD",
        date_inscription: new Date().toISOString(),
        oauth_provider: 'email',
        oauth_id: data.user.id
      },
    ]);}

    else {
      await supabase.from('etudiants').insert([
        {
          id: data.user.id,
          nom: username,
          email: data.user.email,
          mot_de_passe: password,
          // role: role,
          date_inscription: new Date().toISOString(),
          oauth_provider: 'email',
          oauth_id: null
        },
      ]);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Erreur lors de l'inscription.");
  }
};

/**
 * Connexion avec email et mot de passe.
 */
export const signInWithEmail = async (email, password,role) => {
  if (!email || !password) {
    throw new Error("Email et mot de passe requis !");
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error("Email ou mot de passe incorrect.");
  }

  return data;
};

/**
 * Connexion OAuth avec gestion de session améliorée.
 */

export const signInWithOAuthProf =async (role, provider) => {

  try {
    console.log("🔑 Tentative de connexion avec OAuth:", provider);
    console.log("🔑 TLe role est :", role);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard-prof`,
        data: { role } // Enregistre le rôle
      },
      
    });

    if (error) throw new Error(error.message);
    console.log("✅ OAuth lancé avec succès");

    // Attendre que l'utilisateur soit bien connecté via l'écouteur d'état
    return new Promise((resolve, reject) => {
      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          console.log("🔄 Utilisateur connecté via OAuth détecté !");
          listener.subscription.unsubscribe(); // On arrête l'écoute une fois détecté
          try {
            const user = await getProf(); // Récupérer l'utilisateur en base
            resolve(user);
          } catch (err) {
            reject(err);
          }
        }
      });
    });

  } catch (err) {
    console.error("❌ Erreur OAuth:", err.message);
    throw err;
  }
};




export const getProf = async () => {
  try {
    console.log("🔍 Vérification de l'utilisateur...");

    await supabase.auth.refreshSession(); // 🔄 Forcer la récupération de session
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) throw new Error("Aucun utilisateur trouvé.");

    const user = data.user;

    console.log("🔎 Vérification de l'existence de l'utilisateur dans la base...");

    // Vérifier dans les deux tables
    const { data: professeurs } = await supabase.from('professeurs').select('*').eq('id', user.id);
  
    if ((professeurs && professeurs.length > 0) ) {
      console.log("✅ Utilisateur déjà existant en base.");

      return user;
    }

    console.log("⏳ Pause avant insertion...");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Attente de 2 secondes

    console.log("👤 Nouvel utilisateur détecté, insertion en base...");

    const provider = user.app_metadata?.provider?.toLowerCase() || "none";
    const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0] || "Utilisateur inconnu";

    // Définir une logique pour savoir si c'est un étudiant ou un professeur
    // Ici, on suppose que les emails académiques finissent par "@univ.com" pour différencier
    // const isProf = user.email.endsWith("@univ.com");
  
  
    const userData = {
      id: user.id,
      nom: userName,
      email: user.email,
      mot_de_passe: "", // Peut être ignoré si l'authentification est via OAuth
      date_inscription: new Date().toISOString(),
      oauth_provider: provider,
      oauth_id: user.id,
      matiere_nom : "BD"
    };

    // Insérer dans la bonne table
    const { error: insertError } = await supabase.from('professeurs').upsert([userData]);

    if (insertError) throw new Error(insertError.message);
    console.log(`✅ Utilisateur inséré ou mis à jour dans ${professeurs}:`, userData);

    return user;
  } catch (err) {
    console.error("❌ Erreur lors de la récupération de l'utilisateur:", err.message);
    return null;
  }
};


export const signInWithOAuthEtudiant =async (role, provider) => {

  try {
    console.log("🔑 Tentative de connexion avec OAuth:", provider);
    console.log("🔑 TLe role est :", role);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard-etudiant`,
        data: { role } // Enregistre le rôle
      },
      
    });

    if (error) throw new Error(error.message);
    console.log("✅ OAuth lancé avec succès");

    // Attendre que l'utilisateur soit bien connecté via l'écouteur d'état
    return new Promise((resolve, reject) => {
      const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          console.log("🔄 Utilisateur connecté via OAuth détecté !");
          listener.subscription.unsubscribe(); // On arrête l'écoute une fois détecté
          try {
            const user = await getEtudiant(); // Récupérer l'utilisateur en base
            resolve(user);
          } catch (err) {
            reject(err);
          }
        }
      });
    });

  } catch (err) {
    console.error("❌ Erreur OAuth:", err.message);
    throw err;
  }
};




export const getEtudiant = async () => {
  try {
    console.log("🔍 Vérification de l'utilisateur...");

    await supabase.auth.refreshSession(); // 🔄 Forcer la récupération de session
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) throw new Error("Aucun utilisateur trouvé.");

    const user = data.user;

    console.log("🔎 Vérification de l'existence de l'utilisateur dans la base...");

    // Vérifier dans les deux tables
    const { data: etudiant } = await supabase.from('etudiants').select('*').eq('id', user.id);
  
    if ((etudiant && etudiant.length > 0) ) {
      console.log("✅ Utilisateur déjà existant en base.");

      return user;
    }

    console.log("⏳ Pause avant insertion...");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Attente de 2 secondes

    console.log("👤 Nouvel utilisateur détecté, insertion en base...");

    const provider = user.app_metadata?.provider?.toLowerCase() || "none";
    const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0] || "Utilisateur inconnu";

    // Définir une logique pour savoir si c'est un étudiant ou un professeur
    // Ici, on suppose que les emails académiques finissent par "@univ.com" pour différencier
    // const isProf = user.email.endsWith("@univ.com");
  
  
    const userData = {
      id: user.id,
      nom: userName,
      email: user.email,
      mot_de_passe: "", // Peut être ignoré si l'authentification est via OAuth
      date_inscription: new Date().toISOString(),
      oauth_provider: provider,
      oauth_id: user.id,
    };

    // Insérer dans la bonne table
    const { error: insertError } = await supabase.from('etudiants').upsert([userData]);

    if (insertError) throw new Error(insertError.message);
    console.log(`✅ Utilisateur inséré ou mis à jour dans ${etudiants}:`, userData);

    return user;
  } catch (err) {
    console.error("❌ Erreur lors de la récupération de l'utilisateur:", err.message);
    return null;
  }
};


/**
 * Déconnexion de l'utilisateur.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Erreur lors de la déconnexion: " + error.message);
  }
};

export const listenToAuthChanges = (callback) => {
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(`🔄 Changement d'état de l'authentification : ${event}`);
    callback(session?.user || null);
  });

  // Retourner l'objet avec unsubscribe
  return listener.subscription.unsubscribe;
};

export const updateEtudiantProfile = () =>{};


//Vérifier si un étudiant a déjà soumis
export const checkIfExerciceSoumis = async (etudiantId, exerciceId) => {
  try {
    const { data, error } = await supabase
      .from('soumissions')
      .select('*')
      .eq('etudiant_id', etudiantId)
      .eq('exercice_id', exerciceId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // ignore "no rows found"
      throw new Error(error.message);
    }

    return data || null;
  } catch (err) {
    console.error("Erreur lors de la vérification de la soumission :", err.message);
    return null;
  }
};

export const getEtudiantById = async (userId, tableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error(`❌ Erreur récupération user dans la table ${tableName}:`, error.message);
      return null;
    }

    return data;  
  } catch (err) {
    console.error("❌ Erreur getUserById:", err.message);
    return null;
  }
};

