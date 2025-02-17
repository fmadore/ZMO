import { ConfigManager } from '../config/ConfigManager.js';
import { FontManager } from './FontManager.js';

export class AnimationManager {
    static get config() {
        return ConfigManager.getInstance().getAnimationConfig();
    }

    static wordEnter(element, size) {
        const { duration, scaleOnHover } = this.config;
        const scaledSize = FontManager.scaleFont(size, scaleOnHover);
        
        d3.select(element)
            .transition()
            .duration(duration)
            .call(el => FontManager.applyFontStyles(el, scaledSize, 'bold'));
    }

    static wordExit(element, size) {
        const { duration } = this.config;
        d3.select(element)
            .transition()
            .duration(duration)
            .call(el => FontManager.applyFontStyles(el, size, 'normal'));
    }

    static setupWordInteractions(wordElements, tooltip) {
        wordElements
            .on("mouseover", (event, d) => {
                tooltip.show(event, d);
                this.wordEnter(event.target, d.size);
            })
            .on("mouseout", (event, d) => {
                tooltip.hide();
                this.wordExit(event.target, d.size);
            });
    }

    static setupTransitions(wordElements) {
        const { duration } = this.config.transition;
        
        // Setup base transition
        wordElements
            .style("transition", `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`)
            .style("transform-origin", "center");
    }

    static morphTransition(wordElements, oldData, newData) {
        const { duration } = this.config.transition;

        // Exit animation for removed words
        wordElements.exit()
            .transition()
            .duration(duration * 0.5)
            .style("opacity", 0)
            .style("transform", "scale(0.8) rotate(15deg)")
            .remove();

        // Enter animation for new words
        const enterElements = wordElements.enter()
            .append("text")
            .style("opacity", 0)
            .style("transform", "scale(0.3) rotate(-15deg)");

        // Update + Enter transitions
        wordElements.merge(enterElements)
            .transition()
            .duration(duration)
            .style("opacity", 1)
            .style("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`);
    }

    static particleEffect(container, word, type = 'exit') {
        const particles = [];
        const numParticles = 10;
        const colors = ['#ffb703', '#fb8500', '#e76f51', '#2a9d8f'];
        
        // Create particle elements
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            container.appendChild(particle);
            particles.push(particle);
        }

        // Animate particles
        const rect = word.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        particles.forEach((particle, i) => {
            const angle = (i / numParticles) * Math.PI * 2;
            const velocity = type === 'exit' ? 1 : -1;
            const distance = 50;

            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;

            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(
                        ${Math.cos(angle) * distance}px,
                        ${Math.sin(angle) * distance}px
                    ) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                fill: 'forwards'
            }).onfinish = () => particle.remove();
        });
    }

    static physicsAnimation(wordElements, type = 'enter') {
        const { duration } = this.config.transition;
        const gravity = 0.8;
        const bounce = 0.4;

        wordElements.each(function(d) {
            const element = d3.select(this);
            let vy = type === 'enter' ? -15 : 0;
            let y = type === 'enter' ? -100 : d.y;
            
            function animate() {
                vy += gravity;
                y += vy;

                // Ground collision
                if (y > d.y) {
                    y = d.y;
                    vy *= -bounce;
                }

                element
                    .style("transform", `translate(${d.x}px, ${y}px)rotate(${d.rotate}deg)`);

                if (Math.abs(y - d.y) > 0.1 || Math.abs(vy) > 0.1) {
                    requestAnimationFrame(animate);
                } else {
                    element
                        .style("transform", `translate(${d.x}px, ${d.y}px)rotate(${d.rotate}deg)`);
                }
            }

            animate();
        });
    }
} 