import { useState, useEffect } from "react";
import { X, Save, Loader } from "lucide-react";
import useQuestionsStore from "../../../stores/questions.store";
import toast from "react-hot-toast";

const QuestionsModal = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    question, 
    isEdit, 
    epreuveId 
}) => {
    const [formData, setFormData] = useState({
        libelle: '',
        type: 'unique',
        time_in_seconds: 30
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { 
        creerQuestion, 
        modifierQuestion, 
        loading, 
        error, 
        clearError 
    } = useQuestionsStore();

    // Types de questions disponibles
    const questionTypes = [
        { value: 'unique', label: 'Choix unique' },
        { value: 'multiple', label: 'Choix multiple' }
    ];

    // Initialiser le formulaire
    useEffect(() => {
        if (isEdit && question) {
            setFormData({
                libelle: question.libelle || '',
                type: question.type || 'unique',
                time_in_seconds: question.time_in_seconds || 30
            });
        } else {
            setFormData({
                libelle: '',
                type: 'unique',
                time_in_seconds: 30
            });
        }
        setErrors({});
        clearError();
    }, [isEdit, question, isOpen, clearError]);

    // Gérer les changements des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'time_in_seconds' ? parseInt(value) || 0 : value
        }));
        
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Valider le formulaire
    const validateForm = () => {
        const newErrors = {};

        if (!formData.libelle.trim()) {
            newErrors.libelle = 'Le libellé de la question est requis';
        }

        if (!formData.type) {
            newErrors.type = 'Le type de question est requis';
        }

        if (!formData.time_in_seconds || formData.time_in_seconds <= 0) {
            newErrors.time_in_seconds = 'Le temps doit être supérieur à 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        console.log('Données à envoyer:', formData);
        console.log('Mode édition:', isEdit);

        setIsSubmitting(true);
        try {
            if (isEdit) {
                console.log('Tentative de modification...');
                // CORRECTION : Appel correct avec seulement l'ID de la question et les données
                await modifierQuestion(question.id, formData);
                toast.success('Question modifiée avec succès');
            } else {
                console.log('Tentative de création...');
                await creerQuestion(epreuveId, formData);
                toast.success('Question créée avec succès');
            }
            onSuccess();
        } catch (error) {
            console.error('Erreur détaillée lors de la sauvegarde:', error);
            // Le toast d'erreur est géré par le store
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fermer le modal
    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* En-tête */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEdit ? 'Modifier la question' : 'Ajouter une question'}
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    {/* Libellé de la question */}
                    <div>
                        <label htmlFor="libelle" className="block text-sm font-medium text-gray-700 mb-2">
                            Question *
                        </label>
                        <textarea
                            id="libelle"
                            name="libelle"
                            value={formData.libelle}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.libelle ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Entrez la question..."
                            disabled={isSubmitting}
                        />
                        {errors.libelle && (
                            <p className="mt-1 text-sm text-red-600">{errors.libelle}</p>
                        )}
                    </div>

                    {/* Type de question */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                            Type de question *
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.type ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={isSubmitting}
                        >
                            {questionTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        {errors.type && (
                            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                        )}
                    </div>

                    {/* Temps en secondes */}
                    <div>
                        <label htmlFor="time_in_seconds" className="block text-sm font-medium text-gray-700 mb-2">
                            Temps de réponse (secondes) *
                        </label>
                        <input
                            type="number"
                            id="time_in_seconds"
                            name="time_in_seconds"
                            value={formData.time_in_seconds}
                            onChange={handleChange}
                            min="1"
                            max="300"
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.time_in_seconds ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="30"
                            disabled={isSubmitting}
                        />
                        {errors.time_in_seconds && (
                            <p className="mt-1 text-sm text-red-600">{errors.time_in_seconds}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                            Durée maximale pour répondre à cette question
                        </p>
                    </div>

                    {/* Message d'erreur global */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        </div>
                    )}
                </form>

                {/* Pied de page */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting || loading ? (
                            <>
                                <Loader className="animate-spin" size={16} />
                                {isEdit ? 'Modification...' : 'Création...'}
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                {isEdit ? 'Modifier' : 'Créer'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionsModal;