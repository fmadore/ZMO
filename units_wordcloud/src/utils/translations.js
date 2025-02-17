export const translations = {
    en: {
        allUnits: "All Research Units",
        numberOfWords: "Number of words",
        saveAsPNG: "Save as PNG",
        word: "Word",
        frequency: "Frequency",
        units: "Research Units",
        selectUnit: "Select a research unit",
        wordList: "Word List"
    },
    fr: {
        allUnits: "Toutes les unités de recherche",
        numberOfWords: "Nombre de mots",
        saveAsPNG: "Enregistrer en PNG",
        word: "Mot",
        frequency: "Fréquence",
        units: "Unités de recherche",
        selectUnit: "Sélectionner une unité de recherche",
        wordList: "Liste des mots"
    }
};

export function getTranslations() {
    // Get language from URL path
    const path = window.location.pathname;
    const isFrench = path.includes('/fr/');
    return isFrench ? translations.fr : translations.en;
} 