export class ConfigManager {
    static instance = null;
    
    constructor() {
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }
        
        this.config = {
            wordcloud: {
                dimensions: {
                    width: 800,
                    height: 600,
                    minHeight: 400,
                    maxWidth: 1200
                },
                font: {
                    // Primary and fallback fonts
                    family: {
                        primary: 'Muli',
                        fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                    },
                    // Font size configuration
                    size: {
                        min: 10,
                        max: null, // Will be calculated based on height
                        scale: {
                            factor: 5, // Base scaling factor
                            min: 0.8,  // Minimum scale multiplier
                            max: 1.2   // Maximum scale multiplier
                        }
                    },
                    // Font weight options
                    weight: {
                        normal: 400,
                        bold: 400,
                        range: [400]
                    },
                    // Font style options
                    style: {
                        normal: 'normal',
                        emphasis: 'italic'
                    }
                },
                layout: {
                    padding: 8,
                    rotations: [0, 90],
                    rotationProbability: 0.5
                },
                animation: {
                    duration: 200,
                    scaleOnHover: 1.2,
                    transition: {
                        duration: 800,
                        morphing: true,
                        particles: true,
                        physics: true
                    },
                    particles: {
                        count: 10,
                        duration: 600,
                        colors: ['#ffb703', '#fb8500', '#e76f51', '#2a9d8f']
                    },
                    physics: {
                        gravity: 0.8,
                        bounce: 0.4,
                        initialVelocity: -15
                    }
                },
                export: {
                    scale: 2,
                    format: 'png'
                },
                colors: {
                    colorAssignment: 'frequency', // 'frequency', 'random', or 'fixed'
                    opacity: {
                        normal: 1,
                        hover: 0.8
                    },
                    transition: {
                        duration: 200
                    }
                }
            },
            data: {
                minWords: 10,
                maxWords: 100,
                defaultWordCount: 75,
                defaultGroup: 'combined',
                // New data configuration options
                format: {
                    type: 'json',  // 'json', 'csv', etc.
                    fields: {
                        text: 'text',      // Field name for word text
                        value: 'size',     // Field name for word frequency/value
                        group: 'unit',     // Field name for grouping (optional)
                        metadata: []       // Additional fields to preserve
                    }
                },
                processing: {
                    // Custom data processing options
                    normalization: 'linear', // 'linear', 'log', 'sqrt'
                    filters: [],            // Array of filter functions
                    transformers: []        // Array of transform functions
                }
            },
            paths: {
                dataDir: 'data',
                // More flexible path configuration
                getDataPath: (group, format = 'json') => {
                    const basePath = window.APP_CONFIG?.basePath || '';
                    return `${basePath ? basePath : '..'}/data/${group}_word_frequencies.${format}`;
                }
            },
            // More generic groups configuration
            groups: {
                type: 'unit',           // Type of grouping (e.g., 'unit', 'category', 'theme')
                defaultCombined: true,     // Whether to show a combined option
                combinedLabel: {           // Labels for combined option
                    en: 'All Units',
                    fr: 'Toutes les unités'
                },
                items: [
                    { value: 'combined', labelKey: 'allUnits' },
                    { value: 'State_Society', label: 'State & Society' },
                    { value: 'Lives_Ecologies', label: 'Lives & Ecologies' },
                    { value: 'Religion-Intellectual-Culture', label: 'Religion and Intellectual Culture' }
                ]
            }
        };

        ConfigManager.instance = this;
    }

    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.config);
        target[lastKey] = value;
    }

    getWordcloudConfig() {
        return { ...this.config.wordcloud };
    }

    getDataConfig() {
        return { ...this.config.data };
    }

    getUnits() {
        return [...this.config.groups.items];
    }

    calculateMaxFontSize(height) {
        return height / 8;
    }

    updateDimensions(width, height) {
        this.set('wordcloud.dimensions.width', width);
        this.set('wordcloud.dimensions.height', height);
        this.set('wordcloud.font.size.max', this.calculateMaxFontSize(height));
    }

    getLayoutOptions() {
        const { padding, rotations, rotationProbability } = this.config.wordcloud.layout;
        return { padding, rotations, rotationProbability };
    }

    getFontConfig() {
        const fontConfig = this.config.wordcloud.font;
        return {
            family: `${fontConfig.family.primary}, ${fontConfig.family.fallback}`,
            minSize: fontConfig.size.min,
            maxSize: fontConfig.size.max,
            scaleFactor: fontConfig.size.scale.factor,
            weights: fontConfig.weight,
            styles: fontConfig.style
        };
    }

    getAnimationConfig() {
        return { ...this.config.wordcloud.animation };
    }

    getExportConfig() {
        return { ...this.config.wordcloud.export };
    }

    getColorConfig() {
        return this.config.wordcloud.colors;
    }
} 