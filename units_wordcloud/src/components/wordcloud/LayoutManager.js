import { WordStyleManager } from '../../utils/WordStyleManager.js';

export class WordCloudLayoutManager {
    constructor({ config }) {
        this.config = config;
        this.layout = null;
        this.setup();
    }

    setup() {
        const dimensions = this.config.get('wordcloud.dimensions');
        const layoutOptions = this.config.getLayoutOptions();
        
        this.layout = d3.layout.cloud()
            .size([dimensions.width, dimensions.height])
            .padding(layoutOptions.padding)
            .rotate(this.getRotation.bind(this))
            .fontSize(d => d.size);
    }

    getRotation() {
        const { rotations, rotationProbability } = this.config.getLayoutOptions();
        return Math.random() < rotationProbability ? 
            rotations[Math.floor(Math.random() * rotations.length)] : 0;
    }

    updateDimensions({ width, height }) {
        if (!width || !height) return;
        
        this.config.updateDimensions(width, height);
        
        if (this.layout) {
            this.layout.size([width, height]);
        }
    }

    calculateDimensions(container) {
        const rect = container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(container);
        
        const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        
        return {
            width: rect.width - paddingX,
            height: rect.height - paddingY
        };
    }

    async layoutWords(words) {
        if (!words || words.length === 0) return [];
        
        return new Promise((resolve, reject) => {
            try {
                const dimensions = this.config.get('wordcloud.dimensions');
                const area = dimensions.width * dimensions.height;
                
                this.layout
                    .words(words)
                    .fontSize(d => WordStyleManager.calculateWordSize(d.size, words, area))
                    .on("end", resolve)
                    .start();
            } catch (error) {
                console.error('Error in layout:', error);
                reject(error);
            }
        });
    }
} 