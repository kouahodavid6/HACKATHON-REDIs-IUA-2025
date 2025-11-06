import { useState, useEffect } from "react";
import { X, Save, Megaphone, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAnnoncesStore from "../../../stores/annonces.store";
import toast from "react-hot-toast";

const AnnoncesModal = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    annonce, 
    isEdit = false
}) => {
    const [libelleAnnonce, setLibelleAnnonce] = useState("");
    const [description, setDescription] = useState("");
    const [dateAnnonce, setDateAnnonce] = useState("");
    const [loading, setLoading] = useState(false);

    const { creerAnnonce, modifierAnnonce, error, clearError } = useAnnoncesStore();

    // Initialiser le formulaire
    useEffect(() => {
        if (isOpen) {
            if (isEdit && annonce) {
                setLibelleAnnonce(annonce.libelle_annonce || "");
                setDescription(annonce.description || "");
                if (annonce.date_annonce) {
                    const date = new Date(annonce.date_annonce);
                    const formattedDate = date.toISOString().split('T')[0];
                    setDateAnnonce(formattedDate);
                } else {
                    setDateAnnonce("");
                }
            } else {
                setLibelleAnnonce("");
                setDescription("");
                setDateAnnonce("");
            }
            clearError();
        }
    }, [isOpen, isEdit, annonce, clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!libelleAnnonce.trim()) {
            toast.error("Veuillez saisir un libellé");
            return;
        }

        if (!dateAnnonce) {
            toast.error("Veuillez sélectionner une date");
            return;
        }

        if (!description.trim()) {
            toast.error("Veuillez saisir une description");
            return;
        }

        setLoading(true);
        try {
            const data = {
                libelle_annonce: libelleAnnonce,
                description: description,
                date_annonce: dateAnnonce + "T00:00:00" // Format API
            };

            if (isEdit) {
                await modifierAnnonce(annonce.id, data);
                toast.success("Annonce modifiée avec succès");
            } else {
                await creerAnnonce(data);
                toast.success("Annonce créée avec succès");
            }
            onSuccess();
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    // Formater la date pour l'affichage
    const formatDisplayDate = (dateString) => {
        if (!dateString) return 'Non définie';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
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
                        className="relative z-[10000] bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-red-100/20 flex flex-col max-h-[90vh]"
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <div className="flex justify-between items-center p-6 border-b border-red-100 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg"
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Megaphone className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {isEdit ? "Modifier l'annonce" : "Créer une annonce"}
                                    </h3>
                                    <p className="text-sm text-slate-600/70">
                                        {isEdit ? "Modifiez les informations de l'annonce" : "Publiez une nouvelle annonce importante"}
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
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                            <div className="flex-1 overflow-auto p-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Champ libellé */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-800 mb-2">
                                            Titre de l'annonce *
                                        </label>
                                        <input
                                            type="text"
                                            value={libelleAnnonce}
                                            onChange={(e) => setLibelleAnnonce(e.target.value)}
                                            placeholder="Ex: Hackathon UATI 2025, Inscriptions ouvertes..."
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white"
                                            disabled={loading}
                                            required
                                        />
                                        <p className="text-xs text-slate-600/70 mt-2">
                                            Donnez un titre accrocheur et informatif à votre annonce
                                        </p>
                                    </div>

                                    {/* Champ date */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-800 mb-2">
                                            Date de l'annonce *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="date"
                                                value={dateAnnonce}
                                                onChange={(e) => setDateAnnonce(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white"
                                                disabled={loading}
                                                required
                                            />
                                        </div>
                                        {dateAnnonce && (
                                            <p className="text-xs text-slate-600/70 mt-2">
                                                {formatDisplayDate(dateAnnonce)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Champ description */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-800 mb-2">
                                            Description de l'annonce *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <FileText className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Décrivez en détail le contenu de l'annonce, les informations importantes, les actions à entreprendre..."
                                                rows={5}
                                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                                                disabled={loading}
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-slate-600/70 mt-2">
                                            Fournissez tous les détails nécessaires pour que l'annonce soit claire et complète
                                        </p>
                                    </div>

                                    {/* Affichage des erreurs */}
                                    {error && (
                                        <motion.div 
                                            className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 p-6 border-t border-slate-100 flex-shrink-0">
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
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-w-24 flex items-center justify-center"
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
                                            {isEdit ? "Modifier" : "Publier"}
                                        </motion.span>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AnnoncesModal;