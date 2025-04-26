// RapportPlagiat.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RapportPlagiat = () => {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // ID de l'exercice

  useEffect(() => {
    const fetchRapportsPlagiat = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/soumissions/${id}/plagiat`);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Vérifier que data est bien un tableau
        if (Array.isArray(data)) {
          setRapports(data);
        } else {
          console.error("Les données reçues ne sont pas un tableau:", data);
          setRapports([]);  // Initialiser avec un tableau vide
        }
        
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des rapports de plagiat");
        setLoading(false);
        console.error("Erreur:", err);
      }
    };

    fetchRapportsPlagiat();
  }, [id]);

  if (loading) return <div className="text-center py-8">Chargement des rapports de plagiat...</div>;
  
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  
  if (!rapports || rapports.length === 0) return <div className="text-center py-8">Aucun rapport de plagiat disponible pour cet exercice.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Rapports de plagiat pour l'exercice #{id}</h1>
      
      {Array.isArray(rapports) && rapports.map((rapport) => (
        <div key={rapport.id} className="mb-8 p-6 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                Soumission de {rapport.etudiant_nom}
              </h2>
              <p className="text-gray-600">ID de soumission: {rapport.soumission_id}</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-medium ${
              rapport.similarite > 0.7 
                ? 'bg-red-100 text-red-800' 
                : rapport.similarite > 0.5 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
            }`}>
              Similarité: {Math.round(rapport.similarite * 100)}%
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">{rapport.message}</h3>
            
            {rapport.similarites && rapport.similarites.length > 0 ? (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Soumissions similaires:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {rapport.similarites.map((similarite) => (
                    <li key={similarite.soumission_id}>
                      <span className="font-medium">{similarite.etudiant_nom}</span>
                      <span className="text-gray-600"> (ID: {similarite.soumission_id})</span>
                      <span className="ml-2 text-gray-800">
                        - Similarité: {Math.round(similarite.similarity * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Aucune similarité détectée avec d'autres soumissions.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RapportPlagiat;