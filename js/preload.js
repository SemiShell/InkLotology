/**
 * 开屏动画 - 人生无根蒂，飘如陌上尘
 */

class PreloadAnimation {
    constructor() {
        this.initialized = false;
        this.completed = false;
        this.animationDuration = 5000; // 动画总时长（毫秒）
        this.startTime = null;
        
        // 创建DOM元素
        this.createElements();
        
        // 绑定事件
        this.bindEvents();
        
        // 预加载音频
        this.preloadAudio();
    }
    
    createElements() {
        // 创建开屏蒙层
        this.preloadMask = document.createElement('div');
        this.preloadMask.className = 'preload-mask';
        
        // 创建水墨背景
        this.inkBackground = document.createElement('div');
        this.inkBackground.className = 'preload-ink-background';
        
        // 创建诗句容器
        this.poemContainer = document.createElement('div');
        this.poemContainer.className = 'poem-container';
        
        // 创建诗句元素
        this.poemLine1 = document.createElement('div');
        this.poemLine1.className = 'poem-line brush-font line1';
        this.poemLine1.textContent = '人生无根蒂';
        
        this.poemLine2 = document.createElement('div');
        this.poemLine2.className = 'poem-line brush-font line2';
        this.poemLine2.textContent = '飘如陌上尘';
        
        // 添加到DOM
        this.poemContainer.appendChild(this.poemLine1);
        this.poemContainer.appendChild(this.poemLine2);
        
        this.preloadMask.appendChild(this.inkBackground);
        this.preloadMask.appendChild(this.poemContainer);
        
        document.body.appendChild(this.preloadMask);
    }
    
    // 移除飘尘粒子创建方法，简化动画效果
    
    preloadAudio() {
        // 尝试预加载开场音效
        this.audio = new Audio('assets/sounds/开场音.wav');
        this.audio.volume = 0.5;
        this.audio.load();
    }
    
    bindEvents() {
        // 监听动画结束事件
        this.preloadMask.addEventListener('animationend', (e) => {
            if (e.target === this.preloadMask && e.animationName === 'fadeOutPreload') {
                this.cleanUp();
            }
        });
    }
    
    start() {
        if (this.initialized) return;
        this.initialized = true;
        this.startTime = Date.now();
        
        // 播放音频
        this.playAudio();
        
        // 开始动画 - 两句诗同时渐显
        setTimeout(() => {
            this.poemLine1.classList.add('animate');
            this.poemLine2.classList.add('animate');
        }, 500);
        
        // 设置结束动画的定时器
        setTimeout(() => {
            this.complete();
        }, this.animationDuration);
    }
    
    playAudio() {
        // 尝试播放音频
        if (this.audio) {
            this.audio.play().catch(err => {
                console.warn('无法播放开场音效:', err);
            });
        }
    }
    
    complete() {
        if (this.completed) return;
        this.completed = true;
        
        // 添加淡出动画类
        this.preloadMask.classList.add('fade-out');
    }
    
    cleanUp() {
        // 移除开屏动画元素
        if (this.preloadMask && this.preloadMask.parentNode) {
            this.preloadMask.parentNode.removeChild(this.preloadMask);
        }
        
        // 触发自定义事件，通知应用程序动画已完成
        document.dispatchEvent(new CustomEvent('preloadAnimationComplete'));
    }
    
    // 用于外部强制跳过动画
    skip() {
        this.complete();
    }
}

// 创建并导出实例
const preloadAnimation = new PreloadAnimation();

// 页面加载完成后启动动画
window.addEventListener('load', () => {
    // 延迟一小段时间启动，确保页面已完全渲染
    setTimeout(() => {
        preloadAnimation.start();
    }, 100);
});

// 允许用户点击跳过动画
document.addEventListener('click', () => {
    if (preloadAnimation.initialized && !preloadAnimation.completed) {
        preloadAnimation.skip();
    }
});