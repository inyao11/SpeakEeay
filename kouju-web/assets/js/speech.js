/**
 * Speech Module - 语音功能
 * 使用 Web Speech API 实现朗读和语音识别功能，支持录音回放和连续播放
 */

const Speech = {
    // 语音合成实例
    synthesis: window.speechSynthesis,
    
    // 语音识别实例
    recognition: null,
    
    // 是否正在录音
    isRecording: false,
    
    // 是否正在连续播放
    isPlayingAll: false,
    
    // 录音相关
    mediaRecorder: null,
    recordedChunks: [],
    recordedBlob: null,
    recordedUrl: null,
    
    // 录音历史列表
    recordingHistory: [],
    
    // 录音回调
    onResultCallback: null,
    onErrorCallback: null,
    onRecordingCompleteCallback: null,

    // 初始化
    init() {
        // 初始化语音识别
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (this.onResultCallback) {
                    this.onResultCallback(transcript);
                }
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (this.onErrorCallback) {
                    this.onErrorCallback(event.error);
                }
            };
            
            this.recognition.onend = () => {
                // 语音识别结束
            };
        }
    },

    // 朗读文本
    speak(text, options = {}) {
        if (!this.synthesis) {
            console.error('Speech synthesis not supported');
            return false;
        }

        // 取消之前的朗读
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const settings = Storage.getSettings();
        
        utterance.lang = options.accent || settings.accent || 'en-US';
        utterance.rate = options.rate || settings.rate || 1;
        utterance.volume = options.volume || settings.volume || 1;
        utterance.pitch = options.pitch || 1;

        // 尝试选择更好的语音
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(voice => {
            if (utterance.lang === 'en-GB') {
                return voice.lang.includes('en-GB') || voice.name.includes('British');
            }
            return voice.lang.includes('en-US') || voice.name.includes('US');
        });
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        this.synthesis.speak(utterance);
        return true;
    },
    
    // 朗读文本并返回 Promise（用于连续播放）
    speakAsync(text, options = {}) {
        return new Promise((resolve) => {
            if (!this.synthesis) {
                console.error('Speech synthesis not supported');
                resolve();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            const settings = Storage.getSettings();
            
            utterance.lang = options.accent || settings.accent || 'en-US';
            utterance.rate = options.rate || settings.rate || 1;
            utterance.volume = options.volume || settings.volume || 1;
            utterance.pitch = options.pitch || 1;

            // 尝试选择更好的语音
            const voices = this.synthesis.getVoices();
            const preferredVoice = voices.find(voice => {
                if (utterance.lang === 'en-GB') {
                    return voice.lang.includes('en-GB') || voice.name.includes('British');
                }
                return voice.lang.includes('en-US') || voice.name.includes('US');
            });
            
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            // 朗读结束回调
            utterance.onend = () => {
                resolve();
            };
            
            // 朗读错误回调
            utterance.onerror = () => {
                resolve();
            };

            this.synthesis.speak(utterance);
        });
    },
    
    // 连续播放所有句子
    async playAllLines(lines, onLineStart, onComplete) {
        if (this.isPlayingAll) {
            this.stopAll();
            return;
        }
        
        this.isPlayingAll = true;
        
        for (let i = 0; i < lines.length; i++) {
            if (!this.isPlayingAll) break;
            
            if (onLineStart) {
                onLineStart(i);
            }
            
            await this.speakAsync(lines[i]);
            
            // 句子间停顿 500ms
            if (this.isPlayingAll && i < lines.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        this.isPlayingAll = false;
        
        if (onComplete) {
            onComplete();
        }
    },
    
    // 停止连续播放
    stopAll() {
        this.isPlayingAll = false;
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    },

    // 停止朗读
    stop() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    },

    // 暂停朗读
    pause() {
        if (this.synthesis) {
            this.synthesis.pause();
        }
    },

    // 恢复朗读
    resume() {
        if (this.synthesis) {
            this.synthesis.resume();
        }
    },

    // 检查是否支持语音识别
    isRecognitionSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    },

    // 检查是否支持媒体录音
    isMediaRecordingSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },

    // 开始录音（语音 + 音频）
    async startRecording(onResult, onError) {
        this.onResultCallback = onResult;
        this.onErrorCallback = onError;
        
        // 清除之前的录音
        this.clearRecording();
        
        // 开始语音识别
        if (this.recognition) {
            const settings = Storage.getSettings();
            this.recognition.lang = settings.accent || 'en-US';
            
            try {
                this.recognition.start();
            } catch (e) {
                console.error('Error starting speech recognition:', e);
            }
        }
        
        // 开始音频录制
        if (this.isMediaRecordingSupported()) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.recordedChunks = [];
                
                this.mediaRecorder = new MediaRecorder(stream);
                
                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.recordedChunks.push(event.data);
                    }
                };
                
                this.mediaRecorder.onstop = () => {
                    this.recordedBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                    this.recordedUrl = URL.createObjectURL(this.recordedBlob);
                    
                    // 停止所有轨道
                    stream.getTracks().forEach(track => track.stop());
                };
                
                this.mediaRecorder.start();
                this.isRecording = true;
                return true;
            } catch (e) {
                console.error('Error starting media recording:', e);
                if (onError) onError('无法访问麦克风');
                return false;
            }
        } else {
            // 不支持媒体录制，只使用语音识别
            this.isRecording = true;
            return true;
        }
    },

    // 停止录音 - 返回 Promise，确保录音数据已准备好
    stopRecording() {
        return new Promise((resolve) => {
            let recognitionStopped = false;
            let recorderStopped = false;
            
            const checkComplete = () => {
                if (recognitionStopped && recorderStopped) {
                    // 给一点时间让 blob 生成
                    setTimeout(() => {
                        this.isRecording = false;
                        resolve(this.recordedUrl);
                    }, 100);
                }
            };
            
            // 停止语音识别
            if (this.recognition) {
                try {
                    this.recognition.stop();
                } catch (e) {
                    // 忽略错误
                }
                recognitionStopped = true;
            } else {
                recognitionStopped = true;
            }
            
            // 停止音频录制
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.onstop = () => {
                    this.recordedBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                    this.recordedUrl = URL.createObjectURL(this.recordedBlob);
                    recorderStopped = true;
                    checkComplete();
                };
                this.mediaRecorder.stop();
            } else {
                recorderStopped = true;
            }
            
            checkComplete();
        });
    },

    // 播放录音
    playRecording(url) {
        const recordingUrl = url || this.recordedUrl;
        if (!recordingUrl) {
            console.error('No recording available');
            return false;
        }
        
        const audio = new Audio(recordingUrl);
        audio.play();
        return true;
    },

    // 获取录音 URL
    getRecordingUrl() {
        return this.recordedUrl;
    },

    // 清除当前录音
    clearRecording() {
        if (this.recordedUrl) {
            URL.revokeObjectURL(this.recordedUrl);
            this.recordedUrl = null;
        }
        this.recordedBlob = null;
        this.recordedChunks = [];
    },
    
    // 添加录音到历史
    addRecordingToHistory(lineText, url, score) {
        const recording = {
            id: Date.now(),
            lineText: lineText,
            url: url,
            score: score,
            timestamp: new Date().toISOString()
        };
        this.recordingHistory.unshift(recording);
        // 最多保留 20 条录音
        if (this.recordingHistory.length > 20) {
            const oldRecording = this.recordingHistory.pop();
            if (oldRecording.url) {
                URL.revokeObjectURL(oldRecording.url);
            }
        }
        return recording;
    },
    
    // 获取录音历史
    getRecordingHistory() {
        return this.recordingHistory;
    },
    
    // 删除录音
    deleteRecording(id) {
        const index = this.recordingHistory.findIndex(r => r.id === id);
        if (index > -1) {
            const recording = this.recordingHistory[index];
            if (recording.url) {
                URL.revokeObjectURL(recording.url);
            }
            this.recordingHistory.splice(index, 1);
            return true;
        }
        return false;
    },
    
    // 清空录音历史
    clearRecordingHistory() {
        this.recordingHistory.forEach(recording => {
            if (recording.url) {
                URL.revokeObjectURL(recording.url);
            }
        });
        this.recordingHistory = [];
    },

    // 获取可用语音列表
    getVoices() {
        if (!this.synthesis) return [];
        return this.synthesis.getVoices();
    },

    // 预加载语音
    preloadVoices() {
        if (!this.synthesis) return;
        
        // 某些浏览器需要等待 voiceschanged 事件
        if (this.synthesis.getVoices().length === 0) {
            this.synthesis.onvoiceschanged = () => {
                this.synthesis.getVoices();
            };
        }
    }
};

// 初始化语音
Speech.init();
Speech.preloadVoices();
