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
        selectContainer.style.fontFamily = 'var(--font-base)';

        // Create select element
        const select = document.createElement('select');
        select.id = 'unitSelector';
        select.className = 'font-medium custom-select';
        select.style.fontFamily = 'var(--font-base)';
        select.style.padding = '8px 32px 8px 16px';
        select.style.border = '1px solid #e2e8f0';
        select.style.borderRadius = '6px';
        select.style.backgroundColor = '#fff';
        select.style.cursor = 'pointer';
        select.style.appearance = 'none';
        select.style.webkitAppearance = 'none';
        select.style.mozAppearance = 'none';
        select.style.msAppearance = 'none';
        select.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;
        select.style.backgroundRepeat = 'no-repeat';
        select.style.backgroundPosition = 'right 8px center';
        select.style.backgroundSize = '16px';
        select.style.textAlignLast = 'left';
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