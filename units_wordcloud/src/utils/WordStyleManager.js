import { ConfigManager } from '../config/ConfigManager.js';
import { FontManager } from './FontManager.js';
import { ColorManager } from './ColorManager.js';

export class WordStyleManager {
    static get config() {
        return ConfigManager.getInstance().getFontConfig();
    }

    static applyWordStyles(wordElements) {
        const totalWords = wordElements.size();
        
        wordElements
            .style("fill", (d, i) => ColorManager.getColorForWord(d, i, totalWords))
            .attr("text-anchor", "middle")
            .style("cursor", "pointer")
            .style("opacity", ConfigManager.getInstance().getColorConfig().opacity.normal)
            .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text)
            .style("transition", `all ${ConfigManager.getInstance().getColorConfig().transition.duration}ms ease`);

        // Apply font styles using FontManager
        wordElements.each(function(d) {
            FontManager.applyFontStyles(d3.select(this), d.size);
        });

        // Add hover effects
        wordElements
            .on("mouseover", function() {
                d3.select(this)
                    .style("opacity", ConfigManager.getInstance().getColorConfig().opacity.hover);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .style("opacity", ConfigManager.getInstance().getColorConfig().opacity.normal);
            });
    }

    static addRankInformation(words) {
        return words.map((word, index) => ({
            ...word,
            rank: index + 1
        }));
    }

    static calculateWordSize(size, words, area) {
        return FontManager.calculateFontSize({ size }, words, area);
    }
} 