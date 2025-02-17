import { ConfigManager } from '../config/ConfigManager.js';

export class ColorManager {
    static get config() {
        return ConfigManager.getInstance().getColorConfig();
    }

    static getWordCloudScheme() {
        const scheme = [];
        for (let i = 1; i <= 10; i++) {
            const color = getComputedStyle(document.documentElement)
                .getPropertyValue(`--wordcloud-scheme-${i}`).trim();
            scheme.push(color);
        }
        return scheme;
    }

    static getColorForWord(word, index, totalWords) {
        const scheme = this.getWordCloudScheme();
        const { colorAssignment } = this.config;

        switch (colorAssignment) {
            case 'frequency':
                // Color based on frequency rank (more frequent = darker)
                return scheme[Math.floor((index / totalWords) * scheme.length)];
            case 'random':
                // Random color from scheme
                return scheme[Math.floor(Math.random() * scheme.length)];
            case 'fixed':
                // Fixed color based on word's position
                return scheme[index % scheme.length];
            default:
                return scheme[0];
        }
    }

    static getColorForRank(rank, totalWords) {
        const scheme = this.getWordCloudScheme();
        return scheme[Math.floor((rank / totalWords) * scheme.length)];
    }
} 