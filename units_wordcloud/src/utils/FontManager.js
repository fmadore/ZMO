import { ConfigManager } from '../config/ConfigManager.js';

export class FontManager {
    static get config() {
        return ConfigManager.getInstance().getFontConfig();
    }

    static calculateFontSize(word, words, area) {
        const { minSize, maxSize, scaleFactor } = this.config;
        const baseSize = Math.sqrt(area / (words.length * scaleFactor));
        const scaledSize = baseSize * (word.size / Math.max(...words.map(w => w.size)));
        return Math.min(Math.max(scaledSize, minSize), maxSize);
    }

    static applyFontStyles(element, size, weight = 'normal') {
        const { family } = this.config;
        element
            .style("font-family", family)
            .style("font-size", `${size}px`)
            .style("font-weight", weight);
    }

    static getFontFamily() {
        return this.config.family;
    }

    static getFontSizeLimits() {
        const { minSize, maxSize } = this.config;
        return { minSize, maxSize };
    }

    static calculateMaxFontSize(containerHeight) {
        return containerHeight / 8; // This ratio can be adjusted based on needs
    }

    static scaleFont(size, factor) {
        const { minSize, maxSize } = this.config;
        const newSize = size * factor;
        return Math.min(Math.max(newSize, minSize), maxSize);
    }
} 