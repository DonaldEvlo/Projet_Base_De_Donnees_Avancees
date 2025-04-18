import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient'; // Assure-toi que c'est bien initialisé

function NotesEtudiant() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setError("Erreur lors de la récupération de l'utilisateur");
        setLoading(false);
      } else if (data?.user) {
        setUserId(data.user.id); // Assure-toi d'utiliser data.user.id
      } else {
        setError('Utilisateur non connecté');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchNotes = async () => {
        try {
          const response = await fetch(`http://localhost:5000/etudiant/${userId}/notes`);
          const data = await response.json();

          if (response.ok) {
            setNotes(data);
          } else {
            setError(data.message || 'Erreur lors de la récupération des notes');
          }
        } catch (err) {
          setError('Erreur serveur');
        } finally {
          setLoading(false);
        }
      };

      fetchNotes();
    }
  }, [userId]);

  if (loading) return <div>Chargement des notes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Mes Notes</h2>
      {notes.length === 0 ? (
        <p>Aucune note trouvée pour cet étudiant.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Exercice</th>
              <th>Commentaire</th>
              <th>PDF</th>
              <th>Date Limite</th>
              <th>Note Finale</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={index}>
                <td>{note.exercice}</td>
                <td>{note.commentaire}</td>
                <td>
                  <a href={note.pdf_url} target="_blank" rel="noopener noreferrer">Télécharger</a>
                </td>
                <td>{new Date(note.date_limite).toLocaleDateString()}</td>
                <td>{note.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NotesEtudiant;
