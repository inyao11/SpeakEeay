/**
 * Display Module - 显示控制功能
 * 管理对话的显示模式：原文、注释、隐藏
 */

const Display = {
    // 当前显示模式
    currentMode: 'note',

    // 初始化
    init() {
        // 从本地存储读取显示偏好
        this.currentMode = Storage.getDisplayMode();
        this.updateButtonStates();
        this.bindEvents();
    },

    // 绑定事件
    bindEvents() {
        const buttons = document.querySelectorAll('.display-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.setMode(mode);
            });
        });
    },

    // 设置显示模式
    setMode(mode) {
        if (['original', 'note', 'hide'].includes(mode)) {
            this.currentMode = mode;
            this.updateButtonStates();
            Storage.saveDisplayMode(mode);
            // 触发应用重新渲染对话
            if (typeof app !== 'undefined' && app.renderDialogue) {
                app.renderDialogue();
            }
            if (typeof app !== 'undefined' && app.updateCurrentLineDisplay) {
                app.updateCurrentLineDisplay();
            }
        }
    },

    // 更新按钮状态
    updateButtonStates() {
        const buttons = document.querySelectorAll('.display-btn');
        buttons.forEach(btn => {
            const mode = btn.dataset.mode;
            if (mode === this.currentMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },

    // 获取当前模式
    getCurrentMode() {
        return this.currentMode;
    },

    // 切换到下一种模式
    toggleMode() {
        const modes = ['original', 'note', 'hide'];
        const currentIndex = modes.indexOf(this.currentMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        this.setMode(modes[nextIndex]);
    }
};
