import { getTranslations } from '../utils/translations.js';

export class Tooltip {
    constructor({ config } = {}) {
        this.tooltip = null;
        this.config = config;
        this.translations = getTranslations();
        this.init();
    }

    init() {
        // Remove any existing tooltip
        const existingTooltip = document.getElementById('tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        this.tooltip = this.createTooltipElement();
    }

    createTooltipElement() {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        document.body.appendChild(tooltip);
        return tooltip;
    }

    show(event, data) {
        if (!this.tooltip) {
            this.init();
        }

        const content = this.formatContent(data);
        this.tooltip.innerHTML = content;
        
        // Position the tooltip
        const tooltipWidth = this.tooltip.offsetWidth;
        const tooltipHeight = this.tooltip.offsetHeight;
        
        let left = event.pageX + 10;
        let top = event.pageY - tooltipHeight - 10;

        // Adjust position if tooltip would go off screen
        if (left + tooltipWidth > window.innerWidth) {
            left = event.pageX - tooltipWidth - 10;
        }
        if (top < 0) {
            top = event.pageY + 10;
        }

        // Set position before making visible
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
        
        // Make tooltip visible
        requestAnimationFrame(() => {
            this.tooltip.classList.add('visible');
        });
    }

    hide() {
        if (this.tooltip) {
            this.tooltip.classList.remove('visible');
        }
    }

    formatContent(data) {
        const { text, originalSize, rank } = data;
        let content = `<div class="tooltip-content">`;
        content += `<div class="tooltip-row"><span>#${rank}</span> <strong>${text}</strong></div>`;
        content += `<div class="tooltip-row"><span>${this.translations.frequency}:</span> <strong>${originalSize}</strong></div>`;
        if (data.units) {
            content += `<div class="tooltip-row"><span>${this.translations.units || 'Units'}:</span> <strong>${data.units.join(', ')}</strong></div>`;
        }
        content += `</div>`;
        return content;
    }

    destroy() {
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
            this.tooltip = null;
        }
    }
} 