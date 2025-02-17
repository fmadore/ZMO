import { ERROR_EVENTS } from '../EventTypes.js';

const eventSchemas = {
    'wordcloud:update': {
        required: ['words'],
        validate: data => Array.isArray(data.words)
    },
    'ui:country:change': {
        required: ['country'],
        validate: data => typeof data.country === 'string' && data.country.length > 0
    },
    'ui:wordcount:change': {
        required: ['count'],
        validate: data => typeof data.count === 'number' && data.count > 0
    }
};

export const ValidationMiddleware = (eventType, data) => {
    const schema = eventSchemas[eventType];
    if (!schema) return data;

    // Check required fields
    const missingFields = schema.required.filter(field => !(field in data));
    if (missingFields.length > 0) {
        const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
        error.code = ERROR_EVENTS.VALIDATION;
        throw error;
    }

    // Validate data
    if (schema.validate && !schema.validate(data)) {
        const error = new Error(`Invalid data for event: ${eventType}`);
        error.code = ERROR_EVENTS.VALIDATION;
        throw error;
    }

    return data;
}; 