import { ConfigManager } from '../config/ConfigManager.js';

export class ErrorManager {
    static instance = null;
    
    constructor() {
        if (ErrorManager.instance) {
            return ErrorManager.instance;
        }
        
        this.config = ConfigManager.getInstance();
        this.errors = [];
        this.errorListeners = new Set();
        this.setupErrorHandling();
        
        ErrorManager.instance = this;
    }

    static getInstance() {
        if (!ErrorManager.instance) {
            ErrorManager.instance = new ErrorManager();
        }
        return ErrorManager.instance;
    }

    setupErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason);
        });

        window.addEventListener('error', (event) => {
            this.handleError(event.error);
        });
    }

    handleError(error, context = {}) {
        const errorInfo = this.createErrorInfo(error, context);
        this.errors.push(errorInfo);
        this.notifyListeners(errorInfo);
        this.logError(errorInfo);
    }

    createErrorInfo(error, context) {
        return {
            timestamp: new Date(),
            message: error.message || 'An unknown error occurred',
            stack: error.stack,
            type: error.name || error.constructor.name,
            context: {
                ...context,
                url: window.location.href,
                userAgent: navigator.userAgent
            }
        };
    }

    logError(errorInfo) {
        console.error('Error:', {
            message: errorInfo.message,
            type: errorInfo.type,
            context: errorInfo.context,
            timestamp: errorInfo.timestamp.toISOString(),
            stack: errorInfo.stack
        });
    }

    // Subscribe to error events
    subscribe(callback) {
        this.errorListeners.add(callback);
        return () => this.errorListeners.delete(callback);
    }

    notifyListeners(errorInfo) {
        this.errorListeners.forEach(listener => {
            try {
                listener(errorInfo);
            } catch (error) {
                console.error('Error in error listener:', error);
            }
        });
    }

    // Utility methods for components
    async wrapAsync(promise, context = {}) {
        try {
            return await promise;
        } catch (error) {
            this.handleError(error, context);
            throw error; // Re-throw to allow component-level handling if needed
        }
    }

    wrapSync(fn, context = {}) {
        try {
            return fn();
        } catch (error) {
            this.handleError(error, context);
            throw error;
        }
    }

    // Get error history
    getErrors() {
        return [...this.errors];
    }

    // Clear error history
    clearErrors() {
        this.errors = [];
        this.notifyListeners({ type: 'clear' });
    }

    // Destroy instance
    destroy() {
        this.errorListeners.clear();
        this.errors = [];
        ErrorManager.instance = null;
    }
} 