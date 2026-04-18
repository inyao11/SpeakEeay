const app = (function() {
    // ==========================================
    // 1. 前端内置语料库 (7天循环，每日半小时量)
    // ==========================================
    const SENTENCE_DB = [
        {
            topic: "职场会议与沟通",
            sentences: [
                { id: "d1-1", en: "Let's kick off the meeting by reviewing our quarterly goals.", zh: "让我们通过回顾季度目标来开始这次会议。" },
                { id: "d1-2", en: "Could you elaborate on that point for the rest of the team?", zh: "你能为团队其他成员详细说明一下那一点吗？" },
                { id: "d1-3", en: "We need to align our strategies before the product launch.", zh: "在产品发布前，我们需要统一我们的策略。" },
                { id: "d1-4", en: "I'll follow up with you on the budget details next week.", zh: "下周我会跟进并和你确认预算细节。" },
                { id: "d1-5", en: "Let's wrap up for today, thank you everyone for your input.", zh: "今天就到这里，感谢大家的宝贵意见。" }
            ]
        },
        {
            topic: "海外出行与机场",
            sentences: [
                { id: "d2-1", en: "I'd like to check in, please. Here is my passport and booking reference.", zh: "我要办理登机手续。这是我的护照和预订参考号。" },
                { id: "d2-2", en: "Could you tell me where the nearest baggage drop-off counter is?", zh: "你能告诉我最近的行李托运柜台在哪里吗？" },
                { id: "d2-3", en: "Is there any delay for the flight to New York?", zh: "飞往纽约的航班有延误吗？" },
                { id: "d2-4", en: "Excuse me, I seem to have lost my boarding pass.", zh: "打扰一下，我好像弄丢了我的登机牌。" },
                { id: "d2-5", en: "Do I need to declare these electronics at customs?", zh: "我需要在海关申报这些电子产品吗？" }
            ]
        },
        {
            topic: "日常社交与闲聊",
            sentences: [
                { id: "d3-1", en: "It's been a while! How have you been holding up lately?", zh: "好久不见！你最近过得怎么样？" },
                { id: "d3-2", en: "I'm currently tied up with some urgent projects at work.", zh: "我现在被工作上的一些紧急项目缠住了。" },
                { id: "d3-3", en: "That sounds absolutely fascinating, tell me more about it.", zh: "那听起来太棒了，再多给我讲讲。" },
                { id: "d3-4", en: "I completely agree with you on that matter.", zh: "在这个问题上我完全同意你的看法。" },
                { id: "d3-5", en: "Let's catch up over a cup of coffee sometime this weekend.", zh: "这个周末找个时间我们喝杯咖啡聚一聚吧。" }
            ]
        }
        // 由于篇幅限制展示前3天，实际运行时会在这几天中循环
    ];

    // 配置参数
    const GOALS = { time: 30, sentences: 5 }; // 目标：30分钟，完成5句话的跟读与录音
    const STORE_KEY = 'kouji_pro_data';
    
    // 状态管理
    let currentDate = getLocalDate();
    let currentData = {};
    let todayTopicData = null;
    let isPageActive = true;

    // ==========================================
    // 2. 核心初始化逻辑
    // ==========================================
    function init() {
        document.getElementById('current-date').innerText = currentDate;
        loadData();
        loadDailyContent(); // 加载今日题目
        startActiveTimeTracking(); // 监听学习时长
        monitorMidnightReset(); // 监听跨天
        setupVisibilityChange();
        updateUI();
        renderHistory();
    }

    // 获取格式化本地日期 (YYYY-MM-DD)
    function getLocalDate() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    }

    // 获取今日内容的索引 (基于时间戳的算法实现循环轮换)
    function getDailyContentIndex() {
        const daysSinceEpoch = Math.floor(Date.now() / 86400000);
        return daysSinceEpoch % SENTENCE_DB.length;
    }

    // ==========================================
    // 3. 数据存储与读取
    // ==========================================
    function loadData() {
        try {
            const raw = localStorage.getItem(STORE_KEY);
            currentData = raw ? JSON.parse(raw) : {};
            
            // 如果今天是全新的一天，初始化当天数据结构
            if (!currentData[currentDate]) {
                currentData[currentDate] = { 
                    time: 0,           // 学习时长(分钟)
                    checkedIn: false,  // 打卡状态
                    records: {}        // 记录每个句子的完成状态，例如: {"d1-1": {read: true, mark: false}}
                };
            }
        } catch (e) {
            showToast("本地数据读取失败，已重建数据。");
            currentData = { [currentDate]: { time: 0, checkedIn: false, records: {} } };
        }
    }

    function saveData() {
        localStorage.setItem(STORE_KEY, JSON.stringify(currentData));
    }

    // ==========================================
    // 4. 动态渲染今日语料
    // ==========================================
    function loadDailyContent() {
        const index = getDailyContentIndex();
        todayTopicData = SENTENCE_DB[index];
        document.getElementById('today-topic').innerText = todayTopicData.topic;
        
        const listContainer = document.getElementById('sentence-list');
        listContainer.innerHTML = ''; // 清空

        // 生成卡片
        todayTopicData.sentences.forEach(item => {
            // 获取该句子在本地的历史记录
            const sData = currentData[currentDate].records[item.id] || { read: false, mark: false };
            const isCompleted = sData.read;

            const card = document.createElement('div');
            card.className = `sentence-card ${isCompleted ? 'completed' : ''}`;
            card.id = `card-${item.id}`;
            card.innerHTML = `
                <div class="en-text">${item.en}</div>
                <div class="zh-text">${item.zh}</div>
                <div class="card-actions">
                    <button class="btn btn-primary" id="btn-read-${item.id}" onclick="app.action('${item.id}', 'read')" ${isCompleted ? 'disabled' : ''}>
                        ${isCompleted ? '✓ 已完成录音' : '🎙️ 跟我读 (模拟录音)'}
                    </button>
                    <button class="btn btn-outline ${sData.mark ? 'active' : ''}" id="btn-mark-${item.id}" onclick="app.action('${item.id}', 'mark')">
                        ${sData.mark ? '★ 已标记重点' : '☆ 标记重点'}
                    </button>
                </div>
            `;
            listContainer.appendChild(card);
        });
    }

    // 用户交互事件(跟读/标记)
    function action(sentenceId, type) {
        const todayData = currentData[currentDate];
        if (!todayData.records[sentenceId]) {
            todayData.records[sentenceId] = { read: false, mark: false };
        }

        if (type === 'read') {
            // 模拟录音与比对耗时过程
            showToast("正在采集语音比对，请稍候...");
            setTimeout(() => {
                todayData.records[sentenceId].read = true;
                saveData();
                updateUI();
                checkGoals();
                // 更新单张卡片UI
                const card = document.getElementById(`card-${sentenceId}`);
                card.classList.add('completed');
                const btn = document.getElementById(`btn-read-${sentenceId}`);
                btn.innerText = '✓ 已完成录音';
                btn.disabled = true;
                showToast("✅ 录音比对成功，正确率 95%");
            }, 1000);
        } else if (type === 'mark') {
            const isMarked = todayData.records[sentenceId].mark;
            todayData.records[sentenceId].mark = !isMarked;
            saveData();
            // 更新按钮样式
            const btn = document.getElementById(`btn-mark-${sentenceId}`);
            btn.className = `btn btn-outline ${!isMarked ? 'active' : ''}`;
            btn.innerText = !isMarked ? '★ 已标记重点' : '☆ 标记重点';
        }
    }

    // ==========================================
    // 5. 数据面板与打卡更新
    // ==========================================
    function updateUI() {
        const todayData = currentData[currentDate];
        
        // 统计完成了几个句子
        let completedCount = Object.values(todayData.records).filter(r => r.read).length;

        // 更新数字
        document.getElementById('val-time').innerText = todayData.time;
        document.getElementById('val-read').innerText = completedCount;

        // 进度条平滑动画
        const timePerc = Math.min((todayData.time / GOALS.time) * 100, 100);
        const readPerc = Math.min((completedCount / GOALS.sentences) * 100, 100);
        document.getElementById('prog-time').style.width = `${timePerc}%`;
        document.getElementById('prog-read').style.width = `${readPerc}%`;

        // 打卡状态
        const badge = document.getElementById('checkin-status');
        if (todayData.checkedIn) {
            badge.innerText = "已达成今日目标 🎉";
            badge.className = "badge success";
        }
    }

    function checkGoals() {
        const todayData = currentData[currentDate];
        let completedCount = Object.values(todayData.records).filter(r => r.read).length;
        
        if (!todayData.checkedIn && completedCount >= GOALS.sentences) {
            todayData.checkedIn = true; // 只要完成了5个句子就算打卡成功，时间作为辅助指标
            saveData();
            updateUI();
            renderHistory(); // 刷新历史区状态
            showToast("🎉 恭喜！今日跟读录音任务已全额达标！");
        }
    }

    // ==========================================
    // 6. 自动化学习时长监测
    // ==========================================
    function startActiveTimeTracking() {
        setInterval(() => {
            if (isPageActive) {
                currentData[currentDate].time += 1;
                saveData();
                updateUI();
                // 这里可选: 如果时间达到30分钟也给提示
            }
        }, 60000); // 1分钟加1
    }

    function setupVisibilityChange() {
        document.addEventListener("visibilitychange", () => {
            isPageActive = document.visibilityState === 'visible';
            if (!isPageActive) saveData(); // 离开页面立即存档
        });
    }

    function monitorMidnightReset() {
        setInterval(() => {
            const newDate = getLocalDate();
            if (newDate !== currentDate) {
                currentDate = newDate;
                init(); // 自动刷新进入新的一天
                showToast("已跨入新的一天，为你更新今日语料");
            }
        }, 60000);
    }

    // ==========================================
    // 7. 历史轨迹渲染模块
    // ==========================================
    function renderHistory() {
        const histContainer = document.getElementById('history-list');
        histContainer.innerHTML = '';
        
        // 获取所有日期并倒序排列（最近的在上面）
        const dates = Object.keys(currentData).sort((a, b) => new Date(b) - new Date(a));
        
        dates.forEach(date => {
            const data = currentData[date];
            const count = Object.values(data.records).filter(r => r.read).length;
            
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div>
                    <div class="hist-date">${date === currentDate ? '今日' : date}</div>
                    <div class="hist-stats">练时: ${data.time}min | 完成句子: ${count}</div>
                </div>
                <div class="hist-status ${data.checkedIn ? 'done' : ''}">
                    ${data.checkedIn ? '已达标' : '未达标'}
                </div>
            `;
            histContainer.appendChild(div);
        });
    }

    // 导出备份
    function exportData() {
        const dataStr = JSON.stringify(currentData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kouji_history_${currentDate}.json`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    }

    // Toast 提示
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    window.addEventListener('DOMContentLoaded', init);

    return { action, exportData };
})();