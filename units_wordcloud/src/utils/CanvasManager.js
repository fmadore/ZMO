export class CanvasManager {
    constructor() {
        this.originalCreateElement = null;
        this.setup();
    }

    setup() {
        this.originalCreateElement = document.createElement.bind(document);
        document.createElement = (tagName) => {
            const element = this.originalCreateElement(tagName);
            if (tagName.toLowerCase() === 'canvas') {
                this.optimizeCanvasContext(element);
            }
            return element;
        };
    }

    optimizeCanvasContext(canvasElement) {
        const originalGetContext = canvasElement.getContext.bind(canvasElement);
        canvasElement.getContext = (contextType, attributes = {}) => {
            if (contextType === '2d') {
                attributes.willReadFrequently = true;
            }
            return originalGetContext(contextType, attributes);
        };
    }

    restore() {
        if (this.originalCreateElement) {
            document.createElement = this.originalCreateElement;
            this.originalCreateElement = null;
        }
    }

    destroy() {
        this.restore();
    }
} 