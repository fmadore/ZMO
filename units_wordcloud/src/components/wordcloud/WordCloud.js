import { WordCloudRenderer } from './Renderer.js';
import { WordCloudLayoutManager } from './LayoutManager.js';
import { DimensionManager } from '../../utils/DimensionManager.js';
import { CanvasManager } from '../../utils/CanvasManager.js';
import { StyleManager } from '../../utils/StyleManager.js';
import { WordCloudController } from './WordCloudController.js';
import { LAYOUT_EVENTS, WORDCLOUD_EVENTS } from '../../events/EventTypes.js';

export class WordCloud {
    constructor(containerId, { config, store, eventBus, options = {} } = {}) {
        this.container = typeof containerId === 'string' ? 
            document.getElementById(containerId.replace('#', '')) : 
            containerId;

        if (!this.container) {
            throw new Error('Container element not found');
        }

        // Initialize dependencies
        this.config = config;
        this.eventBus = eventBus;
        this.store = store;
        
        // Initialize managers and controllers
        this.initializeManagers();
        this.controller = new WordCloudController({ config, store, eventBus });
        
        // Apply initial configuration
        this.applyConfiguration(options);
        
        // Setup the view
        StyleManager.setupContainer(this.container);
        this.setupView();
    }

    initializeManagers() {
        this.dimensionManager = new DimensionManager(this.container);
        this.canvasManager = new CanvasManager();
        this.renderer = new WordCloudRenderer(this.container, {
            config: this.config,
            eventBus: this.eventBus
        });
        this.layoutManager = new WordCloudLayoutManager({
            config: this.config
        });
    }

    applyConfiguration(options) {
        Object.entries(options).forEach(([key, value]) => {
            this.config.set(`wordcloud.${key}`, value);
        });
    }

    setupView() {
        // Handle dimension changes
        this.dimensionManager.subscribe(async dimensions => {
            await this.eventBus.emit(LAYOUT_EVENTS.DIMENSION_CHANGE, { dimensions });
            this.layoutManager.updateDimensions(dimensions);
            this.renderer.updateDimensions(dimensions.width, dimensions.height);
        });

        // Handle layout updates
        this.eventBus.on(LAYOUT_EVENTS.UPDATE_REQUIRED, async () => {
            await this.redraw();
        });

        // Handle word hover events
        this.eventBus.on(WORDCLOUD_EVENTS.WORD_HOVER, ({ word }) => {
            if (this.wordList) {
                this.wordList.highlightWord(word.text);
            }
        });
    }

    async redraw() {
        try {
            const words = await this.layoutManager.layoutWords(this.getCurrentWords());
            await this.draw(words);
        } catch (error) {
            console.error('Error redrawing word cloud:', error);
            throw error;
        }
    }

    getCurrentWords() {
        return this.store.getState().currentWords || [];
    }

    async draw(words) {
        const svg = this.renderer.createSVG();
        const wordGroup = this.renderer.createWordGroup(svg);
        this.renderer.renderWords(wordGroup, words);
        return words;
    }

    setWordList(wordList) {
        this.wordList = wordList;
        this.renderer.setWordList(wordList);
    }

    cleanup() {
        this.dimensionManager.destroy();
        this.canvasManager.destroy();
        this.renderer.clear();
        this.controller.destroy();
        
        // Clean up event handlers
        this.eventBus.off(LAYOUT_EVENTS.UPDATE_REQUIRED);
        this.eventBus.off(WORDCLOUD_EVENTS.WORD_HOVER);
    }
} 