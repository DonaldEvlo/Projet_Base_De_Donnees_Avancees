import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";

const StudentPerformance = () => {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    // Simuler une requête pour récupérer les données des performances
    const fetchPerformanceData = async () => {
      try {
        // Remplacez par une vraie requête à votre backend (par ex. Supabase)
        const mockData = [
          { id: 1, name: "Étudiant 1", score: 85, progress: 90 },
          { id: 2, name: "Étudiant 2", score: 70, progress: 65 },
          // ...
        ];
        setPerformanceData(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false);
      }
    };
    fetchPerformanceData();
  }, []);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Performances des Étudiants
        </h1>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceData.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <FaChartLine className="text-blue-500 text-3xl" />
                  <div>
                    <h3 className="text-xl font-semibold">{student.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Score: {student.score}/100
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Progression: {student.progress}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentPerformance;