// Word Cloud Events
export const WORDCLOUD_EVENTS = {
    UPDATE: 'wordcloud:update',
    LOADING: 'wordcloud:loading',
    ERROR: 'wordcloud:error',
    RESIZE: 'wordcloud:resize',
    WORD_HOVER: 'wordcloud:word:hover',
    WORD_CLICK: 'wordcloud:word:click'
};

// UI Events
export const UI_EVENTS = {
    UNIT_CHANGE: 'ui:unit:change',
    WORD_COUNT_CHANGE: 'ui:wordcount:change',
    SAVE_REQUEST: 'ui:save:request',
    SAVE_COMPLETE: 'ui:save:complete',
    SAVE_ERROR: 'ui:save:error'
};

// Data Events
export const DATA_EVENTS = {
    LOAD_START: 'data:load:start',
    LOAD_COMPLETE: 'data:load:complete',
    LOAD_ERROR: 'data:load:error',
    PROCESS_START: 'data:process:start',
    PROCESS_COMPLETE: 'data:process:complete'
};

// Layout Events
export const LAYOUT_EVENTS = {
    CALCULATE_START: 'layout:calculate:start',
    CALCULATE_COMPLETE: 'layout:calculate:complete',
    DIMENSION_CHANGE: 'layout:dimension:change',
    UPDATE_REQUIRED: 'layout:update:required'
};

// Animation Events
export const ANIMATION_EVENTS = {
    TRANSITION_START: 'animation:transition:start',
    TRANSITION_COMPLETE: 'animation:transition:complete',
    PARTICLE_EFFECT: 'animation:particle:trigger'
};

// Error Events
export const ERROR_EVENTS = {
    GENERAL: 'error:general',
    NETWORK: 'error:network',
    VALIDATION: 'error:validation'
}; 