import { WordCloud } from './components/wordcloud/WordCloud.js';
import { Menu } from './components/Menu.js';
import { WordList } from './components/WordList.js';
import { AppStore } from './store/AppStore.js';
import { ErrorManager } from './utils/ErrorManager.js';
import { ConfigManager } from './config/ConfigManager.js';
import { EventBus } from './events/EventBus.js';

document.addEventListener('DOMContentLoaded', () => {
    // Create core dependencies
    const config = new ConfigManager();
    const eventBus = new EventBus();
    const errorManager = new ErrorManager();
    
    errorManager.wrapSync(() => {
        // Initialize store with dependencies
        const store = new AppStore({ config, eventBus, errorManager });
        
        // Initialize components with dependencies
        const wordCloud = new WordCloud('#wordcloud', {
            config,
            store,
            eventBus
        });

        const wordList = new WordList('wordlist', {
            config,
            store,
            eventBus
        });

        const menu = new Menu('controls', {
            config,
            store,
            eventBus,
            errorManager
        });

        // Connect word cloud and word list
        wordCloud.setWordList(wordList);

        // Subscribe word list to store updates
        store.subscribe((newState, oldState) => {
            if (newState.currentWords !== oldState.currentWords) {
                wordList.updateWords(newState.currentWords);
            }
        });

        // Initial update
        const initialState = store.getState();
        store.updateWordCloud(
            initialState.selectedCountry,
            initialState.wordCount
        ).catch(error => {
            console.error('Failed to perform initial word cloud update:', error);
        });

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            menu.destroy();
            wordList.destroy();
            wordCloud.cleanup();
        });
    }, { component: 'main', method: 'init' });
}); 