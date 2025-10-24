import { useState, useEffect, useCallback } from "react";
import { X, Plus, Minus, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useEpreuveStore from "../../../stores/epreuves.store";
import useDomaineStore from "../../../stores/domaines.store"
import toast from "react-hot-toast";

const ModalEpreuve = ({ isOpen, onClose, onSuccess, epreuve, isEdit = false }) => {
    const [form, setForm] = useState({
        titre: "",
        description_epreuve: "",
        tags: [],
        duree: "",
        date_start: "",
        date_end: "",
        id_domaine: "",
        url_image: null
    });
    const [tagInput, setTagInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    const { ajouterEpreuve, modifierEpreuve } = useEpreuveStore();
    const { domaines, listerDomaines } = useDomaineStore();

    // Gérer le overflow du body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Charger les domaines au montage avec debug
    useEffect(() => {
        const chargerDomaines = async () => {
            try {
                await listerDomaines();
                console.log("DOMAINES CHARGÉS DANS MODAL:", domaines);
            } catch (error) {
                console.error("Erreur lors du chargement des domaines:", error);
            }
        };

        if (isOpen) {
            chargerDomaines();
        }
    }, [isOpen, listerDomaines]);

    // Fonction pour formater la date pour l'input datetime-local
    const formatDateForInput = useCallback((dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const timezoneOffset = date.getTimezoneOffset() * 60000;
            const adjustedDate = new Date(date.getTime() - timezoneOffset);
            return adjustedDate.toISOString().slice(0, 16);
        } catch (error) {
            console.error("Erreur de formatage de date:", error);
            return "";
        }
    }, []);

    // Initialiser le formulaire
    useEffect(() => {
        if (epreuve && isOpen) {
            setForm({
                titre: epreuve.titre || "",
                description_epreuve: epreuve.description_epreuve || epreuve.description || "",
                tags: epreuve.tags || [],
                duree: epreuve.duree?.toString() || "",
                date_start: formatDateForInput(epreuve.date_start),
                date_end: formatDateForInput(epreuve.date_end),
                id_domaine: epreuve.id_domaine || "",
                url_image: null
            });
        } else {
            setForm({
                titre: "",
                description_epreuve: "",
                tags: [],
                duree: "",
                date_start: "",
                date_end: "",
                id_domaine: "",
                url_image: null
            });
        }
        setTagInput("");
    }, [epreuve, isOpen, formatDateForInput]);

    // Gestion des tags
    const handleAddTag = () => {
        if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
            setForm(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    // Gestion de l'image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("L'image ne doit pas dépasser 2MB");
                return;
            }
            
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Type de fichier non supporté. Utilisez JPEG, PNG ou GIF");
                return;
            }
            
            setForm(prev => ({ ...prev, url_image: file }));
        }
    };

    // Fonction pour formater la date pour l'API
    const formatDateForAPI = (datetimeLocal) => {
        if (!datetimeLocal) return "";
        return datetimeLocal.replace('T', ' ') + ':00';
    };

    // Validation du formulaire
    const validateForm = () => {
        if (!form.titre?.trim()) {
            toast.error("Le titre est obligatoire");
            return false;
        }
        
        if (!form.description_epreuve?.trim()) {
            toast.error("La description est obligatoire");
            return false;
        }
        
        if (!form.duree || parseInt(form.duree) <= 0) {
            toast.error("La durée doit être un nombre positif");
            return false;
        }
        
        if (!form.date_start) {
            toast.error("La date de début est obligatoire");
            return false;
        }
        
        if (!form.date_end) {
            toast.error("La date de fin est obligatoire");
            return false;
        }
        
        if (!form.id_domaine) {
            toast.error("Le domaine est obligatoire");
            return false;
        }

        const startDate = new Date(form.date_start);
        const endDate = new Date(form.date_end);
        if (endDate <= startDate) {
            toast.error("La date de fin doit être après la date de début");
            return false;
        }

        return true;
    };

    // CORRECTION CRITIQUE: Fonction dynamique pour mapper les IDs de domaine
    const getDomaineIntegerId = (domaineUuid) => {
        if (!domaineUuid) return null;
        
        console.log("RECHERCHE DOMAINE AVEC UUID:", domaineUuid);
        console.log("LISTE DES DOMAINES DISPONIBLES:", domaines);
        
        // Solution 1: Chercher par UUID et utiliser l'index + 1
        const domaineIndex = domaines.findIndex(d => d.id === domaineUuid);
        
        if (domaineIndex === -1) {
            console.error("Domaine non trouvé pour l'UUID:", domaineUuid);
            toast.error("Domaine sélectionné non valide");
            return null;
        }
        
        // Utiliser l'index + 1 comme ID (car les IDs commencent à 1)
        const integerId = domaineIndex + 1;
        
        console.log("Mapping réussi - UUID:", domaineUuid, "-> Index:", domaineIndex, "-> ID entier:", integerId);
        
        return integerId;
    };

    // Soumission du formulaire - CORRECTIONS FINALES
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            
            formData.append('titre', form.titre.trim());
            
            // CORRECTION: Utiliser "descritpion_epreuve" (avec la faute de frappe que l'API attend)
            formData.append('descritpion_epreuve', form.description_epreuve.trim());
            
            formData.append('duree', parseInt(form.duree));
            formData.append('date_start', formatDateForAPI(form.date_start));
            formData.append('date_end', formatDateForAPI(form.date_end));
            
            // CORRECTION CRITIQUE: Convertir l'ID string en entier via mapping dynamique
            const domaineIntegerId = getDomaineIntegerId(form.id_domaine);
            if (!domaineIntegerId) {
                toast.error("ID de domaine invalide - veuillez ressélectionner le domaine");
                setLoading(false);
                return;
            }
            formData.append('domaine_name', domaineIntegerId);
            
            // Format correct pour les tags
            form.tags.forEach(tag => {
                formData.append('tags[]', tag.trim());
            });
            
            // L'image est obligatoire selon l'API
            if (form.url_image) {
                formData.append('url_image', form.url_image);
            } else if (!isEdit) {
                // Pour la création, l'image est obligatoire
                toast.error("L'image est obligatoire pour créer une épreuve");
                setLoading(false);
                return;
            }

            // Debug: afficher le contenu du FormData
            console.log("=== DONNÉES ENVOYÉES ===");
            console.log("Mode:", isEdit ? "Édition" : "Création");
            console.log("ID Domaine string:", form.id_domaine);
            console.log("ID Domaine integer:", domaineIntegerId);
            console.log("Domaines disponibles:", domaines);
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            let result;
            if (isEdit && epreuve?.id) {
                result = await modifierEpreuve(epreuve.id, formData);
            } else {
                result = await ajouterEpreuve(formData);
            }
            
            console.log("Réponse réussie:", result);
            
            toast.success(isEdit ? "Épreuve modifiée avec succès !" : "Épreuve créée avec succès !");
            onSuccess();
            
        } catch (error) {
            console.error("ERREUR COMPLÈTE:", error);
            
            if (error.response?.data?.erreur) {
                const validationErrors = error.response.data.erreur;
                console.error("Erreurs de validation:", validationErrors);
                
                Object.values(validationErrors).forEach(errorArray => {
                    errorArray.forEach(errorMsg => {
                        toast.error(`Erreur: ${errorMsg}`);
                    });
                });
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Erreur lors de la création de l'épreuve");
            }
        } finally {
            setLoading(false);
        }
    };

    // Réinitialiser le formulaire
    const handleClose = () => {
        if (!loading) {
            setForm({
                titre: "",
                description_epreuve: "",
                tags: [],
                duree: "",
                date_start: "",
                date_end: "",
                id_domaine: "",
                url_image: null
            });
            setTagInput("");
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

    if (!isOpen) return null;

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
                        onClick={handleClose}
                        aria-hidden="true"
                        variants={backdropVariants}
                    />
                    
                    <motion.div
                        className="relative z-[10000] bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-blue-100/20 max-h-[90vh] overflow-y-auto"
                        variants={modalVariants}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-blue-100 sticky top-0 bg-white rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg"
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Plus className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-blue-900">
                                        {isEdit ? "Modifier l'épreuve" : "Ajouter une épreuve"}
                                    </h3>
                                    <p className="text-sm text-blue-600/70">
                                        {isEdit ? "Mise à jour de l'épreuve" : "Création d'une nouvelle épreuve"}
                                    </p>
                                </div>
                            </div>
                            {!loading && (
                                <motion.button
                                    onClick={handleClose}
                                    className="p-2 rounded-xl text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={loading}
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-2">
                                        Titre de l'épreuve <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.titre}
                                        onChange={(e) => setForm(prev => ({ ...prev, titre: e.target.value }))}
                                        placeholder="Ex: Défi d'intelligence artificielle"
                                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={form.description_epreuve}
                                        onChange={(e) => setForm(prev => ({ ...prev, description_epreuve: e.target.value }))}
                                        placeholder="Décrivez l'épreuve en détail..."
                                        rows="4"
                                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-2">
                                        Tags
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ajouter un tag (ex: IA, Machine Learning)"
                                            className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading || !tagInput.trim()}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {form.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                                    disabled={loading}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-2">
                                        Image de l'épreuve <span className="text-red-500">*</span>
                                    </label>
                                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center">
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/jpeg, image/jpg, image/png, image/gif"
                                            className="hidden"
                                            id="image-upload"
                                            disabled={loading}
                                            required={!isEdit} // L'image n'est requise que pour la création
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className={`cursor-pointer flex flex-col items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Upload className="text-blue-400" size={24} />
                                            <span className="text-sm text-blue-600">
                                                {form.url_image ? form.url_image.name : "Cliquez pour uploader une image"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                PNG, JPG, JPEG (max 2MB) {isEdit && "(optionnel pour la modification)"}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-2">
                                            Durée (minutes) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={form.duree}
                                            onChange={(e) => setForm(prev => ({ ...prev, duree: e.target.value }))}
                                            placeholder="120"
                                            min="1"
                                            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-2">
                                            Domaine <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.id_domaine}
                                            onChange={(e) => setForm(prev => ({ ...prev, id_domaine: e.target.value }))}
                                            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Sélectionnez un domaine</option>
                                            {domaines.map((domaine, index) => (
                                                <option key={domaine.id} value={domaine.id}>
                                                    {domaine.titre} (ID: {index + 1})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-2">
                                            Date et heure de début <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={form.date_start}
                                            onChange={(e) => setForm(prev => ({ ...prev, date_start: e.target.value }))}
                                            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-2">
                                            Date et heure de fin <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={form.date_end}
                                            onChange={(e) => setForm(prev => ({ ...prev, date_end: e.target.value }))}
                                            className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                className="flex justify-end gap-3 pt-6 border-t border-blue-100"
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
                                    disabled={loading}
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
                                            <Plus className="h-4 w-4" />
                                            {isEdit ? "Modifier" : "Créer"}
                                        </motion.span>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalEpreuve;