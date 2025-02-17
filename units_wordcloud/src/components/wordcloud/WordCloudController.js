import { WORDCLOUD_EVENTS, LAYOUT_EVENTS, ANIMATION_EVENTS } from '../../events/EventTypes.js';

export class WordCloudController {
    constructor({ config, store, eventBus }) {
        this.config = config;
        this.store = store;
        this.eventBus = eventBus;
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Handle dimension changes
        this.eventBus.on(LAYOUT_EVENTS.DIMENSION_CHANGE, async ({ dimensions }) => {
            await this.store.updateDimensions(dimensions);
            await this.eventBus.emit(LAYOUT_EVENTS.UPDATE_REQUIRED);
        });

        // Handle word interactions
        this.eventBus.on(WORDCLOUD_EVENTS.WORD_HOVER, async ({ word }) => {
            await this.eventBus.emit(ANIMATION_EVENTS.TRANSITION_START, { 
                type: 'hover', 
                word 
            });
        });

        // Handle state changes
        this.store.subscribe((newState, oldState) => {
            if (
                newState.currentWords !== oldState.currentWords ||
                newState.dimensions !== oldState.dimensions
            ) {
                this.eventBus.emit(LAYOUT_EVENTS.UPDATE_REQUIRED);
            }
        });
    }

    async updateLayout(words) {
        try {
            await this.eventBus.emit(LAYOUT_EVENTS.CALCULATE_START);
            await this.eventBus.emit(LAYOUT_EVENTS.CALCULATE_COMPLETE, { words });
        } catch (error) {
            console.error('Error updating layout:', error);
            throw error;
        }
    }

    handleWordClick(word) {
        this.eventBus.emit(WORDCLOUD_EVENTS.WORD_CLICK, { word });
    }

    destroy() {
        // Cleanup event handlers
        this.eventBus.off(LAYOUT_EVENTS.DIMENSION_CHANGE);
        this.eventBus.off(WORDCLOUD_EVENTS.WORD_HOVER);
        this.eventBus.off(LAYOUT_EVENTS.UPDATE_REQUIRED);
    }
} 