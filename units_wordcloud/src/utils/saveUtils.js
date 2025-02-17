/**
 * Converts an SVG element to a PNG and triggers download
 * @param {SVGElement} svg - The SVG element to convert
 */
export class SaveManager {
    static async saveAsPNG(svg) {
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);
        
        // Add namespaces
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        
        // Add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        
        // Convert svg source to URI data scheme
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    const scale = 2; // Increase this value for higher resolution
                    
                    // Get the SVG dimensions
                    const svgWidth = svg.width.baseVal.value;
                    const svgHeight = svg.height.baseVal.value;
                    
                    // Set canvas dimensions with scale
                    canvas.width = svgWidth * scale;
                    canvas.height = svgHeight * scale;
                    
                    // Get the context and configure it
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#000000'; // Set background color
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Apply scaling
                    ctx.scale(scale, scale);
                    
                    // Draw the image centered
                    ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
                    
                    // Create download link
                    const link = document.createElement('a');
                    link.download = 'word_cloud.png';
                    link.href = canvas.toDataURL('image/png', 1.0);
                    link.click();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = reject;
            img.src = url;
        });
    }
} 