import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../../components/Input";
import LogoBrandingREDIs from "../components/LogoBrandingREDIs";
import useAuthAdminStore from "../../stores/auth.store";

const LoginAdmin = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginAdmin } = useAuthAdminStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.email || !form.password) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);
        
        try {
            await loginAdmin(form);
            toast.success("Connexion réussie !");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message || "Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden p-2 sm:p-4">
            {/* Éléments de décorations */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
            <div className="absolute top-32 right-20 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-16 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-500"></div>
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
            
            <LogoBrandingREDIs />

            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 mt-20 lg:mt-0">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 mb-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-sm font-semibold text-purple-300">Accès Sécurisé</span>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mt-2">
                        Connexion Admin
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        Panel de gestion du Hackathon REDIs
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-slate-300 font-medium text-sm">
                            <span className="flex items-center">
                                Identifiant Administrateur
                                <span className="text-red-400 ml-1">*</span>
                            </span>
                        </label>
                        <Input 
                            type="email" 
                            name="email" 
                            placeholder="admin@redis-iua.ci"
                            value={form.email} 
                            onChange={handleChange}
                            required
                            className="border-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-300 font-medium text-sm">
                            <span className="flex items-center">
                                Mot de passe
                                <span className="text-red-400 ml-1">*</span>
                            </span>
                        </label>
                        <Input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••"
                            value={form.password} 
                            onChange={handleChange}
                            required
                            className="border-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Authentification...
                            </span>
                        ) : (
                            "Accéder au Dashboard"
                        )}
                    </button>

                    <div className="text-center pt-4 border-t border-slate-700/50">
                        <p className="text-slate-400 text-sm">
                            Nouvel administrateur ?{" "}
                            <span 
                                onClick={() => navigate("/register")} 
                                className="text-purple-400 cursor-pointer hover:text-purple-300 font-semibold transition-colors hover:underline"
                            > 
                                Créer un compte
                            </span> 
                        </p>
                    </div>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-slate-700/30">
                    <p className="text-slate-500 text-xs">
                        Système d'administration REDIs Hackathon<br />
                        Département Informatique - IUA
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;