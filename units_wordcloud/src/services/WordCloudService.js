import { DataProcessor } from '../utils/dataProcessor.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { EventBus } from '../events/EventBus.js';
import { DATA_EVENTS, ERROR_EVENTS } from '../events/EventTypes.js';

export class WordCloudService {
    static instance = null;

    constructor() {
        if (WordCloudService.instance) {
            return WordCloudService.instance;
        }

        this.config = ConfigManager.getInstance();
        this.eventBus = EventBus.getInstance();
        WordCloudService.instance = this;
    }

    static getInstance() {
        if (!WordCloudService.instance) {
            WordCloudService.instance = new WordCloudService();
        }
        return WordCloudService.instance;
    }

    async loadData(country, wordCount) {
        try {
            // Emit data load start event
            await this.eventBus.emit(DATA_EVENTS.LOAD_START, { country, wordCount });
            
            // Load data
            const dataPath = this.config.get('paths.getDataPath')(country);
            const response = await d3.json(dataPath);
            
            // Emit process start event
            await this.eventBus.emit(DATA_EVENTS.PROCESS_START, { data: response });
            
            // Process data
            const words = this.processData(response, country, wordCount);
            
            // Emit process complete event
            await this.eventBus.emit(DATA_EVENTS.PROCESS_COMPLETE, { words });
            
            return words;
        } catch (error) {
            await this.eventBus.emit(ERROR_EVENTS.GENERAL, { error });
            throw error;
        }
    }

    processData(response, country, wordCount) {
        const words = country === 'combined' ? 
            DataProcessor.processCombinedData(response) : 
            response;
        return DataProcessor.processWords(words, wordCount);
    }

    getDefaultWordCount() {
        return this.config.get('data.defaultWordCount');
    }

    getWordCountLimits() {
        return {
            min: this.config.get('data.minWords'),
            max: this.config.get('data.maxWords')
        };
    }

    getDefaultCountry() {
        return this.config.get('data.defaultGroup');
    }

    getAvailableCountries() {
        return this.config.getCountries();
    }
} 