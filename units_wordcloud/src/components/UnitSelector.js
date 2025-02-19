import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';

export class UnitSelector {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('UnitSelector: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.translations = getTranslations();
        this._onChange = null;
        this.init();
    }

    init() {
        // Create container div
        const selectContainer = document.createElement('div');
        selectContainer.className = 'select-container';

        // Create select element
        const select = document.createElement('select');
        select.id = 'unitSelector';
        select.className = 'font-medium custom-select';
        select.setAttribute('aria-label', 'Select a research unit');

        // Add options
        this.config.getUnits().forEach(unit => {
            const option = document.createElement('option');
            option.value = unit.value;
            option.className = 'font-medium';
            option.textContent = unit.labelKey ? 
                this.translations[unit.labelKey] : 
                unit.label;
            select.appendChild(option);
        });

        // Set default value
        select.value = this.config.get('data.defaultGroup');

        // Add event listener
        select.addEventListener('change', () => {
            if (this._onChange) {
                this._onChange();
            }
        });

        selectContainer.appendChild(select);
        this.container.appendChild(selectContainer);
    }

    getValue() {
        return document.getElementById('unitSelector').value;
    }

    setValue(value) {
        const select = document.getElementById('unitSelector');
        select.value = value;
        if (this._onChange) {
            this._onChange();
        }
    }

    set onChange(handler) {
        this._onChange = handler;
    }
} 