import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

function NotesEtudiant() {
  const [exercices, setExercices] = useState([]);
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
        setUserId(data.user.id);
      } else {
        setError('Utilisateur non connecté');
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  useEffect(() => {
    if (userId) {
      const fetchExercicesEtNotes = async () => {
        try {
          const response = await fetch(`http://localhost:5000/etudiant/${userId}/notes`);
          const data = await response.json();
          
          if (response.ok) {
            setExercices(data);
          } else {
            setError(data.message || 'Erreur lors de la récupération des exercices et notes');
          }
        } catch (err) {
          setError('Erreur serveur');
        } finally {
          setLoading(false);
        }
      };
      
      fetchExercicesEtNotes();
    }
  }, [userId]);
  
  if (loading) return <div>Chargement des exercices et notes...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  return (
    <div className="notes-container">
      <h2>Mes Exercices et Notes</h2>
      {exercices.length === 0 ? (
        <p>Aucun exercice disponible.</p>
      ) : (
        <table className="notes-table">
          <thead>
            <tr>
              <th>Exercice</th>
              <th>Titre</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {exercices.map((item) => (
              <tr key={item.exercice_id}>
                <td>{item.exercice}</td>
                <td>{item.titre}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NotesEtudiant;