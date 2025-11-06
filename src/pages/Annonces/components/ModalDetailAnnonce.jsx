import { useEffect } from "react";
import { 
    X, 
    Calendar, 
    Megaphone,
    FileText,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ModalDetailAnnonce = ({ isOpen, onClose, annonce }) => {

    // Gérer le overflow du body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: -20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    if (!isOpen || !annonce) return null;

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
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                        variants={backdropVariants}
                    />
                    
                    <motion.div
                        className="relative z-[10000] bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-red-100/20 max-h-[90vh] overflow-y-auto"
                        variants={modalVariants}
                    >
                        {/* Header du modal */}
                        <div className="flex justify-between items-center p-6 border-b border-red-100 sticky top-0 bg-white rounded-t-2xl z-10">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 shadow-lg"
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Megaphone className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-red-900">
                                        Détails de l'annonce
                                    </h3>
                                    <p className="text-sm text-red-600/70">
                                        Informations complètes
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="h-5 w-5" />
                            </motion.button>
                        </div>

                        {/* Contenu du modal */}
                        <div className="p-6">
                            {/* Titre */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                                        {annonce.libelle_annonce}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                            Annonce
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Informations principales */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Date */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                                        <Calendar size={18} />
                                        <span className="font-semibold">Date de publication</span>
                                    </div>
                                    <p className="text-blue-900 text-sm">
                                        {new Date(annonce.date_annonce).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {/* Statut */}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-green-700 mb-2">
                                        <Clock size={18} />
                                        <span className="font-semibold">Statut</span>
                                    </div>
                                    <p className="text-green-900 text-sm">
                                        {annonce.statut || 'Active'}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                                    <FileText size={20} />
                                    Contenu de l'annonce
                                </h2>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                        {annonce.description || 'Aucun contenu disponible'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalDetailAnnonce;