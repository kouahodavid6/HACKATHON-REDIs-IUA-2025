// 📁 src/pages/RegisterAdmin.jsx
import { useState } from "react";
import Input from "../../components/Input"
import { useNavigate } from "react-router-dom";
import useAuthAdminStore from "../../stores/auth.store";

import LogoBrandingREDIs from "./components/LogoBrandingREDIs";

const RegisterAdmin = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { registerAdmin } = useAuthAdminStore();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerAdmin(form);
            navigate("/dashboard");
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-2 sm:p-4">
            {/* Éléments de décorations */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
            <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 right-16 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-40 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
            
            {/* Logo et branding REDIs */}
            <LogoBrandingREDIs />

            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
                {/* En-tête avec badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 mb-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        <span className="text-sm font-semibold text-blue-300">Panel Administrateur</span>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-2">
                        Inscription Admin
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">
                        Hackathon du Département Informatique - IUA
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-slate-300 font-medium text-sm">
                            <span className="flex items-center">
                                Email Administrateur
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
                            className="bg-slate-900/50 border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
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
                            className="bg-slate-900/50 border-slate-600 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Création du compte...
                            </span>
                        ) : (
                            "Créer le compte administrateur"
                        )}
                    </button>

                    <div className="text-center pt-4 border-t border-slate-700/50">
                        <p className="text-slate-400 text-sm">
                            Déjà administrateur ?{" "}
                            <span
                                onClick={() => navigate("/login")}
                                className="text-blue-400 cursor-pointer hover:text-blue-300 font-semibold transition-colors hover:underline"
                            >
                                Accéder au panel
                            </span>
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center mt-8 pt-6 border-t border-slate-700/30">
                    <p className="text-slate-500 text-xs">
                        © 2024 REDIs - Département Informatique<br />
                        Institut Universitaire d'Abidjan
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterAdmin;