import { useState, useEffect } from "react";
import { X, Save, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useProgrammesStore from "../../../stores/programmes.store";
import toast from "react-hot-toast";

const ProgrammeModal = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    programme, 
    isEdit = false
}) => {
    const [titre, setTitre] = useState("");
    const [loading, setLoading] = useState(false);

    const { creerProgramme, modifierProgramme, error, clearError } = useProgrammesStore();

    // Initialiser le formulaire
    useEffect(() => {
        if (isOpen) {
            if (isEdit && programme) {
                setTitre(programme.titre || "");
            } else {
                setTitre("");
            }
            clearError();
        }
    }, [isOpen, isEdit, programme, clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!titre.trim()) {
            toast.error("Veuillez saisir un titre");
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await modifierProgramme(programme.id, { titre });
                toast.success("Programme modifié avec succès");
            } else {
                await creerProgramme({ titre });
                toast.success("Programme créé avec succès");
            }
            onSuccess();
        } catch (error) {
            console.error("Erreur:", error);
            // L'erreur est gérée par le store
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: -20
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={backdropVariants}
                >
                    {/* Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={handleClose}
                        aria-hidden="true"
                        variants={backdropVariants}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        className="relative z-[10000] bg-white rounded-2xl max-w-md w-full shadow-2xl border border-purple-100/20"
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <div className="flex justify-between items-center p-6 border-b border-purple-100">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg"
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Calendar className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {isEdit ? "Modifier le programme" : "Créer un programme"}
                                    </h3>
                                    <p className="text-sm text-slate-600/70">
                                        {isEdit ? "Modifiez les informations du programme" : "Ajoutez un nouveau programme au hackathon"}
                                    </p>
                                </div>
                            </div>
                            {!loading && (
                                <motion.button
                                    onClick={handleClose}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all duration-200"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Fermer la fenêtre"
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                            )}
                        </div>

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {/* Champ titre */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-800 mb-2">
                                        Titre du programme *
                                    </label>
                                    <input
                                        type="text"
                                        value={titre}
                                        onChange={(e) => setTitre(e.target.value)}
                                        placeholder="Ex: Première Journée, Cérémonie d'ouverture..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                                        disabled={loading}
                                        required
                                    />
                                    <p className="text-xs text-slate-600/70 mt-2">
                                        Donnez un nom significatif à ce programme (ex: journée, événement, activité)
                                    </p>
                                </div>

                                {/* Affichage des erreurs */}
                                {error && (
                                    <motion.div 
                                        className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Actions */}
                            <motion.div 
                                className="flex justify-end gap-3 pt-4 border-t border-slate-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {!loading && (
                                    <motion.button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-all duration-300 min-w-24"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Annuler
                                    </motion.button>
                                )}
                                <motion.button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium shadow-lg shadow-purple-500/25 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-w-24 flex items-center justify-center"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {loading ? (
                                        <motion.div 
                                            className="flex items-center gap-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            {isEdit ? "Modification..." : "Création..."}
                                        </motion.div>
                                    ) : (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Save className="h-4 w-4" />
                                            {isEdit ? "Modifier" : "Créer"}
                                        </motion.span>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProgrammeModal;