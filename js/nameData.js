/**
 * 名单数据管理与随机选择逻辑
 */

class NameData {
    constructor() {
        this.names = [
            '名字1', '名字2', '名字3', '名字4', '名字5'
        ];
        
        this.selectedNames = [];
        this.settings = {
            excludeSelected: true,
            layout: 'vertical'
        };
        
        this.loadSettings();
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('nameSelector_settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
            
            const savedSelected = localStorage.getItem('nameSelector_selected');
            if (savedSelected) {
                this.selectedNames = JSON.parse(savedSelected);
            }
        } catch (e) {
            console.error('设置加载失败', e);
            this.selectedNames = [];
        }
    }
    
    saveSettings() {
        localStorage.setItem('nameSelector_settings', JSON.stringify(this.settings));
    }
    
    saveSelected() {
        localStorage.setItem('nameSelector_selected', JSON.stringify(this.selectedNames));
    }
    
    getAvailableNames() {
        if (!this.settings.excludeSelected || this.selectedNames.length === 0) {
            return [...this.names];
        }
        return this.names.filter(name => !this.selectedNames.includes(name));
    }
    
    getRandomName() {
        const availableNames = this.getAvailableNames();
        
        if (availableNames.length === 0 && this.settings.excludeSelected) {
            this.selectedNames = [];
            return this.getRandomName();
        }
        
        const selectedName = availableNames[Math.floor(Math.random() * availableNames.length)];
        
        if (this.settings.excludeSelected && !this.selectedNames.includes(selectedName)) {
            this.selectedNames.push(selectedName);
            this.saveSelected();
        }
        
        return selectedName;
    }
    
    getScrollNames(count) {
        return Array.from({length: count}, () => 
            this.names[Math.floor(Math.random() * this.names.length)]);
    }
    
    toggleLayout() {
        this.settings.layout = this.settings.layout === 'vertical' ? 'horizontal' : 'vertical';
        this.saveSettings();
        return this.settings.layout;
    }
    
    setExcludeSelected(value) {
        this.settings.excludeSelected = value;
        this.saveSettings();
    }
    
    resetSelected() {
        this.selectedNames = [];
        this.saveSelected();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.nameData = new NameData();
});