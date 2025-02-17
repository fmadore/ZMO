export class StyleManager {
    static setupContainer(container) {
        const styles = {
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
        };
        
        Object.assign(container.style, styles);
    }

    static setupWrapper(wrapper) {
        const styles = {
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        };
        
        Object.assign(wrapper.style, styles);
    }

    static setupSVG(svg) {
        svg
            .style("width", "100%")
            .style("height", "100%")
            .style("position", "relative")
            .style("display", "block")
            .style("background", "transparent")
            .style("overflow", "visible")
            .attr("preserveAspectRatio", "xMidYMid meet");
    }
} 