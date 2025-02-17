import { WordCloudService } from '../../services/WordCloudService.js';

export class WordCloudDataManager {
    constructor() {
        this.service = WordCloudService.getInstance();
        this.currentWords = null;
    }

    async loadData(country, wordCount) {
        const words = await this.service.loadData(country, wordCount);
        this.setCurrentWords(words);
        return words;
    }

    setCurrentWords(words) {
        this.currentWords = words;
    }

    getCurrentWords() {
        return this.currentWords;
    }

    getDefaultWordCount() {
        return this.service.getDefaultWordCount();
    }

    getWordCountLimits() {
        return this.service.getWordCountLimits();
    }

    getDefaultUnit() {
        return this.service.getDefaultUnit();
    }

    getAvailableUnits() {
        return this.service.getAvailableUnits();
    }
} 