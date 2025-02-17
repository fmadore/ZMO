import { WORDCLOUD_EVENTS, DATA_EVENTS } from '../events/EventTypes.js';

export class WordCloudState {
    constructor({ config, eventBus }) {
        this.config = config;
        this.eventBus = eventBus;
        this.listeners = new Set();
        this.state = {
            currentWords: [],
            dimensions: this.config.get('wordcloud.dimensions'),
            isLoading: false,
            error: null
        };
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };
        this.notifyListeners(oldState);
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notifyListeners(oldState) {
        this.listeners.forEach(listener => listener(this.state, oldState));
    }

    updateDimensions(dimensions) {
        this.setState({ dimensions });
        this.config.updateDimensions(dimensions.width, dimensions.height);
    }

    async updateWords(words) {
        try {
            this.setState({ isLoading: true, error: null });
            await this.eventBus.emit(DATA_EVENTS.PROCESS_START, { words });
            
            this.setState({
                currentWords: words,
                isLoading: false
            });

            await this.eventBus.emit(WORDCLOUD_EVENTS.UPDATE, { words });
        } catch (error) {
            this.setState({
                error: error.message,
                isLoading: false
            });
            throw error;
        }
    }

    destroy() {
        this.listeners.clear();
    }
} 