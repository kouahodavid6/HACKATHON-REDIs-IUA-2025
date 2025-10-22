import { motion, AnimatePresence } from "framer-motion";
import { X, User, Crown } from "lucide-react";

const ModalMembresEquipe = ({ 
    isOpen, 
    onClose, 
    equipe,
    membres 
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />
                    
                    {/* Modal */}
                    <motion.div
                        className="relative z-[10000] bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200"
                        initial={{ scale: 0.8, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* En-tête */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Membres de l'équipe
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {equipe?.team_name} - {equipe?.domaine}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Liste des membres */}
                        <div className="p-6 max-h-96 overflow-y-auto">
                            {membres.length > 0 ? (
                                <div className="space-y-3">
                                    {membres.map((membre) => (
                                        <motion.div
                                            key={membre.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${
                                                    membre.role === 'createur' 
                                                        ? 'bg-yellow-100 text-yellow-600' 
                                                        : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {membre.role === 'createur' ? (
                                                        <Crown size={16} />
                                                    ) : (
                                                        <User size={16} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {membre.fullname}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {membre.matricule}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                membre.role === 'createur' 
                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {membre.role === 'createur' ? 'Créateur' : 'Membre'}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <User size={32} className="mx-auto mb-2 text-gray-400" />
                                    <p>Aucun membre dans cette équipe</p>
                                </div>
                            )}
                        </div>

                        {/* Pied de modal */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <p className="text-sm text-gray-600 text-center">
                                {membres.length} membre{membres.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalMembresEquipe;