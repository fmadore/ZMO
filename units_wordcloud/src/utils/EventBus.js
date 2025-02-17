export class EventBus {
    static instance = null;
    
    constructor() {
        if (EventBus.instance) {
            return EventBus.instance;
        }
        
        this.events = new Map();
        EventBus.instance = this;
    }

    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (this.events.has(event)) {
            this.events.get(event).delete(callback);
        }
    }

    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(data));
        }
    }

    clear() {
        this.events.clear();
    }

    destroy() {
        this.clear();
        EventBus.instance = null;
    }
} 