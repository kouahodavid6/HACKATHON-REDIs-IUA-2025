import { 
    Menu, 
    Bell, 
    UserSquareIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardHeader = ({ title, toggleSidebar }) => {

    return (
        <header 
            className="bg-white from-white to-blue-50/30 shadow-sm h-16 flex items-center px-6 sticky top-0 z-20 border-b border-blue-100/60 backdrop-blur-sm"
        >
            {/* Bouton pour afficher/cacher la sidebar (visible seulement en mobile) */}
            <motion.button
                onClick={toggleSidebar}
                className="p-2 rounded-xl text-[#0f172a] hover:bg-[#090f1b] transition-all duration-300 md:hidden border border-transparent hover:border-blue-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Menu className="h-6 w-6" />
            </motion.button>

            {/* Titre de la page */}
            <h1 
                className="text-xl font-bold bg-gradient-to-r from-[#0f172a] to-[#090f1b] bg-clip-text text-transparent ml-3 md:ml-0"
            >
                {title}
            </h1>

            {/* Zone à droite : notifications + profil */}
            <div className="ml-auto flex items-center space-x-4">
                {/* Bouton cloche de notifications
                <motion.button 
                    className="p-2 rounded-full text-[#0f172a] hover:bg-blue-100 transition-all duration-300 relative border border-transparent hover:border-blue-900"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border border-white"/>
                </motion.button> */}

                {/* Avatar + infos utilisateur */}
                <motion.div 
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex items-center space-x-3 border-l pl-4 border-blue-100"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#090f1b] flex items-center justify-center text-white font-semibold shadow-lg">
                            A
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0f172a] rounded-full flex items-center justify-center border-2 border-white">
                            <UserSquareIcon className="w-2 h-2 text-white" />
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-[#090f1b]">Administrateur</p>
                        <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-blue-700 rounded-full"></div>
                            <p className="text-xs text-[#0f172a] font-medium">admin@hackathon.gmail</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Ligne décorative en bas */}
            <motion.div 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            />
        </header>
    );
};

export default DashboardHeader;