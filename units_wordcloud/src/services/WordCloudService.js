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

    async loadData(unit, wordCount) {
        try {
            // Emit data load start event
            await this.eventBus.emit(DATA_EVENTS.LOAD_START, { unit, wordCount });
            
            // Load data
            const dataPath = this.config.get('paths.getDataPath')(unit);
            const response = await d3.json(dataPath);
            
            // Emit process start event
            await this.eventBus.emit(DATA_EVENTS.PROCESS_START, { data: response });
            
            // Process data
            const words = this.processData(response, unit, wordCount);
            
            // Emit process complete event
            await this.eventBus.emit(DATA_EVENTS.PROCESS_COMPLETE, { words });
            
            return words;
        } catch (error) {
            await this.eventBus.emit(ERROR_EVENTS.GENERAL, { error });
            throw error;
        }
    }

    processData(response, unit, wordCount) {
        const words = unit === 'combined' ? 
            DataProcessor.processCombinedData(response) : 
            response;
        return DataProcessor.processWords(words, wordCount);
    }

    getDefaultUnit() {
        return this.config.get('data.defaultGroup');
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
} 