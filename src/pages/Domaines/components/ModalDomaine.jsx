import { useState, useEffect } from "react";
import { X, Plus, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useDomaineStore from "../../../stores/domaines.store";
import toast from "react-hot-toast";

const ModalDomaine = ({ isOpen, onClose, onSuccess, domaine, isEdit = false }) => {
    const [titre, setTitre] = useState("");
    
    const { 
        ajouterDomaine, 
        modifierDomaine, 
        loading
    } = useDomaineStore();

    // Gérer le overflow du body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Initialiser le formulaire
    useEffect(() => {
        console.log('ModalDomaine useEffect - domaine changed:', domaine);
        if (domaine) {
            setTitre(domaine.titre || "");
        } else {
            setTitre("");
        }
    }, [domaine, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!titre.trim()) {
            toast.error("Le nom du domaine est requis");
            return;
        }

        try {
            if (isEdit && domaine) {
                await modifierDomaine(domaine.id, titre.trim());
                toast.success("Domaine modifié avec succès !");
            } else {
                await ajouterDomaine(titre.trim());
                toast.success("Domaine créé avec succès !");
            }
            
            // Fermer le modal après un court délai
            setTimeout(() => {
                onSuccess();
            }, 500);
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        }
    };

    const handleClose = () => {
        onClose();
    };

    // Animations
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
                    {/* Overlay avec backdrop blur - cliquable pour fermer */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={!loading ? handleClose : undefined}
                        aria-hidden="true"
                        variants={backdropVariants}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        className="relative z-[10000] bg-white rounded-2xl max-w-md w-full shadow-2xl border border-blue-100/20"
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <div className="flex justify-between items-center p-6 border-b border-blue-100">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg"
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    {isEdit ? (
                                        <Edit className="h-5 w-5 text-white" />
                                    ) : (
                                        <Plus className="h-5 w-5 text-white" />
                                    )}
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-blue-900">
                                        {isEdit ? "Modifier le domaine" : "Ajouter un domaine"}
                                    </h3>
                                    <p className="text-sm text-blue-600/70">
                                        {isEdit ? "Mise à jour du domaine" : "Création d'un nouveau domaine"}
                                    </p>
                                </div>
                            </div>
                            {!loading && (
                                <motion.button
                                    onClick={handleClose}
                                    className="p-2 rounded-xl text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
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
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-2">
                                        Nom du domaine
                                    </label>
                                    <input
                                        type="text"
                                        value={titre}
                                        onChange={(e) => setTitre(e.target.value)}
                                        placeholder="Ex: L1 Développement, L2 Design, etc."
                                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-blue-50/50"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Actions */}
                                <motion.div 
                                    className="flex justify-end gap-3 pt-4 border-t border-blue-100"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {!loading && (
                                        <motion.button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-6 py-3 rounded-xl border border-blue-300 text-blue-700 hover:bg-blue-50 font-medium transition-all duration-300 min-w-24"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Annuler
                                        </motion.button>
                                    )}
                                    <motion.button
                                        type="submit"
                                        disabled={loading || !titre.trim()}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-w-24 flex items-center justify-center"
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
                                                {isEdit ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                                {isEdit ? "Modifier" : "Créer"}
                                            </motion.span>
                                        )}
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalDomaine;