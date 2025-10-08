import { LogOut, X, Shield } from "lucide-react";
import { useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
    // Bloque le scroll quand le modal est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => (document.body.style.overflow = '');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    // Variants d'animation
    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.3 }
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: { 
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: { 
            scale: 1, 
            rotate: 0,
            transition: { 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Overlay */}
                    <motion.div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                        variants={overlayVariants}
                    />
                    
                    {/* Modal */}
                    <motion.div 
                        className="relative z-[10000] bg-white rounded-2xl max-w-md w-full shadow-2xl border border-blue-100"
                        variants={modalVariants}
                    >
                        {/* En-tête avec bouton de fermeture */}
                        <div className="flex justify-between items-center p-6 border-b border-blue-100 bg-gradient-to-r">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200"
                                    variants={iconVariants}
                                >
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-blue-900">Confirmer la déconnexion</h3>
                                    <p className="text-blue-600/70 text-sm">Sécurité de votre compte</p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300"
                                aria-label="Fermer la fenêtre"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <X className="h-5 w-5" />
                            </motion.button>
                        </div>
                        
                        {/* Contenu */}
                        <motion.div 
                            className="p-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <motion.div
                                    className="p-2 rounded-lg bg-amber-100 mt-1"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                >
                                    <LogOut className="h-5 w-5 text-amber-600" />
                                </motion.div>
                                <div>
                                    <p className="text-blue-800 font-medium mb-2">
                                        Êtes-vous sûr de vouloir vous déconnecter ?
                                    </p>
                                    <p className="text-blue-600/80 text-sm">
                                        Vous devrez vous reconnecter pour accéder à nouveau à votre espace boutique.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <motion.button
                                    onClick={onClose}
                                    className="px-4 sm:px-5 py-3 sm:py-2.5 rounded-xl border border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-300 font-medium text-base sm:text-sm w-full sm:w-auto"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Annuler
                                </motion.button>
                                <motion.button
                                    onClick={handleConfirm}
                                    className="px-4 sm:px-5 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-amber-200/50 text-base sm:text-sm w-full sm:w-auto"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <LogOut className="h-4 w-4 sm:h-3 sm:w-3" />
                                        <span>Se déconnecter</span>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Pied de page sécuritaire */}
                        <motion.div 
                            className="p-4 border-t border-blue-100 bg-blue-50/30 rounded-b-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Shield className="h-3 w-3 text-blue-500" />
                                <p className="text-xs text-blue-600/70 text-center">
                                    Votre sécurité est notre priorité
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmLogoutModal;