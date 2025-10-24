import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTabsStore from "../../../stores/tabs.store";
import toast from "react-hot-toast";

const TabsModal = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    tab, 
    isEdit = false,
    idEpreuve 
}) => {
    const [titre, setTitre] = useState("");
    const [loading, setLoading] = useState(false);

    const { creerTab, modifierTab, error, clearError } = useTabsStore();

    // Initialiser le formulaire
    useEffect(() => {
        if (isOpen) {
            if (isEdit && tab) {
                setTitre(tab.titre || "");
            } else {
                setTitre("");
            }
            clearError();
        }
    }, [isOpen, isEdit, tab, clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!titre.trim()) {
            toast.error("Veuillez saisir un titre");
            return;
        }

        setLoading(true);
        try {
            if (isEdit) {
                await modifierTab(tab.id, titre);
                toast.success("Tab modifié avec succès");
            } else {
                await creerTab(idEpreuve, titre);
                toast.success("Tab créé avec succès");
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
                        className="relative z-[10000] bg-white rounded-2xl max-w-md w-full shadow-2xl border border-emerald-100/20"
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <div className="flex justify-between items-center p-6 border-b border-emerald-100">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg"
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Save className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-900">
                                        {isEdit ? "Modifier le tab" : "Créer un tab"}
                                    </h3>
                                    <p className="text-sm text-emerald-600/70">
                                        {isEdit ? "Modifiez les informations du tab" : "Ajoutez un nouveau tab à l'épreuve"}
                                    </p>
                                </div>
                            </div>
                            {!loading && (
                                <motion.button
                                    onClick={handleClose}
                                    className="p-2 rounded-xl text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
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
                                    <label className="block text-sm font-medium text-emerald-800 mb-2">
                                        Titre du tab *
                                    </label>
                                    <input
                                        type="text"
                                        value={titre}
                                        onChange={(e) => setTitre(e.target.value)}
                                        placeholder="Ex: Préparation, Documentation, etc."
                                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                                        disabled={loading}
                                        required
                                    />
                                    <p className="text-xs text-emerald-600/70 mt-2">
                                        Donnez un nom significatif à ce tab
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
                                className="flex justify-end gap-3 pt-4 border-t border-emerald-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {!loading && (
                                    <motion.button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-6 py-3 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium transition-all duration-300 min-w-24"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Annuler
                                    </motion.button>
                                )}
                                <motion.button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-w-24 flex items-center justify-center"
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

export default TabsModal;