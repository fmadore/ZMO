import { ConfigManager } from '../config/ConfigManager.js';

export class DimensionManager {
    constructor(container) {
        this.container = container;
        this.config = ConfigManager.getInstance();
        this.dimensions = {
            width: this.config.get('wordcloud.dimensions.width'),
            height: this.config.get('wordcloud.dimensions.height')
        };
        this.observers = new Set();
        this.setupResizeObserver();
    }

    setupResizeObserver() {
        this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
        this.resizeObserver.observe(this.container);
        
        // Backup resize handler for older browsers
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('orientationchange', this.debounce(this.handleResize.bind(this), 250));
    }

    handleResize() {
        const rect = this.container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(this.container);
        
        const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        
        const newDimensions = {
            width: rect.width - paddingX,
            height: rect.height - paddingY
        };

        if (this.dimensions.width !== newDimensions.width || 
            this.dimensions.height !== newDimensions.height) {
            this.dimensions = newDimensions;
            this.notifyObservers();
        }
    }

    subscribe(callback) {
        this.observers.add(callback);
        // Initial notification
        callback(this.getDimensions());
        return () => this.observers.delete(callback);
    }

    notifyObservers() {
        const dimensions = this.getDimensions();
        this.observers.forEach(callback => callback(dimensions));
    }

    getDimensions() {
        return { ...this.dimensions };
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('orientationchange', this.handleResize);
        this.observers.clear();
    }
} 