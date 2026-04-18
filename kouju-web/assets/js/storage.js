/**
 * Storage Module - 本地存储管理
 * 管理所有本地数据的读写，包括学习记录、收藏、设置等
 */

const Storage = {
    // 存储键名
    KEYS: {
        FAVORITES: 'speakeasy_favorites',
        HISTORY: 'speakeasy_history',
        CHECKINS: 'speakeasy_checkins',
        SETTINGS: 'speakeasy_settings',
        STATS: 'speakeasy_stats',
        DISPLAY_MODE: 'speakeasy_display_mode',
        LAST_VISIT: 'speakeasy_last_visit'
    },

    // 获取收藏列表
    getFavorites() {
        try {
            const data = localStorage.getItem(this.KEYS.FAVORITES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading favorites:', e);
            return [];
        }
    },

    // 保存收藏列表
    saveFavorites(favorites) {
        try {
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
            return true;
        } catch (e) {
            console.error('Error saving favorites:', e);
            return false;
        }
    },

    // 添加收藏
    addFavorite(sentence) {
        const favorites = this.getFavorites();
        const exists = favorites.some(f => f.en === sentence.en);
        if (!exists) {
            favorites.push({
                ...sentence,
                addedAt: new Date().toISOString()
            });
            this.saveFavorites(favorites);
            return true;
        }
        return false;
    },

    // 移除收藏
    removeFavorite(sentenceEn) {
        const favorites = this.getFavorites();
        const index = favorites.findIndex(f => f.en === sentenceEn);
        if (index > -1) {
            favorites.splice(index, 1);
            this.saveFavorites(favorites);
            return true;
        }
        return false;
    },

    // 检查是否已收藏
    isFavorite(sentenceEn) {
        const favorites = this.getFavorites();
        return favorites.some(f => f.en === sentenceEn);
    },

    // 获取学习历史
    getHistory() {
        try {
            const data = localStorage.getItem(this.KEYS.HISTORY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading history:', e);
            return [];
        }
    },

    // 添加学习记录
    addHistory(record) {
        const history = this.getHistory();
        history.unshift({
            ...record,
            timestamp: new Date().toISOString()
        });
        // 只保留最近100条记录
        if (history.length > 100) {
            history.pop();
        }
        try {
            localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
            return true;
        } catch (e) {
            console.error('Error saving history:', e);
            return false;
        }
    },

    // 获取打卡记录
    getCheckins() {
        try {
            const data = localStorage.getItem(this.KEYS.CHECKINS);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading checkins:', e);
            return {};
        }
    },

    // 添加打卡
    addCheckin(date = new Date().toDateString()) {
        const checkins = this.getCheckins();
        checkins[date] = true;
        try {
            localStorage.setItem(this.KEYS.CHECKINS, JSON.stringify(checkins));
            return true;
        } catch (e) {
            console.error('Error saving checkin:', e);
            return false;
        }
    },

    // 检查是否已打卡
    isCheckedIn(date = new Date().toDateString()) {
        const checkins = this.getCheckins();
        return !!checkins[date];
    },

    // 获取连续打卡天数
    getStreakDays() {
        const checkins = this.getCheckins();
        const dates = Object.keys(checkins).sort((a, b) => new Date(b) - new Date(a));
        
        if (dates.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        // 检查今天是否打卡，如果没有，从昨天开始计算
        const todayStr = currentDate.toDateString();
        if (!checkins[todayStr]) {
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        while (true) {
            const dateStr = currentDate.toDateString();
            if (checkins[dateStr]) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    },

    // 获取设置
    getSettings() {
        try {
            const data = localStorage.getItem(this.KEYS.SETTINGS);
            const defaultSettings = {
                accent: 'en-US',
                rate: 1,
                volume: 1,
                darkMode: false
            };
            return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
        } catch (e) {
            console.error('Error reading settings:', e);
            return {
                accent: 'en-US',
                rate: 1,
                volume: 1,
                darkMode: false
            };
        }
    },

    // 保存设置
    saveSettings(settings) {
        try {
            const current = this.getSettings();
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }));
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    },

    // 获取学习统计
    getStats() {
        try {
            const data = localStorage.getItem(this.KEYS.STATS);
            const defaultStats = {
                totalStudyTime: 0,  // 分钟
                totalSentences: 0,
                totalRecordings: 0,
                averageScore: 0
            };
            return data ? { ...defaultStats, ...JSON.parse(data) } : defaultStats;
        } catch (e) {
            console.error('Error reading stats:', e);
            return {
                totalStudyTime: 0,
                totalSentences: 0,
                totalRecordings: 0,
                averageScore: 0
            };
        }
    },

    // 更新统计
    updateStats(updates) {
        const stats = this.getStats();
        const newStats = { ...stats, ...updates };
        try {
            localStorage.setItem(this.KEYS.STATS, JSON.stringify(newStats));
            return newStats;
        } catch (e) {
            console.error('Error updating stats:', e);
            return stats;
        }
    },

    // 添加学习时长
    addStudyTime(minutes) {
        const stats = this.getStats();
        return this.updateStats({
            totalStudyTime: stats.totalStudyTime + minutes
        });
    },

    // 添加练习句子数
    addSentenceCount(count = 1) {
        const stats = this.getStats();
        return this.updateStats({
            totalSentences: stats.totalSentences + count
        });
    },

    // 获取显示模式
    getDisplayMode() {
        try {
            return localStorage.getItem(this.KEYS.DISPLAY_MODE) || 'note';
        } catch (e) {
            return 'note';
        }
    },

    // 保存显示模式
    saveDisplayMode(mode) {
        try {
            localStorage.setItem(this.KEYS.DISPLAY_MODE, mode);
            return true;
        } catch (e) {
            console.error('Error saving display mode:', e);
            return false;
        }
    },

    // 获取上次访问时间
    getLastVisit() {
        try {
            return localStorage.getItem(this.KEYS.LAST_VISIT);
        } catch (e) {
            return null;
        }
    },

    // 更新上次访问时间
    updateLastVisit() {
        try {
            localStorage.setItem(this.KEYS.LAST_VISIT, new Date().toISOString());
            return true;
        } catch (e) {
            return false;
        }
    },

    // 清除所有数据
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (e) {
            console.error('Error clearing data:', e);
            return false;
        }
    },

    // 导出数据
    exportData() {
        return {
            favorites: this.getFavorites(),
            history: this.getHistory(),
            checkins: this.getCheckins(),
            settings: this.getSettings(),
            stats: this.getStats(),
            exportTime: new Date().toISOString()
        };
    },

    // 导入数据
    importData(data) {
        try {
            if (data.favorites) this.saveFavorites(data.favorites);
            if (data.settings) this.saveSettings(data.settings);
            if (data.stats) {
                localStorage.setItem(this.KEYS.STATS, JSON.stringify(data.stats));
            }
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    }
};
