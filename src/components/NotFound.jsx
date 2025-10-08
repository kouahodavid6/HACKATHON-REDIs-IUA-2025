import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ShieldUser, FileText, FolderTree } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 text-blue-900 px-4 relative overflow-hidden">
            {/* Effets de fond décoratifs */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-blue-200/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-blue-300/10 rounded-full blur-lg"></div>
            
            <motion.div 
                className="max-w-md text-center relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Icône d'alerte */}
                <motion.div 
                    className="flex justify-center mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                    <div className="bg-gradient-to-br from-blue-100 to-blue-100 p-5 rounded-2xl border border-emerald-200 shadow-lg">
                        <AlertTriangle className="h-16 w-16 text-blue-600" />
                    </div>
                </motion.div>

                {/* Code erreur */}
                <motion.h1 
                    className="text-8xl font-black mb-4 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                >
                    404
                </motion.h1>

                {/* Titre */}
                <motion.h2 
                    className="text-3xl font-bold mb-3 text-blue-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Page non trouvée
                </motion.h2>

                {/* Message */}
                <motion.p 
                    className="mb-8 text-blue-700/80 text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    Oups ! Il semble que cette page ait été déplacée ou n'existe plus. 
                    Revenons sur le chemin du REDIs ensemble.
                </motion.p>

                {/* Bouton de retour */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-200/50 transform hover:-translate-y-1"
                    >
                        <Home className="h-5 w-5" />
                        Retour à la page admin
                    </Link>
                </motion.div>

                {/* Message secondaire */}
                <motion.p 
                    className="mt-6 text-sm text-blue-600/70 flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <ShieldUser className="h-4 w-4" />
                    Revenez à nous administrateur 😭😭😭
                </motion.p>
            </motion.div>

            {/* Décorations bas de page */}
            <div className="absolute bottom-10 left-10 opacity-20">
                <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="absolute bottom-20 right-10 opacity-20">
                <FolderTree className="h-6 w-6 text-blue-600" />
            </div>
        </div>
    );
};

export default NotFound;