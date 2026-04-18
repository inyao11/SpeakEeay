/**
 * App Module - 主应用逻辑
 * 整合所有模块，实现完整的对话学习功能
 */

const app = {
    // 当前状态
    currentScene: 'greeting',
    currentDialogue: null,
    currentLineIndex: 0,
    dialoguesInScene: [],
    currentDialogueIndex: 0,
    isTimerRunning: false,
    timerInterval: null,
    timeRemaining: 30 * 60,
    totalTime: 30 * 60,
    recordingStartTime: null,
    hasRecording: false,
    isPlayingAll: false,
    currentPlayingIndex: -1,

    // 初始化应用
    async init() {
        this.loadSettings();
        this.initTheme();
        this.renderSceneTabs();
        await this.loadNewDialogue();
        this.updateStreakDisplay();
        this.initEventListeners();
        Display.init();
        Storage.updateLastVisit();
        this.renderRecordingHistory();
        this.checkTodayCheckIn();
    },

    // 加载设置
    loadSettings() {
        const settings = Storage.getSettings();
        document.getElementById('accentSelect').value = settings.accent;
        document.getElementById('rateSlider').value = settings.rate;
        document.getElementById('rateValue').textContent = settings.rate + 'x';
        document.getElementById('volumeSlider').value = settings.volume;
        document.getElementById('volumeValue').textContent = Math.round(settings.volume * 100) + '%';
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        }
    },

    // 初始化主题
    initTheme() {
        const settings = Storage.getSettings();
        if (settings.darkMode || (!settings.darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    },

    // 渲染场景标签
    renderSceneTabs() {
        const container = document.getElementById('sceneTabs');
        const scenes = Data.getScenes();
        container.innerHTML = scenes.map(scene => `
            <button class="scene-tab px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-600 whitespace-nowrap transition-all ${
                scene.id === this.currentScene
                    ? 'active bg-primary text-white border-primary'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            }" data-scene="${scene.id}" title="${scene.desc}">
                <i class="fas ${scene.icon} mr-1"></i>${scene.name}
            </button>
        `).join('');
        container.querySelectorAll('.scene-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.currentScene = e.currentTarget.dataset.scene;
                this.renderSceneTabs();
                this.loadNewDialogue();
            });
        });
    },

    // 加载新对话
    async loadNewDialogue() {
        await Data.fetchOnlineDialogues();
        this.dialoguesInScene = Data.getConversations(this.currentScene);
        if (this.dialoguesInScene.length === 0) {
            this.showToast('该场景暂无对话');
            return;
        }
        this.currentDialogueIndex = 0;
        this.currentDialogue = this.dialoguesInScene[0];
        this.currentLineIndex = 0;
        this.hasRecording = false;
        this.isPlayingAll = false;
        this.updatePlayAllButton();
        this.renderDialogue();
        this.updateSceneBadge();
        this.updateCurrentLineDisplay();
    },

    // 加载下一段对话
    loadNextDialogue() {
        if (this.dialoguesInScene.length === 0) return;
        this.currentDialogueIndex = (this.currentDialogueIndex + 1) % this.dialoguesInScene.length;
        this.currentDialogue = this.dialoguesInScene[this.currentDialogueIndex];
        this.currentLineIndex = 0;
        this.hasRecording = false;
        this.isPlayingAll = false;
        this.updatePlayAllButton();
        this.renderDialogue();
        this.hideScoreResult();
        this.updateCurrentLineDisplay();
    },

    // 更新场景标签
    updateSceneBadge() {
        const scenes = Data.getScenes();
        const scene = scenes.find(s => s.id === this.currentScene);
        if (scene) {
            document.getElementById('currentSceneBadge').textContent = scene.name;
        }
    },

    // 渲染对话
    renderDialogue() {
        if (!this.currentDialogue) return;
        document.getElementById('dialogueTitle').textContent = this.currentDialogue.title;
        document.getElementById('dialogueProgress').textContent = `对话 ${this.currentDialogueIndex + 1} / ${this.dialoguesInScene.length}`;
        const container = document.getElementById('dialogueContainer');
        const mode = Display.getCurrentMode();
        
        container.innerHTML = this.currentDialogue.dialogues.map((line, index) => {
            const isActive = index === this.currentLineIndex;
            const isLeft = line.speaker === 'A';
            const isPlaying = index === this.currentPlayingIndex;
            
            let contentHtml = '';
            if (mode === 'hide') {
                contentHtml = `
                    <div class="text-center py-4">
                        <i class="fas fa-headphones text-2xl text-gray-300 mb-2"></i>
                        <p class="text-xs text-gray-400">听力模式</p>
                    </div>
                `;
            } else {
                contentHtml = `
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-medium ${isLeft ? 'text-gray-500' : 'text-primary'}">${line.speaker}</span>
                        ${isActive ? '<span class="text-xs text-primary"><i class="fas fa-hand-point-left"></i> 当前</span>' : ''}
                        ${isPlaying ? '<span class="text-xs text-green-500 animate-pulse"><i class="fas fa-volume-up"></i> 播放中</span>' : ''}
                    </div>
                    <p class="text-sm text-gray-800 dark:text-gray-100 mb-1">${line.en}</p>
                    ${mode === 'note' ? `<p class="text-xs text-gray-500 dark:text-gray-400">${line.zh}</p>` : ''}
                    ${mode === 'note' && line.phonetic ? `<p class="text-xs text-blue-500 mt-1">${line.phonetic}</p>` : ''}
                `;
            }
            
            return `
                <div class="dialogue-line flex ${isLeft ? 'justify-start' : 'justify-end'} ${isActive ? 'opacity-100' : 'opacity-60'} cursor-pointer transition-opacity hover:opacity-100" data-index="${index}">
                    <div class="max-w-[80%] ${isLeft ? 'bg-white dark:bg-gray-700' : 'bg-primary/10 dark:bg-primary/20'} rounded-2xl px-4 py-3 shadow-sm border ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 dark:border-gray-600'}">
                        ${contentHtml}
                    </div>
                </div>
            `;
        }).join('');
        
        container.querySelectorAll('.dialogue-line').forEach(line => {
            line.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.selectLine(index);
            });
        });
        this.scrollToCurrentLine();
        this.updateFavoriteButton();
    },

    // 选择句子
    selectLine(index) {
        this.currentLineIndex = index;
        this.hasRecording = false;
        this.renderDialogue();
        this.updateCurrentLineDisplay();
        this.hideScoreResult();
    },

    // 滚动到当前句子
    scrollToCurrentLine() {
        const container = document.getElementById('dialogueContainer');
        const currentLine = container.querySelector(`[data-index="${this.currentLineIndex}"]`);
        if (currentLine) {
            currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },

    // 更新当前句子显示
    updateCurrentLineDisplay() {
        if (!this.currentDialogue) return;
        const line = this.currentDialogue.dialogues[this.currentLineIndex];
        if (!line) return;
        document.getElementById('currentSpeaker').textContent = line.speaker;
        document.getElementById('currentLineText').textContent = line.en;
        document.getElementById('currentLineTranslation').textContent = line.zh;
        document.getElementById('currentLineNote').textContent = line.note || '';
        const mode = Display.getCurrentMode();
        document.getElementById('currentLineTranslation').style.display = mode === 'original' || mode === 'hide' ? 'none' : 'block';
        document.getElementById('currentLineNote').style.display = mode === 'note' ? 'block' : 'none';
    },

    // 更新收藏按钮
    updateFavoriteButton() {
        const btn = document.getElementById('favoriteBtn');
        const line = this.getCurrentLine();
        if (!line) return;
        const isFav = Storage.isFavorite(line.en);
        if (isFav) {
            btn.classList.add('favorite-active');
            btn.innerHTML = '<i class="fas fa-star text-yellow-500"></i><span>已收藏</span>';
        } else {
            btn.classList.remove('favorite-active');
            btn.innerHTML = '<i class="far fa-star"></i><span>收藏</span>';
        }
    },

    // 获取当前句子
    getCurrentLine() {
        if (!this.currentDialogue) return null;
        return this.currentDialogue.dialogues[this.currentLineIndex];
    },

    // 初始化事件监听
    initEventListeners() {
        document.getElementById('themeToggle').addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            Storage.saveSettings({ darkMode: isDark });
        });
        document.getElementById('playBtn').addEventListener('click', () => {
            const line = this.getCurrentLine();
            if (line) {
                Speech.speak(line.en);
                this.addSentenceCount();
            }
        });
        document.getElementById('playAllBtn').addEventListener('click', () => {
            this.togglePlayAll();
        });
        document.getElementById('recordBtn').addEventListener('click', () => {
            this.toggleRecording();
        });
        document.getElementById('favoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });
        document.getElementById('prevLineBtn').addEventListener('click', () => {
            if (this.currentLineIndex > 0) {
                this.selectLine(this.currentLineIndex - 1);
            }
        });
        document.getElementById('nextLineBtn').addEventListener('click', () => {
            if (this.currentDialogue && this.currentLineIndex < this.currentDialogue.dialogues.length - 1) {
                this.selectLine(this.currentLineIndex + 1);
            }
        });
        document.getElementById('nextDialogueBtn').addEventListener('click', () => {
            this.loadNextDialogue();
        });
        document.getElementById('checkInBtn').addEventListener('click', () => {
            this.doCheckIn();
        });
        document.getElementById('statsBtn').addEventListener('click', () => {
            this.showStats();
        });
        document.getElementById('clearRecordingsBtn').addEventListener('click', () => {
            this.clearRecordingHistory();
        });
        document.getElementById('accentSelect').addEventListener('change', (e) => {
            Storage.saveSettings({ accent: e.target.value });
        });
        document.getElementById('rateSlider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('rateValue').textContent = value.toFixed(1) + 'x';
            Storage.saveSettings({ rate: value });
        });
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('volumeValue').textContent = Math.round(value * 100) + '%';
            Storage.saveSettings({ volume: value });
        });
    },

    // 切换全部播放
    async togglePlayAll() {
        if (this.isPlayingAll) {
            Speech.stopAll();
            this.isPlayingAll = false;
            this.updatePlayAllButton();
            return;
        }
        
        if (!this.currentDialogue) return;
        
        this.isPlayingAll = true;
        this.updatePlayAllButton();
        
        const lines = this.currentDialogue.dialogues.map(d => d.en);
        
        await Speech.playAllLines(
            lines,
            (index) => {
                // 每句开始播放时的回调
                this.currentPlayingIndex = index;
                this.selectLine(index);
            },
            () => {
                // 播放完成的回调
                this.isPlayingAll = false;
                this.currentPlayingIndex = -1;
                this.updatePlayAllButton();
                this.renderDialogue();
            }
        );
    },

    // 更新全部播放按钮
    updatePlayAllButton() {
        const btn = document.getElementById('playAllBtn');
        if (this.isPlayingAll) {
            btn.innerHTML = '<i class="fas fa-stop"></i><span>停止</span>';
            btn.classList.remove('bg-indigo-500', 'hover:bg-indigo-600');
            btn.classList.add('bg-red-500', 'hover:bg-red-600');
        } else {
            btn.innerHTML = '<i class="fas fa-play"></i><span>全部播放</span>';
            btn.classList.remove('bg-red-500', 'hover:bg-red-600');
            btn.classList.add('bg-indigo-500', 'hover:bg-indigo-600');
        }
    },

    // 切换录音
    async toggleRecording() {
        const btn = document.getElementById('recordBtn');
        if (Speech.isRecording) {
            // 停止录音并等待数据准备好
            const recordingUrl = await Speech.stopRecording();
            btn.classList.remove('recording');
            btn.innerHTML = '<i class="fas fa-microphone"></i><span>跟读</span>';
            
            // 处理录音结果
            if (recordingUrl) {
                this.finishRecording(recordingUrl);
            }
        } else {
            if (!Speech.isRecognitionSupported() && !Speech.isMediaRecordingSupported()) {
                this.showToast('您的浏览器不支持录音功能');
                return;
            }
            Speech.clearRecording();
            this.recordingStartTime = Date.now();
            btn.classList.add('recording');
            btn.innerHTML = '<i class="fas fa-stop"></i><span>停止</span>';
            
            const success = await Speech.startRecording(
                (transcript) => {
                    // 语音识别结果回调
                    this.handleRecognitionResult(transcript);
                },
                (error) => {
                    this.showToast('录音失败: ' + error);
                    btn.classList.remove('recording');
                    btn.innerHTML = '<i class="fas fa-microphone"></i><span>跟读</span>';
                }
            );
            
            if (!success) {
                btn.classList.remove('recording');
                btn.innerHTML = '<i class="fas fa-microphone"></i><span>跟读</span>';
            }
        }
    },

    // 处理语音识别结果
    handleRecognitionResult(transcript) {
        this.lastTranscript = transcript;
    },

    // 完成录音处理
    finishRecording(recordingUrl) {
        const line = this.getCurrentLine();
        if (!line) return;
        
        const duration = Date.now() - this.recordingStartTime;
        const transcript = this.lastTranscript || '';
        const score = AIScore.calculateScore(line.en, transcript, duration);
        
        // 添加到录音历史
        if (recordingUrl) {
            Speech.addRecordingToHistory(line.en, recordingUrl, score.total);
            this.renderRecordingHistory();
            this.showToast('录音已保存');
        }
        
        this.showScoreResult(score);
        Storage.addHistory({
            sentence: line,
            score: score.total,
            timestamp: new Date().toISOString()
        });
        
        const stats = Storage.getStats();
        const newTotalRecordings = stats.totalRecordings + 1;
        const newAverageScore = Math.round(
            (stats.averageScore * stats.totalRecordings + score.total) / newTotalRecordings
        );
        Storage.updateStats({
            totalRecordings: newTotalRecordings,
            averageScore: newAverageScore
        });
        
        // 清除临时转录文本
        this.lastTranscript = '';
    },

    // 渲染录音历史
    renderRecordingHistory() {
        const history = Speech.getRecordingHistory();
        const container = document.getElementById('recordingList');
        const clearBtn = document.getElementById('clearRecordingsBtn');
        
        if (history.length === 0) {
            container.innerHTML = '<p class="text-xs text-gray-400 text-center py-4">暂无录音，点击"跟读"开始练习</p>';
            clearBtn.classList.add('hidden');
        } else {
            clearBtn.classList.remove('hidden');
            container.innerHTML = history.map((rec, index) => {
                const date = new Date(rec.timestamp);
                const timeStr = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                return `
                    <div class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span class="text-xs text-gray-400 w-6">#${history.length - index}</span>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs text-gray-700 dark:text-gray-300 truncate">${rec.lineText.substring(0, 30)}${rec.lineText.length > 30 ? '...' : ''}</p>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-xs text-gray-400">${timeStr}</span>
                                ${rec.score ? `<span class="text-xs px-1.5 py-0.5 bg-green-100 text-green-600 rounded">${rec.score}分</span>` : ''}
                            </div>
                        </div>
                        <button onclick="app.playRecordingByIndex(${index})" class="p-1.5 text-primary hover:bg-primary/10 rounded" title="播放">
                            <i class="fas fa-play text-xs"></i>
                        </button>
                        <button onclick="app.deleteRecordingByIndex(${index})" class="p-1.5 text-red-500 hover:bg-red-50 rounded" title="删除">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                `;
            }).join('');
        }
    },

    // 播放指定录音
    playRecordingByIndex(index) {
        const history = Speech.getRecordingHistory();
        if (history[index]) {
            Speech.playRecording(history[index].url);
        }
    },

    // 删除指定录音
    deleteRecordingByIndex(index) {
        const history = Speech.getRecordingHistory();
        if (history[index]) {
            Speech.deleteRecording(history[index].id);
            this.renderRecordingHistory();
        }
    },

    // 清空录音历史
    clearRecordingHistory() {
        if (confirm('确定要清空所有录音吗？')) {
            Speech.clearRecordingHistory();
            this.renderRecordingHistory();
            this.showToast('录音已清空');
        }
    },

    // 显示评分结果
    showScoreResult(score) {
        const resultDiv = document.getElementById('scoreResult');
        resultDiv.classList.remove('hidden');
        this.animateNumber('totalScore', score.total);
        this.animateNumber('pronunciationScore', score.pronunciation);
        this.animateNumber('fluencyScore', score.fluency);
        this.animateNumber('rhythmScore', score.rhythm);
        setTimeout(() => {
            this.showToast(score.feedback);
        }, 500);
    },

    // 隐藏评分结果
    hideScoreResult() {
        document.getElementById('scoreResult').classList.add('hidden');
    },

    // 数字动画
    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const duration = 800;
        const startValue = 0;
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeProgress);
            element.textContent = currentValue;
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },

    // 切换收藏
    toggleFavorite() {
        const line = this.getCurrentLine();
        if (!line) return;
        const isFav = Storage.isFavorite(line.en);
        if (isFav) {
            Storage.removeFavorite(line.en);
            this.showToast('已取消收藏');
        } else {
            Storage.addFavorite({
                ...line,
                scene: this.currentScene,
                dialogueTitle: this.currentDialogue.title
            });
            this.showToast('已添加到收藏夹');
        }
        this.updateFavoriteButton();
    },

    // 每日打卡
    doCheckIn() {
        const btn = document.getElementById('checkInBtn');
        
        if (Storage.isCheckedIn()) {
            this.showToast('今日已打卡，明天再来吧！');
            btn.innerHTML = '<i class="fas fa-check mr-1"></i> 已打卡';
            btn.disabled = true;
            btn.classList.add('opacity-50');
            return;
        }
        
        Storage.addCheckin();
        Storage.addStudyTime(1); // 每次打卡记录1分钟学习时间
        this.updateStreakDisplay();
        
        this.showToast('打卡成功！继续保持！');
        btn.innerHTML = '<i class="fas fa-check mr-1"></i> 已打卡';
        btn.disabled = true;
        btn.classList.add('opacity-50');
    },

    // 检查今日打卡状态
    checkTodayCheckIn() {
        const btn = document.getElementById('checkInBtn');
        if (Storage.isCheckedIn()) {
            btn.innerHTML = '<i class="fas fa-check mr-1"></i> 已打卡';
            btn.disabled = true;
            btn.classList.add('opacity-50');
        }
    },

    // 更新连续打卡显示
    updateStreakDisplay() {
        const streak = Storage.getStreakDays();
        document.getElementById('streakDays').textContent = streak;
    },

    // 添加句子计数
    addSentenceCount() {
        Storage.addSentenceCount();
    },

    // 显示收藏夹
    showFavorites() {
        const favorites = Storage.getFavorites();
        const listContainer = document.getElementById('favoritesList');
        if (favorites.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="far fa-star text-4xl mb-2"></i>
                    <p>暂无收藏句子</p>
                </div>
            `;
        } else {
            listContainer.innerHTML = favorites.map((fav, index) => `
                <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-3" data-fav-index="${index}">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">${fav.dialogueTitle || '收藏'}</span>
                        <span class="text-xs text-gray-400">${fav.speaker || ''}</span>
                    </div>
                    <p class="font-medium text-gray-800 dark:text-gray-100 mb-1">${fav.en}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${fav.zh}</p>
                    <div class="flex gap-2">
                        <button class="play-fav-btn px-3 py-1 text-xs bg-primary text-white rounded-lg hover:bg-primaryHover" data-index="${index}">
                            <i class="fas fa-play mr-1"></i>播放
                        </button>
                        <button class="delete-fav-btn px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200" data-index="${index}">
                            <i class="fas fa-trash mr-1"></i>删除
                        </button>
                    </div>
                </div>
            `).join('');
            
            // 绑定事件
            listContainer.querySelectorAll('.play-fav-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.dataset.index);
                    this.playFavorite(index);
                });
            });
            
            listContainer.querySelectorAll('.delete-fav-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.dataset.index);
                    this.removeFavoriteItem(index);
                });
            });
        }
        this.openModal('favoritesModal');
    },

    // 播放收藏
    playFavorite(index) {
        const favorites = Storage.getFavorites();
        if (favorites[index]) {
            Speech.speak(favorites[index].en);
        }
    },

    // 删除收藏
    removeFavoriteItem(index) {
        const favorites = Storage.getFavorites();
        if (favorites[index]) {
            Storage.removeFavorite(favorites[index].en);
            this.showToast('已删除收藏');
            this.showFavorites();
            this.updateFavoriteButton();
        }
    },

    // 显示学习记录
    showHistory() {
        this.renderCalendar();
        this.renderHistoryList();
        this.openModal('historyModal');
    },

    // 渲染日历
    renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const checkins = Storage.getCheckins();
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        let html = '';
        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        weekDays.forEach(day => {
            html += `<div class="text-center text-xs text-gray-400 py-1">${day}</div>`;
        });
        for (let i = 0; i < startingDay; i++) {
            html += `<div></div>`;
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateStr = date.toDateString();
            const isChecked = checkins[dateStr];
            const isToday = day === today.getDate();
            html += `
                <div class="calendar-day ${isChecked ? 'checked' : 'bg-gray-100 dark:bg-gray-700'} ${isToday ? 'today' : ''}">
                    ${day}
                </div>
            `;
        }
        grid.innerHTML = html;
    },

    // 渲染历史列表
    renderHistoryList() {
        const history = Storage.getHistory();
        const listContainer = document.getElementById('historyList');
        if (history.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-history text-4xl mb-2"></i>
                    <p>暂无学习记录</p>
                </div>
            `;
        } else {
            listContainer.innerHTML = history.slice(0, 20).map(record => {
                const date = new Date(record.timestamp);
                const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
                return `
                    <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">${record.sentence?.en || ''}</p>
                            <p class="text-xs text-gray-500">${dateStr}</p>
                        </div>
                        ${record.score ? `<span class="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">${record.score}分</span>` : ''}
                    </div>
                `;
            }).join('');
        }
    },

    // 显示设置
    showSettings() {
        this.openModal('settingsModal');
    },

    // 显示关于
    showAbout() {
        this.openModal('aboutModal');
    },

    // 显示统计
    showStats() {
        const stats = Storage.getStats();
        document.getElementById('totalStudyTime').textContent = stats.totalStudyTime;
        document.getElementById('totalSentences').textContent = stats.totalSentences;
        document.getElementById('totalFavorites').textContent = Storage.getFavorites().length;
        document.getElementById('currentStreak').textContent = Storage.getStreakDays();
        this.openModal('statsModal');
    },

    // 打开弹窗
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.querySelector('div').classList.add('modal-enter');
    },

    // 关闭弹窗
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    },

    // 清除所有数据
    clearAllData() {
        if (confirm('确定要清除所有学习数据吗？此操作不可恢复。')) {
            Storage.clearAll();
            Speech.clearRecordingHistory();
            location.reload();
        }
    },

    // 显示 Toast
    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        toast.classList.add('toast-show');
        setTimeout(() => {
            toast.classList.remove('toast-show');
        }, 3000);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// 点击弹窗外部关闭
window.addEventListener('click', (e) => {
    const modals = ['favoritesModal', 'historyModal', 'settingsModal', 'aboutModal', 'statsModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (e.target === modal) {
            app.closeModal(modalId);
        }
    });
});
