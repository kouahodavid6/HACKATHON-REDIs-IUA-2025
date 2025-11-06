import { useState, useEffect } from "react";
import { 
    X, 
    Calendar, 
    Tag, 
    Image as ImageIcon,
    Loader,
    Clock,
    FolderOpen,
    List,
    Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../api/config";

const ModalDetailEpreuve = ({ isOpen, onClose, epreuve }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const navigate = useNavigate();

    const API_BASE_URL = API_URL;

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        const cleanPath = imagePath.replace('url_image/', '');
        return `${API_BASE_URL}/storage/${cleanPath}`;
    };

    const imageUrl = epreuve ? getImageUrl(epreuve.url_image || epreuve.image_url) : null;

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };



    // Gérer le overflow du body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleManageTabs = () => {
        if (epreuve?.id) {
            navigate(`/tabs/${epreuve.id}`);
            onClose();
        }
    };

    const handleManageQuestions = () => {
        if (epreuve?.id) {
            navigate(`/questions/${epreuve.id}`);
            onClose();
        }
    };

    const handleViewRanking = () => {
        if (epreuve?.id) {
            navigate(`/classement-epreuve/${epreuve.id}`);
            onClose();
        }
    };

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

    if (!isOpen || !epreuve) return null;

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
                        className="relative z-[10000] bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-blue-100/20 max-h-[90vh] overflow-y-auto"
                        variants={modalVariants}
                    >
                        {/* Header du modal */}
                        <div className="flex justify-between items-center p-6 border-b border-blue-100 sticky top-0 bg-white rounded-t-2xl z-10">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg"
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <ImageIcon className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-blue-900">
                                        Détails de l'épreuve
                                    </h3>
                                    <p className="text-sm text-blue-600/70">
                                        Informations complètes
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="p-2 rounded-xl text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="h-5 w-5" />
                            </motion.button>
                        </div>

                        {/* Contenu du modal */}
                        <div className="p-6">
                            {/* Image */}
                            <div className="relative h-64 bg-gray-100 rounded-lg mb-6">
                                {imageUrl ? (
                                    <>
                                        {imageLoading && (
                                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 rounded-lg">
                                                <Loader className="animate-spin text-gray-400" size={32} />
                                                <span className="text-gray-500 ml-2">Chargement de l'image...</span>
                                            </div>
                                        )}
                                        
                                        {imageError ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 rounded-lg">
                                                <ImageIcon size={48} />
                                                <span className="mt-2">Erreur de chargement de l'image</span>
                                            </div>
                                        ) : (
                                            <img
                                                src={imageUrl}
                                                alt={epreuve.titre}
                                                className={`w-full h-full object-cover rounded-lg ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                                                onLoad={handleImageLoad}
                                                onError={handleImageError}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 rounded-lg">
                                        <ImageIcon size={48} />
                                        <span className="mt-2">Aucune image</span>
                                    </div>
                                )}
                            </div>

                            {/* Titre et domaine */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                        {epreuve.titre}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {epreuve.domaine_name || epreuve.id_domaine || 'Aucun domaine'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Informations principales */}
                            <div className="grid grid-cols-1 gap-6 mb-8">
                                {/* Dates */}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-green-700 mb-2">
                                        <Calendar size={18} />
                                        <span className="font-semibold">Période</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-green-900 text-sm">
                                            <span className="font-medium">Début:</span> {new Date(epreuve.date_start).toLocaleDateString('fr-FR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <p className="text-green-900 text-sm">
                                            <span className="font-medium">Fin:</span> {new Date(epreuve.date_end).toLocaleDateString('fr-FR', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                    Description
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 leading-relaxed">
                                        {epreuve.description_epreuve || epreuve.description || 'Aucune description disponible'}
                                    </p>
                                </div>
                            </div>

                            {/* Tags */}
                            {epreuve.tags && epreuve.tags.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                                        Tags
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {epreuve.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
                                            >
                                                <Tag size={14} />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="border-t border-gray-200 pt-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions disponibles</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button 
                                        onClick={handleManageTabs}
                                        className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                                    >
                                        <FolderOpen size={18} />
                                        <span className="font-medium">Gérer les tabs</span>
                                    </button>

                                    <button 
                                        onClick={handleManageQuestions}
                                        className="flex items-center justify-center gap-3 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                                    >
                                        <List size={18} />
                                        <span className="font-medium">Gérer les questions</span>
                                    </button>

                                    <button 
                                        onClick={handleViewRanking}
                                        className="flex items-center justify-center gap-3 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
                                    >
                                        <Trophy size={18} />
                                        <span className="font-medium">Voir le classement</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalDetailEpreuve;