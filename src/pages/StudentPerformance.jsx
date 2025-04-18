import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  FaBook,
  FaChartBar,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMedal,
  FaUserGraduate
} from 'react-icons/fa';

const StudentPerformanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Changer l'URL par celle de votre API
        const response = await fetch('http://localhost:5000/performance-etudiants');
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setPerformanceData(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Impossible de charger les données de performance");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Variants pour les animations
  const performanceVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: (value) => ({
      width: `${value}%`,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
    })
  };

  const floatingAnimation = {
    y: [0, -4, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  };

  // Composant pour les cartes de statistiques
  const StatCard = ({ icon, value, label, color, variants, progress }) => (
    <motion.div
      variants={variants}
      className={`bg-white/70 dark:bg-gray-700/70 p-6 rounded-xl shadow-lg relative overflow-hidden`}
    >
      <div className="relative z-10 flex items-center gap-4">
        <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}>
          {icon}
        </div>
        <div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h4>
          <p className="text-gray-500 dark:text-gray-300">{label}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-600 w-full">
        <motion.div 
          className={`h-full bg-${color}-500`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <FaChartLine className="text-5xl text-blue-500" />
          </motion.div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200">
            Chargement des données...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">
            <FaExclamationTriangle />
          </div>
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-4">
            {error}
          </h2>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {performanceData && (
          <motion.div
            key="performance"
            variants={performanceVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/20 dark:bg-gray-800/70 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full border border-white/20 mb-8 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.2, duration: 0.6 }
              }}
              className="flex flex-col items-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3
                }}
              >
                <motion.span
                  animate={floatingAnimation}
                  className="text-4xl mb-3 inline-block"
                >
                  <FaUserGraduate className="text-4xl text-blue-500" />
                </motion.span>
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold text-center text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 0.4, 
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }}
              >
                Performance des Étudiants
              </motion.h2>
              
              <motion.div 
                className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded mt-4"
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: 80, 
                  opacity: 1,
                  transition: {
                    delay: 0.6,
                    duration: 0.5
                  }
                }}
              />
            </motion.div>

            {/* Performance stats overview */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <StatCard 
                icon={<FaChartLine className="text-2xl text-blue-500" />}
                value={`${performanceData.averageScore}/20`}
                label="Note Moyenne"
                color="blue"
                variants={statCardVariants}
                progress={performanceData.averageScore}
              />
              
              <StatCard 
                icon={<FaUserGraduate className="text-2xl text-green-500" />}
                value={performanceData.totalStudents}
                label="Étudiants Actifs"
                color="green"
                variants={statCardVariants}
                progress={90}
              />
              
              <StatCard 
                icon={<FaCheckCircle className="text-2xl text-indigo-500" />}
                value={`${performanceData.completionRate}%`}
                label="Taux de Complétion"
                color="indigo"
                variants={statCardVariants}
                progress={performanceData.completionRate}
              />
              
              <StatCard 
                icon={<FaChartBar className="text-2xl text-purple-500" />}
                value={performanceData.recentSubmissions}
                label="Soumissions Récentes"
                color="purple"
                variants={statCardVariants}
                progress={65}
              />
            </motion.div>

            {/* Students performance detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top performers */}
              <motion.div
                variants={cardVariants}
                className="bg-white/70 dark:bg-gray-700/70 rounded-xl p-6 shadow-lg h-full"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <FaMedal className="text-yellow-500" />
                  <span>Top Performers</span>
                </h3>
                
                <div className="space-y-4">
                  {performanceData.topPerformers.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: 0.5 + index * 0.1 }
                      }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-500' : 
                          'bg-orange-500'
                        } flex items-center justify-center text-white font-bold`}>
                          {student.avatar}
                        </div>
                        <span className="font-medium dark:text-white">{student.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600 dark:text-green-400">{student.score}/20</span>
                        <div className="text-xs px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full font-medium">
                          {index === 0 ? '1er' : index === 1 ? '2ème' : '3ème'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Students needing help */}
              <motion.div
                variants={cardVariants}
                className="bg-white/70 dark:bg-gray-700/70 rounded-xl p-6 shadow-lg h-full"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <FaExclamationTriangle className="text-orange-500" />
                  <span>Étudiants en Difficulté</span>
                </h3>
                
                <div className="space-y-4">
                  {performanceData.needHelp.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: 0.5 + index * 0.1 }
                      }}
                      className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border-l-4 border-red-500"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                          {student.avatar}
                        </div>
                        <span className="font-medium dark:text-white">{student.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-600 dark:text-red-400">{student.score}/20</span>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-xs px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                        >
                          Contacter
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {performanceData.needHelp.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        transition: { delay: 0.7 }
                      }}
                      className="mt-4 text-center"
                    >
                      <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/40 text-red-800 dark:text-red-200 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-700/50 transition-all flex items-center gap-2 mx-auto"
                      >
                        <span>Voir tous les étudiants en difficulté</span>
                        <span className="text-xs bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          {performanceData.needHelp.length}
                        </span>
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {performanceData.needHelp.length === 0 && (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Aucun étudiant en difficulté pour le moment.
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Courses performance */}
              <motion.div
                variants={cardVariants}
                className="bg-white/70 dark:bg-gray-700/70 rounded-xl p-6 shadow-lg h-full"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <FaBook className="text-indigo-500" />
                  <span>Performance par Exercice</span>
                </h3>
                
                <div className="space-y-6">
                  {performanceData.courseStats.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.5 + index * 0.1 }
                      }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{course.name}</span>
                        <span className={`font-bold ${
                          course.averageScore >= 80 ? 'text-green-600 dark:text-green-400' :
                          course.averageScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {course.averageScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <motion.div 
                          className={`h-2.5 rounded-full ${
                            course.averageScore >= 80 ? 'bg-green-500' :
                            course.averageScore >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          custom={course.averageScore}
                          variants={progressVariants}
                          initial="initial"
                          animate="animate"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{course.submissions} soumissions</span>
                        <span>{course.completion}% de complétion</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { delay: 0.8 }
                  }}
                  className="mt-6 text-center"
                >
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 bg-indigo-100 dark:bg-indigo-800/40 text-indigo-800 dark:text-indigo-200 rounded-md font-medium hover:bg-indigo-200 dark:hover:bg-indigo-700/50 transition-all"
                  >
                    Rapport détaillé par Exercice
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
            
            {/* View detailed report button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.9, duration: 0.5 }
              }}
              className="mt-8 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                <FaChartLine />
                <span>Voir le rapport analytique complet</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentPerformanceDashboard;