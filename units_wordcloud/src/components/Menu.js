import { UnitSelector } from './UnitSelector.js';
import { WordCountSlider } from './WordCountSlider.js';
import { SaveButton } from './SaveButton.js';
import { SaveManager } from '../utils/saveUtils.js';
import { UI_EVENTS, ERROR_EVENTS } from '../events/EventTypes.js';

export class Menu {
    constructor(containerId, { config, store, eventBus, errorManager }) {
        if (!containerId) {
            throw new Error('Menu: containerId is required');
        }

        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Menu: container with id "${containerId}" not found`);
        }

        // Inject dependencies
        this.config = config;
        this.store = store;
        this.eventBus = eventBus;
        this.errorManager = errorManager;
        this.init();
    }

    init() {
        return this.errorManager.wrapSync(() => {
            // Create a wrapper for the controls
            const menuWrapper = document.createElement('div');
            menuWrapper.className = 'menu-wrapper';
            this.container.appendChild(menuWrapper);

            // Store the wrapper reference
            this.menuWrapper = menuWrapper;

            // Initialize components with dependencies
            this.components = {
                unitSelector: new UnitSelector(menuWrapper, {
                    config: this.config
                }),
                wordCountSlider: new WordCountSlider(menuWrapper, {
                    config: this.config
                }),
                saveButton: new SaveButton(menuWrapper, {
                    config: this.config,
                    store: this.store
                })
            };

            // Setup event handlers
            this.setupEventHandlers();

            // Subscribe to store updates
            this.unsubscribe = this.store.subscribe(this.handleStateChange.bind(this));

            // Set initial values from store
            this.setInitialState();
        }, { component: 'Menu', method: 'init' });
    }

    setupEventHandlers() {
        // Unit selector events
        this.components.unitSelector.onChange = () => {
            const unit = this.getUnit();
            this.eventBus.emit(UI_EVENTS.UNIT_CHANGE, { unit });
            this.handleUpdate();
        };

        // Word count slider events
        this.components.wordCountSlider.onChange = () => {
            const count = this.getWordCount();
            this.eventBus.emit(UI_EVENTS.WORD_COUNT_CHANGE, { count });
            this.handleUpdate();
        };

        // Save button events
        this.components.saveButton.onClick = async () => {
            try {
                await this.eventBus.emit(UI_EVENTS.SAVE_REQUEST);
                const svg = document.querySelector("#wordcloud svg");
                if (!svg) {
                    throw new Error('Word cloud SVG element not found');
                }
                await SaveManager.saveAsPNG(svg);
                await this.eventBus.emit(UI_EVENTS.SAVE_COMPLETE);
            } catch (error) {
                await this.eventBus.emit(UI_EVENTS.SAVE_ERROR, { error });
                await this.eventBus.emit(ERROR_EVENTS.GENERAL, { error });
            }
        };
    }

    setInitialState() {
        return this.errorManager.wrapSync(() => {
            const state = this.store.getState();
            
            if (state.selectedUnit) {
                this.setUnit(state.selectedUnit);
            }
            if (state.wordCount) {
                this.setWordCount(state.wordCount);
            }
        }, { component: 'Menu', method: 'setInitialState' });
    }

    handleStateChange(newState, oldState) {
        if (newState.selectedUnit !== oldState.selectedUnit) {
            this.setUnit(newState.selectedUnit);
        }
        if (newState.wordCount !== oldState.wordCount) {
            this.setWordCount(newState.wordCount);
        }
    }

    handleUpdate() {
        return this.errorManager.wrapSync(() => {
            this.store.updateWordCloud(
                this.getUnit(),
                this.getWordCount()
            );
        }, { 
            component: 'Menu', 
            method: 'handleUpdate',
            data: {
                unit: this.getUnit(),
                wordCount: this.getWordCount()
            }
        });
    }

    getUnit() {
        return this.errorManager.wrapSync(
            () => this.components.unitSelector.getValue(),
            { component: 'Menu', method: 'getUnit' }
        );
    }

    getWordCount() {
        return this.errorManager.wrapSync(
            () => this.components.wordCountSlider.getValue(),
            { component: 'Menu', method: 'getWordCount' }
        );
    }

    setUnit(value) {
        return this.errorManager.wrapSync(
            () => this.components.unitSelector.setValue(value),
            { component: 'Menu', method: 'setUnit', value }
        );
    }

    setWordCount(value) {
        return this.errorManager.wrapSync(
            () => this.components.wordCountSlider.setValue(value),
            { component: 'Menu', method: 'setWordCount', value }
        );
    }

    destroy() {
        return this.errorManager.wrapSync(() => {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            Object.values(this.components).forEach(component => {
                if (component.destroy) {
                    component.destroy();
                }
            });
            this.components = {};
            if (this.container) {
                this.container.innerHTML = '';
            }
        }, { component: 'Menu', method: 'destroy' });
    }
} 