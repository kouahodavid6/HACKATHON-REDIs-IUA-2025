import { useState, useEffect } from "react";
import { X, Save, Loader, CheckCircle, XCircle } from "lucide-react";
import usePropositionsStore from "../../../stores/propositions.store";
import toast from "react-hot-toast";

const PropositionsModal = ({ 
    isOpen, 
    onClose, 
    onSuccess, 
    proposition, 
    isEdit, 
    questionId 
}) => {
    const [formData, setFormData] = useState({
        libelle_propositions: '',
        is_correct: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { 
        creerProposition, 
        modifierProposition, 
        loading, 
        error, 
        clearError 
    } = usePropositionsStore();

    // Initialiser le formulaire
    useEffect(() => {
        if (isEdit && proposition) {
            // Gérer les deux formats possibles (is_correct ou id_correct)
            const isCorrect = proposition.is_correct || proposition.id_correct === 1;
            
            setFormData({
                libelle_propositions: proposition.libelle_propositions || '',
                is_correct: isCorrect
            });
        } else {
            setFormData({
                libelle_propositions: '',
                is_correct: false
            });
        }
        setErrors({});
        clearError();
    }, [isEdit, proposition, isOpen, clearError]);

    // Gérer les changements des champs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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

        if (!formData.libelle_propositions.trim()) {
            newErrors.libelle_propositions = 'Le libellé de la proposition est requis';
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
                // CORRECTION : Appel correct avec seulement l'ID de la proposition et les données
                await modifierProposition(proposition.id, formData);
                toast.success('Proposition modifiée avec succès');
            } else {
                console.log('Tentative de création...');
                await creerProposition(questionId, formData);
                toast.success('Proposition créée avec succès');
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
                        {isEdit ? 'Modifier la proposition' : 'Ajouter une proposition'}
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
                    {/* Libellé de la proposition */}
                    <div>
                        <label htmlFor="libelle_propositions" className="block text-sm font-medium text-gray-700 mb-2">
                            Proposition *
                        </label>
                        <textarea
                            id="libelle_propositions"
                            name="libelle_propositions"
                            value={formData.libelle_propositions}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.libelle_propositions ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Entrez la proposition de réponse..."
                            disabled={isSubmitting}
                        />
                        {errors.libelle_propositions && (
                            <p className="mt-1 text-sm text-red-600">{errors.libelle_propositions}</p>
                        )}
                    </div>

                    {/* Statut correct/incorrect */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Statut de la proposition
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_correct"
                                    checked={formData.is_correct}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                    formData.is_correct 
                                        ? 'bg-green-500 border-green-500' 
                                        : 'bg-white border-gray-300'
                                }`}>
                                    {formData.is_correct && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Proposition correcte
                                    </span>
                                </div>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_correct"
                                    checked={!formData.is_correct}
                                    onChange={() => setFormData(prev => ({ ...prev, is_correct: false }))}
                                    className="hidden"
                                />
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                    !formData.is_correct 
                                        ? 'bg-red-500 border-red-500' 
                                        : 'bg-white border-gray-300'
                                }`}>
                                    {!formData.is_correct && <XCircle size={14} className="text-white" />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <XCircle size={16} className="text-red-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Proposition incorrecte
                                    </span>
                                </div>
                            </label>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Indiquez si cette proposition est la bonne réponse à la question
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

export default PropositionsModal;