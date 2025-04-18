import React, { useEffect, useState } from 'react';

const NotesParProf = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const chargerLesNotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/professeur/notes', {
          credentials: 'include' // si tu utilises des cookies de session
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des notes');
        }

        const data = await response.json();
        console.log("Notes reçues :", data);
        setNotes(data);
      } catch (err) {
        console.error(err);
        setErreur('Impossible de charger les notes');
      } finally {
        setLoading(false);
      }
    };

    chargerLesNotes();
  }, []);

  if (loading) return <p>Chargement en cours...</p>;
  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Notes attribuées par le professeur</h2>

      {notes.length === 0 ? (
        <p>Aucune note trouvée.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', marginTop: '20px', width: '100%' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Exercice</th>
              <th>Étudiant</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{note.exercice}</td>
                <td>{note.etudiant}</td>
                <td>{note.note !== null ? note.note : 'Non notée'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NotesParProf;
