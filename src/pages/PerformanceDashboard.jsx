import React, { useEffect, useState } from "react";
import { FaChartLine, FaCheckCircle, FaTrophy } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";

const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loadingPerformance, setLoadingPerformance] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoadingPerformance(true);
        setError(null);

        // Vérifier la session Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error("Erreur de session:", sessionError);
          navigate('/login'); // Rediriger vers la page de connexion
          return;
        }

        const response = await fetch("http://localhost:5000/performances", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setPerformanceData(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des performances:", err.message);
        setError(err.message);
        
        // Si l'erreur est liée à l'authentification, rediriger vers la page de connexion
        if (err.message.includes('Auth session missing') || err.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoadingPerformance(false);
      }
    };

    fetchPerformanceData();
  }, [navigate]);

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-6xl mb-12 px-4 mx-auto">
      <div className="bg-white/20 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl overflow-hidden">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-8 text-center flex items-center justify-center gap-3">
          <FaChartLine className="text-blue-500" />
          <span>Vos Performances</span>
        </h2>

        {/* Loading state pour les performances */}
        {loadingPerformance && (
          <div className="flex flex-col items-center py-12">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent rounded-full" />
            </div>
            <p className="text-center text-lg text-gray-100 font-medium flex items-center">
              <span>Chargement de vos performances</span>
              <span>...</span>
            </p>
          </div>
        )}

        {/* Contenu des performances */}
        {!loadingPerformance && performanceData && (
          <div>
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
              {/* Carte 1: Taux de complétion */}
              <div className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FaCheckCircle className="text-3xl text-blue-500" />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-2">
                    Taux de complétion
                  </h3>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${performanceData.completionRate}%` }}
                    ></div>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {performanceData.completionRate}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {performanceData.exercisesCompleted} sur{" "}
                    {performanceData.totalExercises} exercices
                  </p>
                </div>
              </div>

              {/* Carte 2: Score moyen */}
              <div className="bg-white/90 dark:bg-gray-700/90 p-4 sm:p-6 rounded-lg shadow-lg h-full">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <FaChartLine className="text-3xl text-green-500" />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-2">
                    Note moyenne
                  </h3>
                  <div className="w-24 h-24 relative flex items-center justify-center mb-1">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#48bb78"
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset={100 - performanceData.averageScore}
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <p className="absolute text-2xl font-bold text-green-600 dark:text-green-400">
                      {performanceData.averageScore}/20
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Moyenne de tous vos exercices
                  </p>
                </div>
              </div>

              {/* Carte 3: Meilleur score */}
              <div className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <FaTrophy className="text-3xl text-yellow-500" />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-2">
                    Meilleur note
                  </h3>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {performanceData.bestScore}/20
                  </p>
                  <div className="w-full mt-3">
                    <div className="flex justify-center items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={`star-${star}`}>
                          <svg
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                    Félicitations pour cette note!
                  </p>
                </div>
              </div>

              {/* Carte 4: Progression */}
              <div className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-3 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-center text-lg mb-4">
                    Progression mensuelle
                  </h3>
                  <div className="w-full h-20">
                    <div className="flex items-end justify-between h-full">
                      {performanceData.monthlyProgress && performanceData.monthlyProgress.length > 0 ? (
                        performanceData.monthlyProgress.map((item, index) => (
                          <div
                            key={`progress-${index}`}
                            className="flex flex-col items-center"
                          >
                            <div
                              className="w-5 bg-purple-500 rounded-t-sm"
                              style={{ height: `${item.score * 0.2}px` }}
                            />
                            <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                              {item.month}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          Aucune donnée de progression disponible
                        </p>
                      )}
                    </div>
                  </div>
                  {performanceData.monthlyProgress && performanceData.monthlyProgress.length > 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-3">
                      Evolution positive: +
                      {performanceData.monthlyProgress[
                        performanceData.monthlyProgress.length - 1
                      ].score - performanceData.monthlyProgress[0].score}
                      %
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Graphique principal et soumissions récentes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Graphique radar des compétences */}
              <div className="lg:col-span-2 bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-gray-800 dark:text-white text-center text-xl mb-6">
                  Vos compétences par domaine
                </h3>

                {/* Représentation visuelle du radar des compétences */}
                <div className="relative h-64 w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Cercles concentriques */}
                    {[0.2, 0.4, 0.6, 0.8, 1].map((radius, idx) => (
                      <div
                        key={`circle-${idx}`}
                        className="absolute border border-gray-400 dark:border-gray-500 rounded-full opacity-20"
                        style={{
                          width: `${radius * 100}%`,
                          height: `${radius * 100}%`,
                        }}
                      />
                    ))}

                    {/* Lignes de division */}
                    {performanceData.skillsRadar.map((skill, idx) => {
                      const angle =
                        (idx * 2 * Math.PI) / performanceData.skillsRadar.length;
                      return (
                        <div
                          key={`line-${idx}`}
                          className="absolute top-1/2 left-1/2 origin-bottom h-1/2 border-l border-gray-400 dark:border-gray-500 opacity-20"
                          style={{
                            transformOrigin: "bottom center",
                            transform: `rotate(${angle}rad) translateX(-50%)`,
                          }}
                        />
                      );
                    })}

                    {/* Points des compétences */}
                    <svg className="absolute inset-0" viewBox="-50 -50 100 100">
                      <polygon
                        points={performanceData.skillsRadar
                          .map((skill, idx) => {
                            const angle =
                              (idx * 2 * Math.PI) /
                              performanceData.skillsRadar.length;
                            const radius = (skill.value / 100) * 40; 
                            return `${radius * Math.sin(angle)},${
                              -radius * Math.cos(angle)
                            }`;
                          })
                          .join(" ")}
                        fill="rgba(59, 130, 246, 0.5)"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />

                      {performanceData.skillsRadar.map((skill, idx) => {
                        const angle =
                          (idx * 2 * Math.PI) /
                          performanceData.skillsRadar.length;
                        const radius = (skill.value / 100) * 40;
                        return (
                          <circle
                            key={`point-${idx}`}
                            cx={radius * Math.sin(angle)}
                            cy={-radius * Math.cos(angle)}
                            r="3"
                            fill="#3b82f6"
                            stroke="#fff"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  </div>

                  {/* Légendes des compétences */}
                  {performanceData.skillsRadar.map((skill, idx) => {
                    const angle =
                      (idx * 2 * Math.PI) /
                      performanceData.skillsRadar.length;
                    const radius = 48; // Position des étiquettes
                    const x = radius * Math.sin(angle);
                    const y = -radius * Math.cos(angle);
                    return (
                      <div
                        key={`label-${idx}`}
                        className="absolute text-xs font-medium text-gray-700 dark:text-gray-300 transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `calc(50% + ${x}px)`,
                          top: `calc(50% + ${y}px)`,
                        }}
                      >
                        {skill.skill}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Liste des soumissions récentes */}
              <div className="bg-white/90 dark:bg-gray-700/90 p-6 rounded-lg shadow-lg">
                <h3 className="font-bold text-gray-800 dark:text-white text-center text-xl mb-6">
                  Soumissions récentes
                </h3>

                <div className="space-y-4">
                  {performanceData.recentSubmissions.map((submission, idx) => (
                    <div
                      key={`submission-${idx}`}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[70%]">
                          {submission.titre}
                        </span>
                        <span
                          className={`text-sm font-bold px-2 py-1 rounded ${
                            submission.score >= 90
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : submission.score >= 70
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {submission.score}/20
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Soumis le:{" "}
                        {new Date(submission.date).toLocaleDateString()}
                      </div>
                      <Link
                        to={`/exercice/${submission.exerciceId}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                      >
                        Voir l'exercice →
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/historique"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                  >
                    <span>Voir tout l'historique</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bouton pour générer un rapport PDF */}
            <div className="mt-8 flex justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg font-bold shadow-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Télécharger votre rapport complet</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PerformanceDashboard;