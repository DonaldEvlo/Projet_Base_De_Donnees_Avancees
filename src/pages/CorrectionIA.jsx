import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function CorrectionIA() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setMessage("Fichier sélectionné avec succès !");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return setMessage("Veuillez sélectionner un fichier PDF.");

        const formData = new FormData();
        formData.append("pdf", file);
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/correct", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setResult(data.note);
            setMessage("Correction réussie ✅");
        } catch (error) {
            console.error("❌ Erreur lors de la correction :", error);
            setMessage("Erreur lors de la correction.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black flex flex-col items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700"
            >
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    📘 obtenez votre note via l'IA
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div
                        onClick={triggerFileInput}
                        className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-zinc-500 p-8 rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 hover:border-gray-500 transition"
                    >
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <p className="text-gray-700 dark:text-gray-300">
                            {file ? `Fichier sélectionné : ${file.name}` : "Cliquez ici pour choisir un fichier PDF"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Taille max : 5 Mo</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className={`w-full py-3 px-6 rounded-md text-white font-semibold transition duration-300 ${
                            loading || !file
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Correction en cours..." : "Corriger"}
                    </button>
                </form>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mt-6 p-3 rounded-md text-center font-medium ${
                                message.includes("succès") || message.includes("réussie")
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            }`}
                        >
                            {message}
                        </motion.div>
                    )}

                    {result !== null && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 text-center text-xl font-semibold text-gray-800 dark:text-white"
                        >
                            ✨ Note attribuée par l'IA : <span className="text-blue-600 dark:text-blue-400">{result} / 20</span>
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default CorrectionIA;
