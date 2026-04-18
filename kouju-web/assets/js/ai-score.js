/**
 * AI Score Module - AI 评分功能
 * 前端智能评分算法，评估发音准确度、流利度和重音节奏
 */

const AIScore = {
    /**
     * 计算两个字符串的相似度（编辑距离算法）
     * @param {string} str1 - 原始文本
     * @param {string} str2 - 识别文本
     * @returns {number} - 相似度 0-1
     */
    calculateSimilarity(str1, str2) {
        const s1 = str1.toLowerCase().trim();
        const s2 = str2.toLowerCase().trim();
        
        if (s1 === s2) return 1;
        if (s1.length === 0 || s2.length === 0) return 0;
        
        // 计算编辑距离
        const matrix = [];
        for (let i = 0; i <= s2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= s1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= s2.length; i++) {
            for (let j = 1; j <= s1.length; j++) {
                if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        const distance = matrix[s2.length][s1.length];
        const maxLength = Math.max(s1.length, s2.length);
        return 1 - distance / maxLength;
    },

    /**
     * 评估单词级别的准确度
     * @param {string} original - 原始句子
     * @param {string} spoken - 识别的句子
     * @returns {number} - 准确度 0-100
     */
    evaluatePronunciation(original, spoken) {
        const origWords = original.toLowerCase().trim().split(/\s+/);
        const spokenWords = spoken.toLowerCase().trim().split(/\s+/);
        
        let matchedWords = 0;
        let totalWords = origWords.length;
        
        // 使用简单的词匹配
        const spokenSet = new Set(spokenWords);
        origWords.forEach(word => {
            // 移除标点
            const cleanWord = word.replace(/[^a-z]/g, '');
            if (spokenSet.has(cleanWord) || spokenWords.some(sw => sw.includes(cleanWord) || cleanWord.includes(sw))) {
                matchedWords++;
            }
        });
        
        return Math.round((matchedWords / totalWords) * 100);
    },

    /**
     * 评估流利度（基于语速和停顿）
     * @param {string} text - 识别的文本
     * @param {number} duration - 录音时长（毫秒）
     * @returns {number} - 流利度 0-100
     */
    evaluateFluency(text, duration) {
        const words = text.trim().split(/\s+/).length;
        const durationSeconds = duration / 1000;
        
        if (durationSeconds === 0) return 0;
        
        // 计算语速（词/分钟）
        const wpm = (words / durationSeconds) * 60;
        
        // 理想语速：120-160 WPM
        let fluencyScore;
        if (wpm >= 120 && wpm <= 160) {
            fluencyScore = 100;
        } else if (wpm < 120) {
            fluencyScore = 60 + (wpm / 120) * 40;
        } else {
            fluencyScore = Math.max(40, 100 - (wpm - 160) / 2);
        }
        
        return Math.round(fluencyScore);
    },

    /**
     * 评估重音和节奏
     * @param {string} original - 原始句子
     * @param {string} spoken - 识别的句子
     * @param {number} duration - 录音时长
     * @returns {number} - 节奏分数 0-100
     */
    evaluateRhythm(original, spoken, duration) {
        const origWords = original.trim().split(/\s+/).length;
        const spokenWords = spoken.trim().split(/\s+/).length;
        
        // 基于词数匹配度评估
        const wordMatchRatio = Math.min(spokenWords, origWords) / Math.max(spokenWords, origWords);
        
        // 基于时长的评估（假设每个词平均0.4秒）
        const expectedDuration = origWords * 0.4 * 1000; // 毫秒
        const durationRatio = Math.min(duration, expectedDuration) / Math.max(duration, expectedDuration);
        
        // 综合评分
        const rhythmScore = (wordMatchRatio * 0.6 + durationRatio * 0.4) * 100;
        
        return Math.round(rhythmScore);
    },

    /**
     * 综合评分
     * @param {string} original - 原始句子
     * @param {string} spoken - 识别的句子
     * @param {number} duration - 录音时长（毫秒）
     * @returns {Object} - 详细评分结果
     */
    calculateScore(original, spoken, duration) {
        if (!spoken || spoken.trim().length === 0) {
            return {
                total: 0,
                pronunciation: 0,
                fluency: 0,
                rhythm: 0,
                feedback: '未能识别到语音，请重试'
            };
        }

        const pronunciation = this.evaluatePronunciation(original, spoken);
        const fluency = this.evaluateFluency(spoken, duration);
        const rhythm = this.evaluateRhythm(original, spoken, duration);
        
        // 综合总分（加权平均）
        const total = Math.round(pronunciation * 0.5 + fluency * 0.3 + rhythm * 0.2);
        
        // 生成反馈
        let feedback = '';
        if (total >= 90) {
            feedback = 'Excellent! 发音非常标准！';
        } else if (total >= 80) {
            feedback = 'Great job! 发音很好，继续保持！';
        } else if (total >= 70) {
            feedback = 'Good! 整体不错，还有提升空间。';
        } else if (total >= 60) {
            feedback = 'Not bad! 建议多听多练。';
        } else {
            feedback = 'Keep practicing! 继续加油，多练习会更好！';
        }

        return {
            total,
            pronunciation,
            fluency,
            rhythm,
            feedback
        };
    },

    /**
     * 获取改进建议
     * @param {Object} scores - 评分结果
     * @returns {string[]} - 建议列表
     */
    getSuggestions(scores) {
        const suggestions = [];
        
        if (scores.pronunciation < 70) {
            suggestions.push('建议放慢语速，注意每个单词的发音');
        }
        if (scores.fluency < 70) {
            suggestions.push('可以尝试更连贯地朗读，减少停顿');
        }
        if (scores.rhythm < 70) {
            suggestions.push('注意句子的重音和节奏感');
        }
        if (suggestions.length === 0) {
            suggestions.push('表现很好！尝试挑战更难的句子吧');
        }
        
        return suggestions;
    }
};
