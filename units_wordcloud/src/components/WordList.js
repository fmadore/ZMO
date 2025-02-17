import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { StyleManager } from '../utils/StyleManager.js';
import { FontManager } from '../utils/FontManager.js';
import { AnimationManager } from '../utils/AnimationManager.js';

export class WordList {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('WordList: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.translations = getTranslations();
        this.words = [];
        this.currentPage = 1;
        this.wordsPerPage = 15;
        this.init();
    }

    init() {
        // Create container div
        const listContainer = document.createElement('div');
        listContainer.className = 'word-list-container';
        listContainer.style.fontFamily = 'var(--font-base)';
        StyleManager.setupContainer(listContainer);

        // Create header
        const header = document.createElement('div');
        header.className = 'word-list-header';
        const title = document.createElement('h2');
        title.textContent = this.translations.wordList;
        title.className = 'font-semibold';
        title.style.fontFamily = 'var(--font-base)';
        header.appendChild(title);
        listContainer.appendChild(header);

        // Create list
        const list = document.createElement('div');
        list.className = 'word-list';
        list.style.fontFamily = 'var(--font-base)';
        listContainer.appendChild(list);

        // Create pagination
        const pagination = document.createElement('div');
        pagination.className = 'word-list-pagination';
        pagination.style.fontFamily = 'var(--font-base)';
        listContainer.appendChild(pagination);

        this.container.appendChild(listContainer);

        // Store references
        this.listElement = list;
        this.paginationElement = pagination;
    }

    updateWords(words) {
        if (!words || !Array.isArray(words)) {
            console.error('Invalid words data:', words);
            return;
        }
        this.words = words;
        this.currentPage = 1;
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        const startIndex = (this.currentPage - 1) * this.wordsPerPage;
        const endIndex = startIndex + this.wordsPerPage;
        const pageWords = this.words.slice(startIndex, endIndex);

        // Clear current list
        this.listElement.innerHTML = '';

        // Render words
        pageWords.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-list-item';
            wordElement.setAttribute('data-word', word.text);
            
            const rank = word.rank || startIndex + index + 1;
            const frequency = word.originalSize || word.size;
            
            wordElement.innerHTML = `
                <span class="word-rank font-normal">#${rank}</span>
                <span class="word-text font-medium">${word.text}</span>
                <span class="word-frequency font-normal">${frequency}</span>
            `;
            
            // Add hover effect synchronization
            wordElement.addEventListener('mouseover', () => {
                wordElement.classList.add('hover');
                // Trigger hover effect on corresponding word in cloud
                const cloudWord = document.querySelector(`text[data-word="${word.text}"]`);
                if (cloudWord) {
                    const event = new MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    cloudWord.dispatchEvent(event);
                }
            });
            
            wordElement.addEventListener('mouseout', () => {
                wordElement.classList.remove('hover');
                // Remove hover effect
                const cloudWord = document.querySelector(`text[data-word="${word.text}"]`);
                if (cloudWord) {
                    const event = new MouseEvent('mouseout', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    cloudWord.dispatchEvent(event);
                }
            });
            
            this.listElement.appendChild(wordElement);
        });

        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.words.length / this.wordsPerPage);
        this.paginationElement.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '←';
        prevButton.className = 'font-medium';
        prevButton.disabled = this.currentPage === 1;
        prevButton.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.paginationElement.appendChild(prevButton);

        // Page numbers
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info font-medium';
        pageInfo.textContent = `${this.currentPage} / ${totalPages}`;
        this.paginationElement.appendChild(pageInfo);

        // Next button
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '→';
        nextButton.className = 'font-medium';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        this.paginationElement.appendChild(nextButton);
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.words.length / this.wordsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderCurrentPage();
        }
    }

    highlightWord(word) {
        // Remove any existing highlights
        const highlighted = this.listElement.querySelector('.highlighted');
        if (highlighted) {
            highlighted.classList.remove('highlighted');
        }

        // Find the word in our list
        const wordIndex = this.words.findIndex(w => w.text === word);
        if (wordIndex === -1) return;

        // Calculate which page the word is on
        const targetPage = Math.floor(wordIndex / this.wordsPerPage) + 1;
        
        // If we're not on the correct page, go there
        if (this.currentPage !== targetPage) {
            this.goToPage(targetPage);
        }

        // Find and highlight the word element
        const wordElement = this.listElement.querySelector(`[data-word="${word}"]`);
        if (wordElement) {
            wordElement.classList.add('highlighted');
            // Scroll the word into view with smooth behavior
            wordElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }

    clearHighlight() {
        const highlighted = this.listElement.querySelector('.highlighted');
        if (highlighted) {
            highlighted.classList.remove('highlighted');
        }
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
} 