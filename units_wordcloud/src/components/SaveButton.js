import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { SaveManager } from '../utils/saveUtils.js';
import { AppStore } from '../store/AppStore.js';

export class SaveButton {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('SaveButton: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.store = AppStore.getInstance();
        this.translations = getTranslations();
        
        this.init();
    }

    init() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.style.fontFamily = 'var(--font-base)';

        const button = document.createElement('button');
        button.id = 'saveButton';
        button.className = 'save-button font-medium';
        button.style.fontFamily = 'var(--font-base)';
        button.setAttribute('aria-label', this.translations.saveAsPNG);

        // Create icon element
        const icon = document.createElement('span');
        icon.className = 'save-icon';
        icon.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 11V14.5H2.5V11H1V14.5C1 15.33 1.67 16 2.5 16H13.5C14.33 16 15 15.33 15 14.5V11H13.5Z" fill="currentColor"/>
                <path d="M8.75 11.19L12.22 7.72L11.28 6.78L8.75 9.31V0H7.25V9.31L4.72 6.78L3.78 7.72L7.25 11.19C7.44 11.38 7.69 11.47 7.94 11.47C8.19 11.47 8.44 11.38 8.63 11.19H8.75Z" fill="currentColor"/>
            </svg>
        `;

        // Create text element
        const text = document.createElement('span');
        text.className = 'button-text font-medium';
        text.textContent = this.translations.saveAsPNG;

        button.appendChild(icon);
        button.appendChild(text);

        // Add event listener
        button.addEventListener('click', () => this.handleSave());

        buttonContainer.appendChild(button);
        this.container.appendChild(buttonContainer);
    }

    async handleSave() {
        try {
            const svg = document.querySelector("#wordcloud svg");
            if (!svg) {
                throw new Error('Word cloud SVG element not found');
            }
            
            // Disable button while saving
            const button = document.getElementById('saveButton');
            button.disabled = true;
            
            // Store original dimensions
            const originalWidth = svg.getAttribute('width');
            const originalHeight = svg.getAttribute('height');
            const originalViewBox = svg.getAttribute('viewBox');
            
            // Get dimensions from config
            const dimensions = this.config.get('wordcloud.dimensions');
            
            // Set explicit dimensions for export
            svg.setAttribute('width', dimensions.width);
            svg.setAttribute('height', dimensions.height);
            
            // Ensure viewBox is set correctly
            if (!originalViewBox) {
                svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);
            }
            
            // Save the image
            await SaveManager.saveAsPNG(svg);
            
            // Restore original dimensions
            if (originalWidth) svg.setAttribute('width', originalWidth);
            if (originalHeight) svg.setAttribute('height', originalHeight);
            if (originalViewBox) svg.setAttribute('viewBox', originalViewBox);
            
            // Re-enable button after save
            button.disabled = false;
        } catch (error) {
            console.error('Error saving word cloud:', error);
            // Re-enable button if there's an error
            const button = document.getElementById('saveButton');
            button.disabled = false;
            throw error;
        }
    }

    getExportConfig() {
        return this.config.getExportConfig();
    }
} 