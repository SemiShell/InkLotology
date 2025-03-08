/**
 * 水墨效果渲染引擎
 */

class InkEffect {
    constructor() {
        this.canvas = document.getElementById('inkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.inkBlots = [];
        this.lastTime = 0;
        this.screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
        this.canvas.style.zIndex = '-1';
        
        this.initialize();
        window.addEventListener('resize', () => this.resize());
    }
    
    initialize() {
        this.resize();
        this.animate();
        
        document.addEventListener('pointerdown', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
                this.createInkBlot(e.clientX, e.clientY);
            }
        });
        
        this.createDistributedInkBlots(3);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.screenDiagonal = Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2);
        this.renderBackground();
    }
    
    renderBackground() {
        this.ctx.fillStyle = '#F5F0E6';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPaperTexture();
        this.inkBlots.forEach(blot => this.drawInkBlot(blot));
    }
    
    drawPaperTexture() {
        this.ctx.save();
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.03})`;
            this.ctx.fillRect(x, y, Math.random() * 1.5, Math.random() * 1.5);
        }
        this.ctx.restore();
    }
    
    createInkBlot(x, y, scale = 1) {
        const blot = {
            x, y,
            size: 0,
            opacity: Math.random() * 0.25 + 0.1,
            growing: true,
            growSpeed: Math.random() * 0.6 + 0.3,
            maxSize: this.screenDiagonal * (Math.random() * 0.2 + 0.25),
            color: '#2D2D2D',
            fadeSpeed: 0.0002 * (Math.random() * 0.5 + 0.75)
        };
        
        this.inkBlots.push(blot);
        return blot;
    }
    
    createDistributedInkBlots(count) {
        const gridSize = Math.ceil(Math.sqrt(count));
        const cellWidth = this.canvas.width / gridSize;
        const cellHeight = this.canvas.height / gridSize;
        
        for (let i = 0; i < gridSize && count > 0; i++) {
            for (let j = 0; j < gridSize && count > 0; j++) {
                if (Math.random() < 0.7) {
                    const x = cellWidth * i + Math.random() * cellWidth;
                    const y = cellHeight * j + Math.random() * cellHeight;
                    this.createInkBlot(x, y);
                    count--;
                }
            }
        }
        
        while (count > 0) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.createInkBlot(x, y);
            count--;
        }
    }
    
    drawInkBlot(blot) {
        this.ctx.save();
        this.ctx.globalAlpha = blot.opacity;
        
        const gradient = this.ctx.createRadialGradient(
            blot.x, blot.y, 0,
            blot.x, blot.y, blot.size
        );
        
        gradient.addColorStop(0, blot.color);
        gradient.addColorStop(0.6, `rgba(45, 45, 45, ${blot.opacity * 0.9})`);
        gradient.addColorStop(1, 'rgba(45, 45, 45, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(blot.x, blot.y, blot.size, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    updateInkBlots(deltaTime) {
        let hasGrowingBlot = false;
        
        for (let i = this.inkBlots.length - 1; i >= 0; i--) {
            const blot = this.inkBlots[i];
            
            if (blot.growing) {
                blot.size += blot.growSpeed;
                hasGrowingBlot = true;
                
                if (blot.size >= blot.maxSize) {
                    blot.growing = false;
                }
            } else {
                blot.opacity -= blot.fadeSpeed;
                
                if (blot.opacity <= 0) {
                    this.inkBlots.splice(i, 1);
                }
            }
        }
        
        if (!hasGrowingBlot && this.inkBlots.length < 5 && Math.random() < 0.05) {
            this.createInkBlot(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            );
        }
    }
    
    createInkSplash(x, y, scale = 1) {
        const mainBlot = this.createInkBlot(x, y, scale);
        mainBlot.growSpeed *= 1.5;
        
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const splashX = x + Math.cos(angle) * distance;
            const splashY = y + Math.sin(angle) * distance;
            
            const smallBlot = this.createInkBlot(splashX, splashY, scale * (Math.random() * 0.3 + 0.2));
            smallBlot.maxSize *= 0.6;
        }
        
        for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 180 + 120;
            const tinyX = x + Math.cos(angle) * distance;
            const tinyY = y + Math.sin(angle) * distance;
            
            const tinyBlot = this.createInkBlot(tinyX, tinyY, scale * (Math.random() * 0.15 + 0.05));
            tinyBlot.maxSize *= 0.3;
            tinyBlot.growSpeed *= 1.2;
        }
    }
    
    animate(timestamp = 0) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        if (Math.random() < 0.005 && this.inkBlots.length < 12) {
            let attempts = 0;
            let x, y;
            
            do {
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
                attempts++;
            } while (this.isTooCloseToExistingBlots(x, y) && attempts < 10);
            
            if (attempts < 10 || this.inkBlots.length < 3) {
                this.createInkBlot(x, y);
            }
        }
        
        this.renderBackground();
        this.updateInkBlots(deltaTime);
        
        requestAnimationFrame(this.animate.bind(this));
    }
    
    isTooCloseToExistingBlots(x, y, minDistance = 150) {
        return this.inkBlots.some(blot => {
            const dx = x - blot.x;
            const dy = y - blot.y;
            return Math.sqrt(dx * dx + dy * dy) < minDistance;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.inkEffect = new InkEffect();
});