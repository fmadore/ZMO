import { ErrorManager } from '../utils/ErrorManager.js';

export class EventBus {
    static instance = null;
    
    constructor() {
        if (EventBus.instance) {
            return EventBus.instance;
        }
        
        this.events = new Map();
        this.errorManager = ErrorManager.getInstance();
        this.middlewares = [];
        EventBus.instance = this;
    }

    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    use(middleware) {
        this.middlewares.push(middleware);
        return this; // Allow chaining
    }

    on(eventType, callback, options = {}) {
        this.validateEventType(eventType);
        
        if (!this.events.has(eventType)) {
            this.events.set(eventType, new Set());
        }
        
        const handler = {
            callback,
            options: {
                once: options.once || false,
                priority: options.priority || 0
            }
        };
        
        this.events.get(eventType).add(handler);
        
        // Return unsubscribe function
        return () => this.off(eventType, callback);
    }

    once(eventType, callback) {
        return this.on(eventType, callback, { once: true });
    }

    off(eventType, callback) {
        this.validateEventType(eventType);
        
        if (this.events.has(eventType)) {
            const handlers = this.events.get(eventType);
            for (const handler of handlers) {
                if (handler.callback === callback) {
                    handlers.delete(handler);
                    break;
                }
            }
        }
    }

    async emit(eventType, data = {}) {
        this.validateEventType(eventType);
        
        if (!this.events.has(eventType)) {
            return;
        }

        // Apply middlewares
        let eventData = { ...data };
        for (const middleware of this.middlewares) {
            try {
                eventData = await middleware(eventType, eventData);
            } catch (error) {
                this.errorManager.handleError(error, {
                    component: 'EventBus',
                    method: 'emit',
                    eventType,
                    phase: 'middleware'
                });
            }
        }

        // Get handlers and sort by priority
        const handlers = Array.from(this.events.get(eventType));
        handlers.sort((a, b) => b.options.priority - a.options.priority);

        // Execute handlers
        for (const handler of handlers) {
            try {
                await this.executeHandler(handler, eventType, eventData);
            } catch (error) {
                this.errorManager.handleError(error, {
                    component: 'EventBus',
                    method: 'emit',
                    eventType,
                    phase: 'handler'
                });
            }
        }

        // Clean up 'once' handlers
        this.cleanupOnceHandlers(eventType);
    }

    async executeHandler(handler, eventType, data) {
        const result = handler.callback(data);
        if (result instanceof Promise) {
            await result;
        }
    }

    cleanupOnceHandlers(eventType) {
        if (this.events.has(eventType)) {
            const handlers = this.events.get(eventType);
            for (const handler of handlers) {
                if (handler.options.once) {
                    handlers.delete(handler);
                }
            }
        }
    }

    validateEventType(eventType) {
        if (!eventType || typeof eventType !== 'string') {
            throw new Error('Invalid event type');
        }
    }

    clear() {
        this.events.clear();
        this.middlewares = [];
    }

    destroy() {
        this.clear();
        EventBus.instance = null;
    }
} 