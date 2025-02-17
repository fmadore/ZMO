export const LoggerMiddleware = (eventType, data) => {
    // Filter out frequent layout and animation events
    if (!eventType.startsWith('layout:') && !eventType.startsWith('animation:')) {
        console.log(`[Event] ${eventType}`, data);
    }
    return data;
}; 