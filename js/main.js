/**
 * 点将 - 核心抽人功能实现
 */

class NameSelector {
    constructor() {
        // DOM元素初始化
        this.nameDisplay = document.getElementById('nameDisplay');
        this.inkSplash = document.getElementById('inkSplash');
        this.startBtn = document.getElementById('startBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.excludeSelectedCheck = document.getElementById('excludeSelected');
        this.preloadedAudio = document.getElementById('guqinAudio');
        
        // 确保按钮初始状态包含span标签
        if (this.startBtn && this.startBtn.innerHTML.trim() === '點') {
            this.startBtn.innerHTML = '<span>點</span>';
        }
        
        // 状态初始化
        this.isSelecting = false;
        this.animationInterval = null;
        this.audioLoaded = false;
        this.audioElement = null;
        
        // 初始化
        this.initAudio();
        this.bindEvents();
        this.updateLayout();
        
        // 记录音频加载状态
        console.log('NameSelector 初始化完成');
        console.log('预加载音频元素是否存在:', this.preloadedAudio ? '是' : '否');
        
        // 在用户交互时尝试播放一个静音的音效，以解锁音频
        document.addEventListener('click', () => {
            this.unlockAudio();
        }, { once: true });
    }
    
    // 初始化所有音频相关功能
    initAudio() {
        console.log('初始化音频...');
        
        // 初始化备用音频
        this.initBackupAudio();
        
        // 预加载主音频元素事件监听
        if (this.preloadedAudio) {
            this.preloadedAudio.addEventListener('canplaythrough', () => {
                console.log('预加载音频加载完成，可以播放');
                this.audioLoaded = true;
            });
            
            this.preloadedAudio.addEventListener('error', (e) => {
                console.warn('预加载音频加载失败，将使用备用方法');
            });
            
            // 确保音频已加载
            if (this.preloadedAudio.readyState < 4) {
                this.preloadedAudio.load();
            }
        }
    }
    
    // 新增：解锁音频播放
    unlockAudio() {
        console.log('尝试解锁音频...');
        
        // 尝试使用预加载音频
        if (this.preloadedAudio) {
            const originalVolume = this.preloadedAudio.volume;
            this.preloadedAudio.volume = 0; // 静音播放
            
            this.preloadedAudio.play()
                .then(() => {
                    console.log('预加载音频解锁成功');
                    this.preloadedAudio.pause();
                    this.preloadedAudio.currentTime = 0;
                    this.preloadedAudio.volume = originalVolume;
                    this.audioLoaded = true;
                })
                .catch(error => {
                    console.warn('预加载音频解锁失败，将使用备用方法');
                });
        }
        
        // 同时尝试解锁备用音频
        if (this.audioElement) {
            const originalVolume = this.audioElement.volume;
            this.audioElement.volume = 0;
            
            this.audioElement.play()
                .then(() => {
                    this.audioElement.pause();
                    this.audioElement.currentTime = 0;
                    this.audioElement.volume = originalVolume;
                })
                .catch(() => {});
        }
    }
    
    // 使用预加载音频播放
    playPreloadedAudio() {
        if (!this.preloadedAudio) {
            console.warn('预加载音频元素不存在');
            return false;
        }
        
        try {
            console.log('尝试播放预加载音频...');
            // 重置音频
            this.preloadedAudio.currentTime = 0;
            // 设置音量
            this.preloadedAudio.volume = 1.0;
            
            // 播放
            const playPromise = this.preloadedAudio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('预加载音频播放成功');
                    return true;
                }).catch(error => {
                    console.warn('预加载音频播放失败，将使用备用方法');
                    // 尝试备用方法
                    this.playBackupAudio();
                    return false;
                });
            }
        } catch (error) {
            console.warn('播放预加载音频时出错，将使用备用方法');
            // 尝试备用方法
            this.playBackupAudio();
            return false;
        }
        
        return true;
    }
    
    // 初始化备用音频
    initBackupAudio() {
        console.log('初始化备用音频元素...');
        this.audioElement = new Audio();
        
        // 监听加载完成事件
        this.audioElement.addEventListener('canplaythrough', () => {
            console.log('备用音频加载完成，可以播放');
            this.audioLoaded = true;
        });
        
        // 监听错误事件
        this.audioElement.addEventListener('error', (e) => {
            console.warn('备用音频加载失败');
        });
        
        // 尝试多个可能的路径
        const possiblePaths = [
            'assets/sounds/古琴音.mp3',
            './assets/sounds/古琴音.mp3',
            'sounds/古琴音.mp3'
        ];
        
        // 先尝试第一个路径
        this.audioElement.src = possiblePaths[0];
        
        // 预加载音频
        this.audioElement.load();
    }
    
    // 隐藏主界面标题
    hideMainTitle() {
        // 查找并隐藏标题元素
        // 尝试几种可能的标题选择器
        const possibleTitleSelectors = [
            '.title', 'h1', 'h2', '.app-header', '.header-title',
            '.main-title', '#title', '[data-title]'
        ];
        
        possibleTitleSelectors.forEach(selector => {
            const titleElements = document.querySelectorAll(selector);
            titleElements.forEach(el => {
                // 排除开屏动画中的标题
                if (!el.closest('.preload-mask')) {
                    el.style.display = 'none';
                }
            });
        });
        
        // 如果有特定的主标题ID
        const appTitle = document.getElementById('appTitle');
        if (appTitle) {
            appTitle.style.display = 'none';
        }
    }
    
    // 绑定事件
    bindEvents() {
        this.startBtn.addEventListener('click', () => {
            if (!this.isSelecting) {
                this.startSelection();
            } else {
                this.stopSelection();
            }
        });
        
        this.settingsBtn.addEventListener('click', () => this.toggleSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.toggleSettings());
        
        this.excludeSelectedCheck.addEventListener('change', (e) => {
            window.nameData.setExcludeSelected(e.target.checked);
        });
        
        // 按钮涟漪效果
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => this.createRippleEffect(e, button));
        });
    }
    
    // 按钮涟漪效果
    createRippleEffect(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // 更新布局
    updateLayout() {
        const layout = window.nameData.settings.layout;
        this.nameDisplay.classList.toggle('vertical', layout === 'vertical');
        this.nameDisplay.classList.toggle('horizontal', layout !== 'vertical');
        this.excludeSelectedCheck.checked = window.nameData.settings.excludeSelected;
    }
    
    // 切换布局
    toggleLayout() {
        window.nameData.toggleLayout();
        this.updateLayout();
    }
    
    // 显示设置面板
    toggleSettings() {
        this.settingsPanel.classList.toggle('visible');
        this.settingsPanel.classList.toggle('hidden');
    }
    
    // 开始选择
    startSelection() {
        this.isSelecting = true;
        this.startBtn.innerHTML = '<span class="icon">⏹</span>';
        this.startBtn.classList.add('selecting');
        
        // 重置墨水特效
        this.inkSplash.innerHTML = '';
        
        // 启动名字动画
        this.nameScrollAnimation();
        
        // 添加动画开始的墨点效果
        this.createStartSelectionEffect();
    }
    
    // 创建选择开始时的墨点特效
    createStartSelectionEffect() {
        // 在名字容器周围创建多个墨点
        const rect = this.nameDisplay.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 在四周创建多个小墨点
        const numPoints = 4;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const distance = Math.min(rect.width, rect.height) * 0.5;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            setTimeout(() => {
                window.inkEffect.createInkBlot(x, y, 0.5);
            }, i * 150);
        }
    }
    
    // 停止选择
    stopSelection() {
        if (!this.isSelecting) return;
        
        this.isSelecting = false;
        clearInterval(this.animationInterval);
        this.startBtn.innerHTML = '<span>點</span>';
        this.startBtn.classList.remove('selecting');
        
        const selectedName = window.nameData.getRandomName();
        this.displayFinalSelection(selectedName);
    }
    
    // 显示最终选择结果，带有特效
    displayFinalSelection(name) {
        // 清空当前显示
        this.nameDisplay.innerHTML = '';
        
        // 播放音效 - 简化为直接使用有效的方法
        this.playAudio();
        
        // 创建主文字元素
        const mainText = document.createElement('div');
        mainText.className = 'final-name brush-font';
        
        // 确保文字可见，添加阴影
        mainText.style.textShadow = '0 0 10px #F5F0E6, 0 0 15px #F5F0E6, 0 0 20px #F5F0E6';
        mainText.style.color = '#000';
        mainText.style.position = 'relative';
        mainText.style.zIndex = '10';
        mainText.style.whiteSpace = 'nowrap'; // 防止文字换行
        mainText.style.textAlign = 'center';
        mainText.style.width = '100%';
        
        // 根据名字长度调整字体大小
        if (name.length > 2) {
            mainText.style.fontSize = '8rem'; // 较长名字使用稍小字体
        } else {
            mainText.style.fontSize = '10rem'; // 短名字可以用更大字体
        }
        
        // 为每个字添加独立元素，实现逐字入场
        for (let i = 0; i < name.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.textContent = name[i];
            charSpan.style.opacity = '0';
            charSpan.style.transform = 'scale(0.5) translateY(20px)';
            charSpan.style.animation = `fadeInAndScale 0.4s forwards ${i * 0.1}s`;
            mainText.appendChild(charSpan);
        }
        
        this.nameDisplay.appendChild(mainText);
        
        // 创建绽放特效
        setTimeout(() => {
            this.createSplashEffect();
        }, name.length * 100);
        
        // 添加墨点扩散动画
        this.addRevealEffects(name.length);
    }
    
    // 集中处理音频播放的方法 - 简化后的版本
    playAudio() {
        let played = false;
        
        // 方法1: 使用预加载的HTML音频元素（最简单最可靠）
        if (this.preloadedAudio) {
            try {
                this.preloadedAudio.currentTime = 0;
                this.preloadedAudio.volume = 1.0;
                
                const playPromise = this.preloadedAudio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('预加载音频播放成功');
                        played = true;
                    }).catch(error => {
                        console.warn('预加载音频播放失败，尝试备用方法');
                        if (!played) this.playBackupAudio(); 
                    });
                }
            } catch (error) {
                console.warn('预加载音频播放出错:', error);
                if (!played) this.playBackupAudio();
            }
        } else {
            // 如果没有预加载元素，直接使用备用方法
            this.playBackupAudio();
        }
    }
    
    // 使用备用方式播放音频
    playBackupAudio() {
        console.log('尝试使用备用方式播放音频...');
        
        if (this.audioElement) {
            try {
                // 重置音频
                this.audioElement.currentTime = 0;
                // 设置音量
                this.audioElement.volume = 1.0;
                
                // 播放
                const playPromise = this.audioElement.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('备用音频播放成功');
                    }).catch(error => {
                        console.warn('备用音频播放失败:', error);
                        // 最后尝试创建新的Audio对象
                        this.playSimpleSound();
                    });
                }
            } catch (error) {
                console.warn('播放备用音频时出错:', error);
                // 最后尝试创建新的Audio对象
                this.playSimpleSound();
            }
        } else {
            // 直接尝试创建新的Audio对象
            this.playSimpleSound();
        }
    }
    
    // 简单的播放方法 - 作为最后的备用
    playSimpleSound() {
        try {
            console.log('尝试使用简单方式播放音频...');
            const audio = new Audio();
            
            // 尝试几个可能的路径
            const paths = [
                'assets/sounds/古琴音.mp3',
                'sounds/古琴音.mp3'
            ];
            
            // 设置可能的源
            for (const path of paths) {
                const source = document.createElement('source');
                source.src = path;
                source.type = 'audio/mpeg';
                audio.appendChild(source);
            }
            
            audio.volume = 1.0;
            audio.play().then(() => {
                console.log('简单音频播放成功');
            }).catch(error => {
                console.warn('简单音频播放也失败了，已尝试所有方法');
            });
        } catch (error) {
            console.warn('创建简单音频对象失败');
        }
    }
    
    // 添加结果显示时的额外特效
    addRevealEffects(nameLength) {
        // 在文字完全显示后添加背景墨点
        setTimeout(() => {
            // 获取名字容器位置
            const rect = this.nameDisplay.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 在四周创建墨点
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
                const distance = Math.min(rect.width, rect.height) * (Math.random() * 0.5 + 0.8);
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                setTimeout(() => {
                    window.inkEffect.createInkBlot(x, y, 0.3 + Math.random() * 0.2);
                }, i * 50);
            }
        }, nameLength * 100 + 200);
    }
    
    // 名字滚动动画
    nameScrollAnimation() {
        let counter = 0;
        const maxScrolls = 15; // 减少滚动次数，缩短总时长至约1.5秒
        const minSpeed = 20;
        const maxSpeed = 200; // 稍微调整最大速度
        let currentSpeed = 60; // 稍微调整初始速度
        
        const animate = () => {
            const randomName = window.nameData.getScrollNames(1)[0];
            this.updateNameWithAnimation(randomName, counter);
            counter++;
            
            if (counter >= maxScrolls) {
                this.stopSelection();
                return;
            }
            
            currentSpeed = counter < maxScrolls * 0.2 ? 
                Math.max(minSpeed, currentSpeed - 5) :
                Math.min(maxSpeed, currentSpeed + 15); // 稍微调整速度变化率
            
            setTimeout(animate, currentSpeed);
        };
        
        animate();
    }
    
    // 带动画更新名字
    updateNameWithAnimation(name, counter) {
        // 创建动画效果
        this.nameDisplay.innerHTML = '';
        
        const nameContainer = document.createElement('div');
        nameContainer.className = 'name-scroll-container brush-font';
        
        // 确保字体可见
        nameContainer.style.textShadow = '0 0 10px #F5F0E6, 0 0 15px #F5F0E6';
        nameContainer.style.position = 'relative';
        nameContainer.style.zIndex = '10';
        
        // 添加防止换行的样式
        nameContainer.style.whiteSpace = 'nowrap';
        nameContainer.style.width = '100%';
        nameContainer.style.textAlign = 'center';
        
        // 减小字体大小范围，避免字体过大导致自动换行
        const fontSize = Math.floor(Math.random() * 25) + 55; // 55px到80px随机大小
        nameContainer.style.fontSize = `${fontSize}px`;
        
        // 添加更丰富的动画效果
        const effects = ['rotate', 'scale', 'blur', 'skew'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        
        let transform = '';
        let filter = '';
        
        // 应用随机效果
        switch (randomEffect) {
            case 'rotate':
                const rotation = Math.random() * 8 - 4; // -4度到4度随机旋转
                transform = `rotate(${rotation}deg)`;
                break;
            case 'scale':
                const scale = Math.random() * 0.3 + 0.85; // 0.85到1.15的随机缩放
                transform = `scale(${scale})`;
                break;
            case 'blur':
                const blur = Math.random() * 2;  // 减小模糊效果
                filter = `blur(${blur}px)`;
                break;
            case 'skew':
                const skew = Math.random() * 6 - 3; // 减小倾斜角度
                transform = `skewX(${skew}deg)`;
                break;
        }
        
        nameContainer.style.transform = transform;
        nameContainer.style.filter = filter;
        
        // 添加文字并设置透明度过渡
        nameContainer.textContent = name;
        nameContainer.style.opacity = '0';
        nameContainer.style.animation = 'fadeInOut 0.3s forwards';
        
        // 每隔几帧添加一个墨点效果
        if (counter % 5 === 0) {
            const rect = this.nameDisplay.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 随机位置
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.min(rect.width, rect.height) * 0.5 * Math.random();
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            window.inkEffect.createInkBlot(x, y, 0.2 + Math.random() * 0.1);
        }
        
        this.nameDisplay.appendChild(nameContainer);
    }
    
    // 创建墨水绽放效果
    createSplashEffect() {
        // 获取名字容器的位置
        const rect = this.nameDisplay.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 调用水墨效果的绽放方法
        window.inkEffect.createInkSplash(centerX, centerY, 1.5);
        
        // 添加DOM动画效果
        const splashDom = document.createElement('div');
        splashDom.className = 'ink-splash-effect';
        splashDom.style.position = 'absolute';
        splashDom.style.left = `${centerX}px`;
        splashDom.style.top = `${centerY}px`;
        splashDom.style.transform = 'translate(-50%, -50%)';
        splashDom.style.width = '10px';
        splashDom.style.height = '10px';
        splashDom.style.borderRadius = '50%';
        splashDom.style.background = 'rgba(0,0,0,0.8)';
        splashDom.style.zIndex = '5';
        splashDom.style.animation = 'splashExpand 0.6s forwards';
        
        document.body.appendChild(splashDom);
        
        // 动画结束后移除
        setTimeout(() => {
            splashDom.remove();
        }, 600);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new NameSelector();
});