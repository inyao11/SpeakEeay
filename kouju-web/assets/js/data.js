/**
 * Data Module - 数据管理
 * 管理情景对话数据，支持本地数据和联网获取
 */

const Data = {
    // 场景列表
    scenes: [
        { id: 'greeting', name: '日常问候', icon: 'fa-handshake', desc: '见面打招呼、介绍自己' },
        { id: 'airport', name: '机场出行', icon: 'fa-plane', desc: '办理登机、行李、安检' },
        { id: 'restaurant', name: '餐厅点餐', icon: 'fa-utensils', desc: '预订座位、点餐、结账' },
        { id: 'shopping', name: '购物砍价', icon: 'fa-shopping-bag', desc: '询问价格、试穿、付款' },
        { id: 'workplace', name: '职场沟通', icon: 'fa-briefcase', desc: '会议安排、工作汇报' },
        { id: 'campus', name: '校园交流', icon: 'fa-graduation-cap', desc: '借笔记、讨论作业' },
        { id: 'hobby', name: '兴趣爱好', icon: 'fa-palette', desc: '谈论爱好、邀请活动' },
        { id: 'health', name: '健康医疗', icon: 'fa-heartbeat', desc: '预约挂号、描述症状' }
    ],

    // 缓存的联网对话
    onlineConversations: [],
    lastFetchDate: null,

    // 基础对话数据
    baseConversations: {
        greeting: [
            {
                title: "初次见面",
                dialogues: [
                    { speaker: "A", en: "Hi there! I don't think we've met before. I'm Sarah.", zh: "你好！我想我们以前没见过。我是莎拉。", note: "初次见面自我介绍", phonetic: "/haɪ ðer/ /aɪ doʊnt θɪŋk wiv met bɪˈfɔːr/ /aɪm ˈserə/" },
                    { speaker: "B", en: "Nice to meet you, Sarah! I'm Mike. I just started working here yesterday.", zh: "很高兴认识你，莎拉！我是迈克。我昨天刚开始在这里工作。", note: "回应并介绍自己", phonetic: "/naɪs tuː miːt juː ˈserə/ /aɪm maɪk/ /aɪ dʒʌst stɑːrtɪd ˈwɜːrkɪŋ hɪər ˈjestərdeɪ/" },
                    { speaker: "A", en: "Oh, welcome to the team! Where are you from originally?", zh: "哦，欢迎加入团队！你 originally 是哪里人？", note: "表示欢迎并询问背景", phonetic: "/oʊ ˈwelkəm tuː ðə tiːm/ /wer ɑːr juː frʌm əˈrɪdʒənəli/" },
                    { speaker: "B", en: "I'm from Chicago. How about you? Have you been here long?", zh: "我来自芝加哥。你呢？你在这里很久了吗？", note: "回答并反问", phonetic: "/aɪm frʌm ʃɪˈkɑːɡoʊ/ /haʊ əˈbaʊt juː/ /hæv juː biːn hɪər lɔːŋ/" },
                    { speaker: "A", en: "I've been here for about two years. Let me know if you need any help getting settled!", zh: "我在这里大约两年了。如果你需要任何帮助安顿下来，请告诉我！", note: "提供帮助", phonetic: "/aɪv biːn hɪər fɔːr əˈbaʊt tuː jɪərz/ /let miː noʊ ɪf juː niːd ˈeni help ˈɡetɪŋ ˈsetld/" }
                ]
            },
            {
                title: "久别重逢",
                dialogues: [
                    { speaker: "A", en: "Oh my god, David? Is that really you?", zh: "天哪，大卫？真的是你吗？", note: "惊讶地认出对方", phonetic: "/oʊ maɪ ɡɑːd ˈdeɪvɪd/ /ɪz ðæt ˈriːəli juː/" },
                    { speaker: "B", en: "Lisa! Wow, I haven't seen you in ages! How have you been?", zh: "丽莎！哇，我好久没见到你了！你过得怎么样？", note: "久别重逢的问候", phonetic: "/ˈliːsə/ /waʊ/ /aɪ ˈhævnt siːn juː ɪn ˈeɪdʒɪz/ /haʊ hæv juː biːn/" },
                    { speaker: "A", en: "I've been great! Just got back from studying abroad in London. What about you?", zh: "我过得很好！刚从伦敦留学回来。你呢？", note: "分享近况", phonetic: "/aɪv biːn ɡreɪt/ /dʒʌst ɡɑːt bæk frʌm ˈstʌdiɪŋ əˈbrɔːd ɪn ˈlʌndən/ /wɑːt əˈbaʊt juː/" },
                    { speaker: "B", en: "That's amazing! I've been working at a tech company downtown. We should catch up over coffee sometime!", zh: "太棒了！我一直在市中心的一家科技公司工作。我们应该找个时间喝咖啡叙叙旧！", note: "提议继续保持联系", phonetic: "/ðæts əˈmeɪzɪŋ/ /aɪv biːn ˈwɜːrkɪŋ æt ə tek ˈkʌmpəni ˈdaʊntaʊn/ /wiː ʃʊd kætʃ ʌp ˈoʊvər ˈkɔːfi ˈsʌmtaɪm/" }
                ]
            },
            {
                title: "自我介绍",
                dialogues: [
                    { speaker: "A", en: "Hello! I'm new here. My name is Tom Wilson.", zh: "你好！我是新来的。我叫汤姆·威尔逊。", note: "自我介绍", phonetic: "/həˈloʊ/ /aɪm nuː hɪər/ /maɪ neɪm ɪz tɒm ˈwɪlsən/" },
                    { speaker: "B", en: "Hi Tom! Welcome! I'm Jennifer, but everyone calls me Jen.", zh: "嗨汤姆！欢迎！我是珍妮弗，但大家都叫我珍。", note: "回应并介绍", phonetic: "/haɪ tɒm/ /ˈwelkəm/ /aɪm ˈdʒenɪfər/ /bʌt ˈevriwʌn kɔːlz miː dʒen/" },
                    { speaker: "A", en: "Nice to meet you, Jen! What do you do here?", zh: "很高兴认识你，珍！你在这里做什么工作？", note: "询问职业", phonetic: "/naɪs tuː miːt juː dʒen/ /wɑːt duː juː duː hɪər/" },
                    { speaker: "B", en: "I'm a product designer. How about you? What brings you here?", zh: "我是产品设计师。你呢？是什么让你来这里？", note: "回答并反问", phonetic: "/aɪm ə ˈprɒdʌkt dɪˈzaɪnər/ /haʊ əˈbaʊt juː/ /wɑːt brɪŋz juː hɪər/" },
                    { speaker: "A", en: "I just joined the engineering team. This is my first day!", zh: "我刚加入工程团队。这是我的第一天！", note: "说明情况", phonetic: "/aɪ dʒʌst dʒoɪnd ðə ˌendʒɪˈnɪərɪŋ tiːm/ /ðɪs ɪz maɪ fɜːrst deɪ/" }
                ]
            },
            {
                title: "机场接人",
                dialogues: [
                    { speaker: "A", en: "Excuse me, are you here to pick up someone from the flight?", zh: "打扰一下，你是来接航班上的人的吗？", note: "询问", phonetic: "/ɪkˈskjuːz miː/ /ɑːr juː hɪər tuː pɪk ʌp ˈsʌmwʌn frʌm ðə flaɪt/" },
                    { speaker: "B", en: "Yes, I'm waiting for my brother. His flight was from New York.", zh: "是的，我在等我哥哥。他的航班是从纽约来的。", note: "确认", phonetic: "/jes/ /aɪm ˈweɪtɪŋ fɔːr maɪ ˈbrʌðər/ /hɪz flaɪt wɒz frʌm njuː jɔːrk/" },
                    { speaker: "A", en: "The flight from New York just landed. It should be arriving at Gate 12.", zh: "从纽约来的航班刚降落。应该会在12号登机口到达。", note: "提供信息", phonetic: "/ðə flaɪt frʌm njuː jɔːrk dʒʌst ˈlændɪd/ /ɪt ʃʊd biː əˈraɪvɪŋ æt ɡeɪt twelv/" }
                ]
            },
            {
                title: "邻居相识",
                dialogues: [
                    { speaker: "A", en: "Hi! I just moved in next door. I'm Alex.", zh: "嗨！我刚搬到你隔壁。我是亚历克斯。", note: "新邻居自我介绍", phonetic: "/haɪ/ /aɪ dʒʌst muːvd ɪn nekst dɔːr/ /aɪm ˈælɪks/" },
                    { speaker: "B", en: "Oh, welcome! I'm Maria. How do you like the neighborhood so far?", zh: "哦，欢迎！我是玛利亚。你到目前为止喜欢这个社区吗？", note: "邻居问候", phonetic: "/oʊ ˈwelkəm/ /aɪm məˈriːə/ /haʊ duː juː laɪk ðə ˈneɪbərhʊd soʊ fɑːr/" },
                    { speaker: "A", en: "It's really quiet and peaceful. I think I'll like it here.", zh: "真的很安静祥和。我想我会喜欢这里的。", note: "表达感受", phonetic: "/ɪts ˈriːəli ˈkwaɪət ænd ˈpiːsfəl/ /aɪ θɪŋk aɪl laɪk ɪt hɪər/" }
                ]
            },
            {
                title: "课堂讨论",
                dialogues: [
                    { speaker: "A", en: "Did you understand what the professor said about climate change?", zh: "你听懂教授说的气候变化了吗？", note: "讨论课堂内容", phonetic: "/dɪd juː ˌʌndəˈstænd wɒt ðə prəˈfesər sed əˈbaʊt ˈklaɪmɪt tʃeɪndʒ/" },
                    { speaker: "B", en: "Kind of. The impact on agriculture was interesting. What did you think?", zh: "部分懂吧。农业方面的影响很有趣。你怎么看？", note: "回应并询问", phonetic: "/kaɪnd əv/ /ðiː ˈɪmpækt ɒn ˈæɡrɪkʌltʃər wɒz ˈɪntrəstɪŋ/ /wɑːt dɪd juː θɪŋk/" },
                    { speaker: "A", en: "I thought the part about rising sea levels was concerning. We should do more research.", zh: "我觉得关于海平面上升的部分令人担忧。我们应该做更多研究。", note: "分享观点", phonetic: "/aɪ θɔːt ðə pɑːt əˈbaʊt ˈraɪzɪŋ siː ˈlevlz wɒz kənˈsɜːrnɪŋ/ /wiː ʃʊd duː mɔːr rɪˈsɜːrtʃ/" }
                ]
            }
        ],
        airport: [
            {
                title: "办理登机",
                dialogues: [
                    { speaker: "A", en: "Good morning. I'd like to check in for flight BA249 to Paris, please.", zh: "早上好。我想办理飞往巴黎的BA249航班登机手续。", note: "办理登机", phonetic: "/ɡʊd ˈmɔːrnɪŋ/ /aɪd laɪk tuː tʃek ɪn fɔːr flaɪt biː eɪ tuː fɔːr ˈnaɪn tuː ˈpærɪs/ /pliːz/" },
                    { speaker: "B", en: "Certainly, ma'am. May I see your passport and ticket, please?", zh: "当然可以，女士。请出示您的护照和机票好吗？", note: "要求出示证件", phonetic: "/ˈsɜːrtnli mæm/ /meɪ aɪ siː jɔːr ˈpæspɔːrt ænd ˈtɪkɪt/ /pliːz/" },
                    { speaker: "A", en: "Here you go. And I have one checked bag.", zh: "给您。我有一件托运行李。", note: "递交证件并说明行李", phonetic: "/hɪər juː ɡoʊ/ /ænd aɪ hæv wʌn tʃekt bæɡ/" },
                    { speaker: "B", en: "Thank you. Please place your bag on the scale. Hmm, it's slightly overweight. You'll need to pay an excess baggage fee of $50.", zh: "谢谢。请把您的行李放在秤上。嗯，稍微超重了。您需要支付50美元的超重行李费。", note: "告知超重", phonetic: "/θæŋk juː/ /pliːz pleɪs jɔːr bæɡ ɑːn ðə skeɪl/ /ɪts ˈslaɪtli ˌoʊvərˈweɪt/ /juːl niːd tuː peɪ ən ɪkˈses ˈbæɡɪdʒ fiː əv ˈfɪfti ˈdɑːlərz/" },
                    { speaker: "A", en: "Oh, I see. Can I pay by credit card?", zh: "哦，我明白了。可以用信用卡支付吗？", note: "询问支付方式", phonetic: "/oʊ aɪ siː/ /kæn aɪ peɪ baɪ ˈkredɪt kɑːrd/" },
                    { speaker: "B", en: "Yes, of course. Here's your boarding pass. Your flight departs from Gate 23 at 10:30 AM. Have a pleasant flight!", zh: "是的，当然可以。这是您的登机牌。您的航班上午10:30从23号登机口起飞。祝您旅途愉快！", note: "完成手续并告知信息", phonetic: "/jes əv ˈkɔːrs/ /hɪərz jɔːr ˈbɔːrdɪŋ pæs/ /jɔːr flaɪt dɪˈpɑːrts frʌm ɡeɪt twenti θriː æt ten ˈθɜːrti eɪ em/ /hæv ə ˈpleznt flaɪt/" }
                ]
            },
            {
                title: "海关检查",
                dialogues: [
                    { speaker: "A", en: "Good afternoon. Welcome to the United States. May I see your passport and customs declaration form, please?", zh: "下午好。欢迎来到美国。请出示您的护照和海关申报单好吗？", note: "海关检查", phonetic: "/ɡʊd ˌæftərˈnuːn/ /ˈwelkəm tuː ðə juːˈnaɪtɪd steɪts/ /meɪ aɪ siː jɔːr ˈpæspɔːrt ænd ˈkʌstəmz ˌdekləˈreɪʃən fɔːrm/ /pliːz/" },
                    { speaker: "B", en: "Here you go. I'm here for a business conference.", zh: "给您。我来这里参加一个商业会议。", note: "递交证件并说明目的", phonetic: "/hɪər juː ɡoʊ/ /aɪm hɪər fɔːr ə ˈbɪznəs ˈkɒnfərəns/" },
                    { speaker: "A", en: "How long do you plan to stay in the country?", zh: "您计划在该国停留多长时间？", note: "询问停留时间", phonetic: "/haʊ lɒŋ duː juː plæn tuː steɪ ɪn ðə ˈkʌntri/" },
                    { speaker: "B", en: "About two weeks. I'll be attending meetings in New York and Los Angeles.", zh: "大约两周。我将在纽约和洛杉矶参加会议。", note: "说明行程", phonetic: "/əˈbaʊt tuː wiːks/ /aɪl biː əˈtendɪŋ ˈmiːtɪŋz ɪn njuː jɔːrk ænd lɒs ˈændʒələs/" }
                ]
            },
            {
                title: "行李丢失",
                dialogues: [
                    { speaker: "A", en: "Excuse me, I believe my luggage didn't arrive with my flight.", zh: "打扰一下，我相信我的行李没有随我的航班到达。", note: "报告行李丢失", phonetic: "/ɪkˈskjuːz miː/ /aɪ bɪˈliːv maɪ ˈlʌɡɪdʒ dɪdnt əˈraɪv wɪð maɪ flaɪt/" },
                    { speaker: "B", en: "I'm sorry to hear that. Can I have your baggage claim tag and flight number?", zh: "很抱歉听到这个消息。请给我您的行李牌和航班号好吗？", note: "询问信息", phonetic: "/aɪm ˈsɒri tuː hɪər ðæt/ /kæn aɪ hæv jɔːr ˈbæɡɪdʒ kleɪm tæɡ ænd flaɪt ˈnʌmbər/" },
                    { speaker: "A", en: "My flight was BA249 from London, and the tag number is LP78234.", zh: "我的航班是从伦敦来的BA249，标签号是LP78234。", note: "提供信息", phonetic: "/maɪ flaɪt wɒz biː eɪ tuː fɔːr naɪn frʌm ˈlʌndən/ /ænd ðə tæɡ ˈnʌmbər ɪz el piː seven eɪt tuː θriː fɔːr/" },
                    { speaker: "B", en: "Let me check our system. It seems your baggage was loaded onto the wrong connecting flight. We'll deliver it to your hotel once it's located.", zh: "让我检查一下我们的系统。您的行李似乎被装上了错误的转机航班。一旦找到，我们会把它送到您的酒店。", note: "解释情况并提供解决方案", phonetic: "/let miː tʃek ˈaʊər ˈsɪstəm/ /ɪt siːmz jɔːr ˈbæɡɪdʒ wɒz ˈloʊdɪd ˈɒntuː ðə rɒŋ kəˈnektɪŋ flaɪt/ /wiːl dɪˈlɪvər ɪt tuː jɔːr hoʊˈtel wʌns ɪts ˈloʊkeɪtɪd/" }
                ]
            }
        ],
        restaurant: [
            {
                title: "预订座位",
                dialogues: [
                    { speaker: "A", en: "Hi, I'd like to make a reservation for dinner tonight.", zh: "你好，我想预订今晚的晚餐。", note: "预订请求", phonetic: "/haɪ/ /aɪd laɪk tuː meɪk ə ˌrezərˈveɪʃən fɔːr ˈdɪnər təˈnaɪt/" },
                    { speaker: "B", en: "Of course. For how many people and what time?", zh: "当然可以。几位客人，几点？", note: "询问详情", phonetic: "/əv ˈkɔːrs/ /fɔːr haʊ ˈmeni ˈpiːpl ænd wɑːt taɪm/" },
                    { speaker: "A", en: "Table for four, around 7:30 PM. And could we get a table by the window?", zh: "四人桌，晚上7:30左右。我们可以要一张靠窗的桌子吗？", note: "说明要求", phonetic: "/ˈteɪbl fɔːr fɔːr/ /əˈraʊnd ˈsevən ˈθɜːrti piː em/ /ænd kʊd wiː ɡet ə ˈteɪbl baɪ ðə ˈwɪndoʊ/" },
                    { speaker: "B", en: "Let me check... Yes, we have a window table available at 7:30. May I have your name and phone number?", zh: "让我查一下... 是的，我们7:30有靠窗的桌子。请问您的姓名和电话号码？", note: "确认并记录信息", phonetic: "/let miː tʃek/ /jes wiː hæv ə ˈwɪndoʊ ˈteɪbl əˈveɪləbl æt ˈsevən ˈθɜːrti/ /meɪ aɪ hæv jɔːr neɪm ænd foʊn ˈnʌmbər/" },
                    { speaker: "A", en: "It's Johnson, and my number is 555-0123.", zh: "约翰逊，我的号码是555-0123。", note: "提供信息", phonetic: "/ɪts ˈdʒɒnsən/ /ænd maɪ ˈnʌmbər ɪz ˈfaɪv faɪv faɪv ˈzɪəroʊ wʌn θriː/" },
                    { speaker: "B", en: "Perfect, Mr. Johnson. We have you down for a table of four at 7:30 PM by the window. Please let us know if you need to cancel.", zh: "好的，约翰逊先生。我们已为您记下晚上7:30四人靠窗桌。如果需要取消请告知我们。", note: "确认预订", phonetic: "/ˈpɜːrfɪkt ˈmɪstər ˈdʒɒnsən/ /wiː hæv juː daʊn fɔːr ə ˈteɪbl əv fɔːr æt ˈsevən ˈθɜːrti piː em baɪ ðə ˈwɪndoʊ/ /pliːz let ʌs noʊ ɪf juː niːd tuː ˈkænsl/" }
                ]
            },
            {
                title: "点餐用餐",
                dialogues: [
                    { speaker: "A", en: "Good evening. Here's your menu. Our special today is grilled salmon with lemon butter sauce.", zh: "晚上好。这是您的菜单。我们今天的特色菜是柠檬黄油酱烤三文鱼。", note: "介绍菜单", phonetic: "/ɡʊd ˈiːvnɪŋ/ /hɪərz jɔːr ˈmenjuː/ /ˈaʊər ˈspeʃəl təˈdeɪ ɪz ɡrɪld ˈsæmən wɪð ˈlemən ˈbʌtər sɔːs/" },
                    { speaker: "B", en: "That sounds delicious. I'll have the salmon, please. What do you recommend for a side dish?", zh: "听起来很美味。我要三文鱼。有什么配菜推荐吗？", note: "点餐并询问", phonetic: "/ðæt saʊndz dɪˈlɪʃəs/ /aɪl hæv ðə ˈsæmən/ /pliːz/ /wɑːt duː juː ˌrekəˈmend fɔːr ə saɪd dɪʃ/" },
                    { speaker: "A", en: "The roasted vegetables are fresh today, or you could try our creamy mashed potatoes.", zh: "烤蔬菜今天很新鲜，或者您可以尝尝我们的奶油土豆泥。", note: "推荐配菜", phonetic: "/ðə ˈroʊstɪd ˈvedʒtəblz ɑːr freʃ təˈdeɪ/ /ɔːr juː kʊd traɪ ˈaʊər ˈkriːmi mæʃt pəˈteɪtoʊz/" },
                    { speaker: "B", en: "I'll go with the roasted vegetables, please. And could I have a glass of white wine as well?", zh: "请给我烤蔬菜。请问可以再来一杯白葡萄酒吗？", note: "确认配菜并点酒", phonetic: "/aɪl ɡoʊ wɪð ðə ˈroʊstɪd ˈvedʒtəblz/ /pliːz/ /ænd kʊd aɪ hæv ə ɡlæs əv waɪt waɪn æz wel/" }
                ]
            },
            {
                title: "结账打包",
                dialogues: [
                    { speaker: "A", en: "Excuse me, could we have the check please?", zh: "打扰一下，请问可以给我们账单吗？", note: "请求结账", phonetic: "/ɪkˈskjuːz miː/ /kʊd wiː hæv ðə tʃek pliːz/" },
                    { speaker: "B", en: "Certainly. Would you like separate checks or one combined bill?", zh: "当然可以。您想要分开结账还是合并账单？", note: "询问结账方式", phonetic: "/ˈsɜːrtnli/ /wʊd juː laɪk ˈseprət tʃeks ɔːr wʌn kəmˈbaɪnd bɪl/" },
                    { speaker: "A", en: "One bill please. Also, could you pack up the leftovers? I don't want to waste the delicious food.", zh: "请合并账单。另外，请问可以打包剩菜吗？我不想浪费这些美味的食物。", note: "合并账单并打包", phonetic: "/wʌn bɪl pliːz/ /ˈɔːlsoʊ/ /kʊd juː pæk ʌp ðə ˈleftoʊvərz/ /aɪ doʊnt wɒnt tuː weɪst ðə dɪˈlɪʃəs fuːd/" }
                ]
            }
        ],
        shopping: [
            {
                title: "购物咨询",
                dialogues: [
                    { speaker: "A", en: "Excuse me, I'm looking for a gift for my sister. Do you have any recommendations?", zh: "打扰一下，我在给我妹妹找礼物。你有什么推荐吗？", note: "寻求帮助", phonetic: "/ɪkˈskjuːs miː/ /aɪm ˈlʊkɪŋ fɔːr ə ɡɪft fɔːr maɪ ˈsɪstər/ /duː juː hæv ˈeni ˌrekəmenˈdeɪʃənz/" },
                    { speaker: "B", en: "Of course! What's the occasion, and what's your budget?", zh: "当然！是什么场合，您的预算是多少？", note: "了解情况", phonetic: "/əv ˈkɔːrs/ /wɑːts ðiː əˈkeɪʒn/ /ænd wɑːts jɔːr ˈbʌdʒɪt/" },
                    { speaker: "A", en: "It's her birthday, and I'd like to spend around $100.", zh: "是她的生日，我想花大约100美元。", note: "说明需求", phonetic: "/ɪts hɜːr ˈbɜːrθdeɪ/ /ænd aɪd laɪk tuː spend əˈraʊnd ˈwʌn ˈhʌndrəd ˈdɑːlərz/" },
                    { speaker: "B", en: "Perfect! We have some beautiful silk scarves that just arrived. Or perhaps a nice leather wallet?", zh: "太好了！我们刚到了一些漂亮的丝巾。或者也许一个不错的皮钱包？", note: "给出建议", phonetic: "/ˈpɜːrfɪkt/ /wiː hæv sʌm ˈbjuːtɪfl sɪlk skɑːrvz ðæt dʒʌst əˈraɪvd/ /ɔːr pərˈhæps ə naɪs ˈleðər ˈwɒlɪt/" },
                    { speaker: "A", en: "The scarf sounds nice. Can I see the different colors available?", zh: "丝巾听起来不错。我可以看看有哪些颜色吗？", note: "表达兴趣", phonetic: "/ðə skɑːrf saʊndz naɪs/ /kæn aɪ siː ðə ˈdɪfrənt ˈkʌlərz əˈveɪləbl/" },
                    { speaker: "B", en: "Certainly! We have them in red, blue, cream, and black. Which would you like to see first?", zh: "当然可以！我们有红色、蓝色、米色和黑色。您想先看哪个？", note: "展示选项", phonetic: "/ˈsɜːrtnli/ /wiː hæv ðem ɪn red/ /bluː/ /kriːm/ /ænd blæk/ /wɪtʃ wʊd juː laɪk tuː siː fɜːrst/" }
                ]
            },
            {
                title: "退货换货",
                dialogues: [
                    { speaker: "A", en: "Hi, I'd like to return this shirt. I bought it last week but it doesn't fit properly.", zh: "你好，我想退这件衬衫。我上周买的，但不太合身。", note: "退货请求", phonetic: "/haɪ/ /aɪd laɪk tuː rɪˈtɜːrn ðɪs ʃɜːrt/ /aɪ bɔːt ɪt lɑːst wiːk bʌt ɪt ˈdʌznt fɪt ˈprɒpərli/" },
                    { speaker: "B", en: "Of course. Do you have the receipt with you?", zh: "当然可以。您带收据了吗？", note: "询问收据", phonetic: "/əv ˈkɔːrs/ /duː juː hæv ðə rɪˈsiːt wɪð juː/" },
                    { speaker: "A", en: "Yes, here it is. I'd also like to exchange it for a larger size if available.", zh: "是的，在这里。如果有的话，我想换一件大号的。", note: "说明换货意愿", phonetic: "/jes/ /hɪər ɪt ɪz/ /aɪd ˈɔːlsoʊ laɪk tuː ɪksˈtʃeɪndʒ ɪt fɔːr ə ˈlɑːrdʒər saɪz ɪf əˈveɪləbl/" }
                ]
            },
            {
                title: "电器选购",
                dialogues: [
                    { speaker: "A", en: "Can you tell me more about this laptop? What are the specifications?", zh: "你能告诉我更多关于这台笔记本电脑的信息吗？配置是什么？", note: "询问产品信息", phonetic: "/kæn juː tel miː mɔːr əˈbaʊt ðɪs ˈlæptɒp/ /wɒt ɑːr ðə ˌspesɪfɪˈkeɪʃənz/" },
                    { speaker: "B", en: "Certainly! It has 16GB of RAM, a 512GB SSD, and the latest Intel processor. Great for both work and gaming.", zh: "当然！它有16GB内存，512GB固态硬盘，和最新的英特尔处理器。很适合工作和游戏。", note: "介绍配置", phonetic: "/ˈsɜːrtnli/ /ɪt hæz sixteen ɡɪɡəbaɪt əv ræm/ /ə twelv ɡɪɡəbaɪt es es diː/ /ænd ðə ˈleɪtɪst ˈɪntel ˈproʊsesər/ /ɡreɪt fɔːr boʊθ wɜːrk ænd ˈɡeɪmɪŋ/" },
                    { speaker: "A", en: "Does it come with a warranty?", zh: "有保修吗？", note: "询问保修", phonetic: "/dʌz ɪt kʌm wɪð ə ˈwɒrənti/" },
                    { speaker: "B", en: "Yes, it includes a two-year manufacturer warranty and we also offer an extended protection plan.", zh: "是的，包含两年厂家保修，我们还提供延保服务。", note: "说明保修信息", phonetic: "/jes/ /ɪt ɪnˈkluːdz ə tuː jɪər ˌmænjuˈfæktʃərər ˈwɒrənti/ /ænd wiː ˈɔːlsoʊ ˈɒfər ən ɪkˈstendɪd prəˈtekʃən plæn/" }
                ]
            }
        ],
        workplace: [
            {
                title: "会议安排",
                dialogues: [
                    { speaker: "A", en: "Hi Tom, do you have a minute? I need to discuss the project timeline.", zh: "嗨汤姆，你有空吗？我需要讨论一下项目时间表。", note: "发起对话", phonetic: "/haɪ tɒm/ /duː juː hæv ə ˈmɪnɪt/ /aɪ niːd tuː dɪˈskʌs ðə ˈprɒdʒekt ˈtaɪmlaɪn/" },
                    { speaker: "B", en: "Sure, what's on your mind? Is there an issue with the current schedule?", zh: "当然，你在想什么？当前时间表有问题吗？", note: "询问详情", phonetic: "/ʃʊər/ /wɑːts ɑːn jɔːr maɪnd/ /ɪz ðer ən ˈɪʃuː wɪð ðə ˈkʌrənt ˈskedʒuːl/" },
                    { speaker: "A", en: "I think we underestimated the development time. We might need an extra two weeks.", zh: "我想我们低估了开发时间。我们可能需要额外两周。", note: "说明问题", phonetic: "/aɪ θɪŋk wiː ˌʌndərˈestɪmeɪtɪd ðə dɪˈveləpmənt taɪm/ /wiː maɪt niːd ən ˈekstrə tuː wiːks/" },
                    { speaker: "B", en: "That's concerning. Can we discuss this in tomorrow's team meeting? I want everyone's input.", zh: "这令人担忧。我们可以在明天的团队会议上讨论这个吗？我想听听大家的意见。", note: "提议开会讨论", phonetic: "/ðæts kənˈsɜːrnɪŋ/ /kæn wiː dɪˈskʌs ðɪs ɪn təˈmɒroʊz tiːm ˈmiːtɪŋ/ /aɪ wɒnt ˈevriwʌnz ˈɪnpʊt/" },
                    { speaker: "A", en: "Absolutely. Should I prepare a detailed report with the revised timeline?", zh: "当然。我需要准备一份详细的报告，附上修改后的时间表吗？", note: "询问准备工作", phonetic: "/ˈæbsəluːtli/ /ʃʊd aɪ prɪˈpeər ə ˈdiːteɪld rɪˈpɔːrt wɪð ðə rɪˈvaɪzd ˈtaɪmlaɪn/" },
                    { speaker: "B", en: "Yes, please do. And let's also have some alternative solutions ready. The client won't be happy about the delay.", zh: "是的，请准备。我们还要准备一些替代方案。客户不会对延期感到高兴的。", note: "提出要求", phonetic: "/jes/ /pliːz duː/ /ænd lets ˈɔːlsoʊ hæv sʌm ɒlˈtɜːrnətɪv səˈluːʃənz ˈredi/ /ðə ˈklaɪənt woʊnt biː ˈhæpi əˈbaʊt ðə dɪˈleɪ/" }
                ]
            },
            {
                title: "请假申请",
                dialogues: [
                    { speaker: "A", en: "Mr. Chen, could I speak with you for a moment about my leave request?", zh: "陈经理，我可以和您谈谈我的请假申请吗？", note: "请求谈话", phonetic: "/ˈmɪstər tʃen/ /kʊd aɪ spiːk wɪð juː fɔːr ə ˈmoʊmənt əˈbaʊt maɪ liːv rɪˈkwest/" },
                    { speaker: "B", en: "Of course. What do you need?", zh: "当然可以。你需要什么？", note: "询问", phonetic: "/əv ˈkɔːrs/ /wɒt duː juː niːd/" },
                    { speaker: "A", en: "I'd like to take a week off next month for my sister's wedding. I already have all my tasks covered.", zh: "下个月我想请一周假参加我姐姐的婚礼。我已经把所有任务安排好了。", note: "说明请假原因", phonetic: "/aɪd laɪk tuː teɪk ə wiːk ɒf nekst mʌnθ fɔːr maɪ ˈsɪstərz ˈwedɪŋ/ /aɪ ɔːlˈredi hæv ɔːl maɪ tɑːsks ˈkʌvərd/" },
                    { speaker: "B", en: "That should be fine. Please submit the formal request through HR and I'll approve it.", zh: "应该没问题。请通过人力资源部提交正式申请，我会批准的。", note: "批准请假", phonetic: "/ðæt ʃʊd biː faɪn/ /pliːz səbˈmɪt ðə ˈfɔːrməl rɪˈkwest θruː eɪtʃ ɑːr ænd aɪl əˈpruːv ɪt/" }
                ]
            },
            {
                title: "加班讨论",
                dialogues: [
                    { speaker: "A", en: "Hey, do you have a moment? I wanted to discuss the overtime situation.", zh: "嘿，你有空吗？我想讨论一下加班的情况。", note: "发起讨论", phonetic: "/heɪ/ /duː juː hæv ə ˈmoʊmənt/ /aɪ ˈwɒntɪd tuː dɪˈskʌs ðiː ˈoʊvərtaɪm ˌsɪtʃuˈeɪʃən/" },
                    { speaker: "B", en: "Sure. What's on your mind?", zh: "当然可以。你在想什么？", note: "询问", phonetic: "/ʃʊər/ /wɒts ɑːn jɔːr maɪnd/" },
                    { speaker: "A", en: "I've been working late almost every day this month. Is there a way to redistribute some of the workload?", zh: "这个月我几乎每天都在加班。有没有办法重新分配一些工作负担？", note: "说明问题", phonetic: "/aɪv biːn ˈwɜːrkɪŋ leɪt ˈɔːlməst ˈevri deɪ ðɪs mʌnθ/ /ɪz ðer ə weɪ tuː ˌriːdɪˈstrɪbjuːt sʌm əv ðə ˈwɜːrkloʊd/" }
                ]
            }
        ],
        campus: [
            {
                title: "借笔记",
                dialogues: [
                    { speaker: "A", en: "Hey Emily, I heard you take really good notes in Professor Smith's class.", zh: "嘿艾米丽，我听说你在史密斯教授的课上笔记记得很好。", note: "开场白", phonetic: "/heɪ ˈemɪli/ /aɪ hɜːrd juː teɪk ˈriːəli ɡʊd noʊts ɪn prəˈfesər smɪðs klɑːs/" },
                    { speaker: "B", en: "Oh, thanks! I try to be thorough. Why do you ask?", zh: "哦，谢谢！我尽量记得详细。你为什么问？", note: "回应", phonetic: "/oʊ θæŋks/ /aɪ traɪ tuː biː ˈθɜːroʊ/ /waɪ duː juː ɑːsk/" },
                    { speaker: "A", en: "I missed last Tuesday's lecture because I was sick. Could I borrow your notes to catch up?", zh: "我因为生病错过了上周二的课。我可以借你的笔记来补上吗？", note: "说明原因", phonetic: "/aɪ mɪst lɑːst ˈtuːzdeɪz ˈlektʃər bɪˈkɒz aɪ wɒz sɪk/ /kʊd aɪ ˈbɒroʊ jɔːr noʊts tuː kætʃ ʌp/" },
                    { speaker: "B", en: "Of course! I'm happy to help. When do you need them by?", zh: "当然！我很乐意帮忙。你什么时候需要？", note: "同意借出", phonetic: "/əv ˈkɔːrs/ /aɪm ˈhæpi tuː help/ /wen duː juː niːd ðem baɪ/" },
                    { speaker: "A", en: "Would tomorrow afternoon work? I have an exam coming up next week.", zh: "明天下午可以吗？我下周有考试。", note: "约定时间", phonetic: "/wʊd təˈmɒroʊ ˌɑːftərˈnuːn wɜːrk/ /aɪ hæv ən ɪɡˈzæm ˈkʌmɪŋ ʌp nekst wiːk/" },
                    { speaker: "B", en: "Sure! I'll bring them to the library around 3 PM. Good luck with your exam!", zh: "当然！我下午3点左右带到图书馆。祝你考试好运！", note: "确认并祝福", phonetic: "/ʃʊər/ /aɪl brɪŋ ðem tuː ðə ˈlaɪbreri əˈraʊnd θriː piː em/ /ɡʊd lʌk wɪð jɔːr ɪɡˈzæm/" }
                ]
            },
            {
                title: "小组项目",
                dialogues: [
                    { speaker: "A", en: "Hey team, I think we should divide up the research work for our group project.", zh: "嘿团队，我认为我们应该为小组项目分工研究工作。", note: "提议分工", phonetic: "/heɪ tiːm/ /aɪ θɪŋk wiː ʃʊd dɪˈvaɪd ʌp ðə rɪˈsɜːrtʃ wɜːrk fɔːr ˈaʊər ɡruːp ˈprɒdʒekt/" },
                    { speaker: "B", en: "Good idea! What parts do you want to handle?", zh: "好主意！你想负责哪些部分？", note: "询问分工", phonetic: "/ɡʊd aɪˈdɪə/ /wɒt pɑːrts duː juː wɒnt tuː ˈhændlər/" },
                    { speaker: "A", en: "I can do the introduction and conclusion. How about you guys handle the methodology and analysis?", zh: "我可以做引言和结论。你们负责方法论和分析怎么样？", note: "提出分工方案", phonetic: "/aɪ kæn duː ði ˌɪntrəˈdʌkʃən ænd kənˈkluːʒən/ /haʊ əˈbaʊt juː ɡaɪz ˈhændl ðə ˌmeθəˈdɒlədʒi ænd əˈnæləsɪs/" }
                ]
            },
            {
                title: "图书馆讨论",
                dialogues: [
                    { speaker: "A", en: "Excuse me, is anyone sitting here?", zh: "打扰一下，请问这里有人坐吗？", note: "询问座位", phonetic: "/ɪkˈskjuːz miː/ /ɪz ˈeniwʌn ˈsɪtɪŋ hɪər/" },
                    { speaker: "B", en: "No, feel free! Are you also studying for the biology exam?", zh: "没有，请随便坐！你也是在复习生物考试吗？", note: "询问", phonetic: "/noʊ/ /fiːl friː/ /ɑːr juː ˈɔːlsoʊ ˈstaɪdɪŋ fɔːr ðə baɪˈɒlədʒi ɪɡˈzæm/" },
                    { speaker: "A", en: "Yes, it's going to be tough. Do you understand the chapter on genetics?", zh: "是的，会很难。你理解遗传学那一章吗？", note: "讨论考试", phonetic: "/jes/ /ɪts ˈɡoʊɪŋ tuː biː tʌf/ /duː juː ˌʌndəˈstænd ðə ˈtʃæptər ɒn dʒɪˈnetɪks/" }
                ]
            }
        ],
        hobby: [
            {
                title: "谈论爱好",
                dialogues: [
                    { speaker: "A", en: "So, what do you like to do in your free time?", zh: "那么，你空闲时间喜欢做什么？", note: "询问爱好", phonetic: "/soʊ/ /wɑːt duː juː laɪk tuː duː ɪn jɔːr friː taɪm/" },
                    { speaker: "B", en: "I'm really into photography. I love capturing moments and beautiful scenery.", zh: "我非常喜欢摄影。我喜欢捕捉瞬间和美丽的风景。", note: "分享爱好", phonetic: "/aɪm ˈriːəli ˈɪntuː fəˈtɒɡrəfi/ /aɪ lʌv ˈkæptʃərɪŋ ˈmoʊmənts ænd ˈbjuːtɪfl ˈsiːnəri/" },
                    { speaker: "A", en: "That's cool! Do you have a favorite subject to photograph?", zh: "太酷了！你有最喜欢的拍摄主题吗？", note: "深入了解", phonetic: "/ðæts kuːl/ /duː juː hæv ə ˈfeɪvərɪt ˈsʌbdʒɪkt tuː ˈfoʊtəɡræf/" },
                    { speaker: "B", en: "I mostly shoot landscapes and street photography. What about you? Any hobbies?", zh: "我主要拍摄风景和街头摄影。你呢？有什么爱好？", note: "回答并反问", phonetic: "/aɪ ˈmoʊstli ʃuːt ˈlændskeɪps ænd striːt fəˈtɒɡrəfi/ /wɑːt əˈbaʊt juː/ /ˈeni ˈhɒbiz/" },
                    { speaker: "A", en: "I play guitar, actually. Nothing professional, just for fun.", zh: "其实我弹吉他。不是专业的，只是为了好玩。", note: "分享自己的爱好", phonetic: "/aɪ pleɪ ɡɪˈtɑːr ˈæktʃuəli/ /ˈnʌθɪŋ prəˈfeʃənl/ /dʒʌst fɔːr fʌn/" },
                    { speaker: "B", en: "Nice! We should jam together sometime. I know a great little music studio nearby.", zh: "不错！我们应该找个时间一起即兴演奏。我知道附近一个很棒的小音乐工作室。", note: "提议一起活动", phonetic: "/naɪs/ /wiː ʃʊd dʒæm təˈɡeðər ˈsʌmtaɪm/ /aɪ noʊ ə ɡreɪt ˈlɪtl ˈmjuːzɪk ˈstjuːdiəʊ ˈnɪəbaɪ/" }
                ]
            },
            {
                title: "健身话题",
                dialogues: [
                    { speaker: "A", en: "I've been going to the gym lately. Have you tried any fitness classes?", zh: "我最近一直在去健身房。你试过什么健身课程吗？", note: "谈论健身", phonetic: "/aɪv biːn ˈɡoʊɪŋ tuː ðə dʒɪm ˈleɪtli/ /hæv juː traɪd ˈeni fɪtˈnes ˈklæsɪz/" },
                    { speaker: "B", en: "Yes! I love yoga. It's great for flexibility and stress relief.", zh: "是的！我喜欢瑜伽。它对柔韧性和减压都很好。", note: "分享健身方式", phonetic: "/jes/ /aɪ lʌv ˈjoʊɡə/ /ɪts ɡreɪt fɔːr ˌfleksəˈbɪləti ænd stress rɪˈliːf/" },
                    { speaker: "A", en: "I've been thinking about trying yoga. Do you have any recommendations for beginners?", zh: "我一直在考虑尝试瑜伽。你有什么初学者建议吗？", note: "询问建议", phonetic: "/aɪv biːn ˈθɪŋkɪŋ əˈbaʊt traɪɪŋ ˈjoʊɡə/ /duː juː hæv ˈeni ˌrekəmenˈdeɪʃənz fɔːr bɪˈɡɪnərz/" }
                ]
            },
            {
                title: "电影讨论",
                dialogues: [
                    { speaker: "A", en: "Did you catch the new superhero movie that came out last week?", zh: "你看了上周上映的新超级英雄电影吗？", note: "询问电影", phonetic: "/dɪd juː kætʃ ðə njuː ˈsuːpərˌhɪəroʊ ˈmuːvi ðæt keɪm aʊt lɑːst wiːk/" },
                    { speaker: "B", en: "Yes, I saw it yesterday! The visual effects were incredible, but I thought the plot was a bit predictable.", zh: "是的，我昨天看的！视觉效果令人难以置信，但我觉得剧情有点可预测。", note: "评论电影", phonetic: "/jes/ /aɪ sɔː ɪt ˈjestərdeɪ/ /ðə ˈvɪʒuəl ɪˈfekts wɜːr ɪnˈkredəbl/ /bʌt aɪ θɔːt ðə plɒt wɒz ə bɪt prɪˈdɪktəbl/" },
                    { speaker: "A", en: "I agree. Maybe we should check out that new indie film instead. It got great reviews.", zh: "我同意。也许我们应该去看那部新独立电影。评价很高。", note: "提议其他电影", phonetic: "/aɪ əˈɡriː/ /meɪbi wiː ʃʊd tʃek aʊt ðæt njuː ˈɪndi fɪlm ɪnˈsted/ /ɪt ɡɒt ɡreɪt rɪˈvjuːz/" }
                ]
            }
        ],
        health: [
            {
                title: "看医生",
                dialogues: [
                    { speaker: "A", en: "Good morning, Dr. Johnson. Thanks for seeing me on such short notice.", zh: "早上好，约翰逊医生。谢谢您这么快就见我。", note: "问候", phonetic: "/ɡʊd ˈmɔːrnɪŋ ˈdɒktər ˈdʒɒnsən/ /θæŋks fɔːr ˈsiːɪŋ miː ɒn sʌtʃ ʃɔːrt ˈnoʊtɪs/" },
                    { speaker: "B", en: "Of course. So, what seems to be the problem?", zh: "当然。那么，有什么问题吗？", note: "询问病情", phonetic: "/əv ˈkɔːrs/ /soʊ/ /wɑːt siːmz tuː biː ðə ˈprɒbləm/" },
                    { speaker: "A", en: "I've been having terrible headaches for the past three days, and I feel dizzy sometimes.", zh: "过去三天我一直头疼得厉害，而且有时感到头晕。", note: "描述症状", phonetic: "/aɪv biːn ˈhævɪŋ ˈterəbl ˈhedeɪks fɔːr ðə pɑːst θriː deɪz/ /ænd aɪ fiːl ˈdɪzi ˈsʌmtaɪmz/" },
                    { speaker: "B", en: "I see. Have you been under a lot of stress lately, or changed your diet?", zh: "我明白了。你最近压力大吗，或者改变了饮食？", note: "询问可能原因", phonetic: "/aɪ siː/ /hæv juː biːn ˈʌndər ə lɒt əv stress ˈleɪtli/ /ɔːr tʃeɪndʒd jɔːr ˈdaɪət/" },
                    { speaker: "A", en: "Work has been really stressful, and I've been drinking a lot of coffee.", zh: "工作压力真的很大，而且我喝了很多咖啡。", note: "提供信息", phonetic: "/wɜːrk hɒz biːn ˈriːəli ˈstresfl/ /ænd aɪv biːn ˈdrɪŋkɪŋ ə lɒt əv ˈkɒfi/" },
                    { speaker: "B", en: "That could be it. I'll prescribe some pain relief, but you should also try to reduce your caffeine intake and get more rest.", zh: "可能是这个原因。我会开一些止痛药，但你也应该试着减少咖啡因摄入，多休息。", note: "给出建议", phonetic: "/ðæt kʊd biː ɪt/ /aɪl prɪˈskraɪb sʌm peɪn rɪˈliːf/ /bʌt juː ʃʊd ˈɔːlsaʊ traɪ tuː rɪˈdjuːs jɔːr ˈkæfiːn ˈɪnteɪk ænd ɡet mɔːr rest/" }
                ]
            },
            {
                title: "药店买药",
                dialogues: [
                    { speaker: "A", en: "Hi, I need some medication for a cold. What would you recommend?", zh: "你好，我需要一些感冒药。有什么推荐吗？", note: "询问药品", phonetic: "/haɪ/ /aɪ niːd sʌm ˌmedɪˈkeɪʃən fɔːr ə koʊld/ /wɒt wʊd juː ˌrekəˈmend/" },
                    { speaker: "B", en: "For cold symptoms, I recommend this decongestant and some vitamin C. Are you allergic to any medications?", zh: "对于感冒症状，我推荐这个减充血剂和一些维生素C。你对什么药物过敏吗？", note: "推荐药品", phonetic: "/fɔːr koʊld ˈsɪmptəmz/ /aɪ ˌrekəˈmend ðɪs ˌdiːkənˈdʒestənt ænd sʌm ˈvaɪtəmɪn siː/ /ɑːr juː əˈlɜːrɡɪk tuː ˈeni ˌmedɪˈkeɪʃənz/" },
                    { speaker: "A", en: "No allergies that I know of. How often should I take the medicine?", zh: "据我所知没有过敏。我应该多久服用一次？", note: "询问用法", phonetic: "/noʊ ˈælərdʒiz ðæt aɪ noʊ əv/ /haʊ ˈɔːfən ʃʊd aɪ teɪk ðə ˈmedɪsɪn/" }
                ]
            },
            {
                title: "牙医预约",
                dialogues: [
                    { speaker: "A", en: "Hello, I'd like to schedule a dental appointment. My name is Robert Chen.", zh: "你好，我想预约牙科。我叫陈罗伯特。", note: "预约牙医", phonetic: "/həˈloʊ/ /aɪd laɪk tuː ˈskedʒuːl ə ˈdentl əˈpɔɪntmənt/ /maɪ neɪm ɪz ˈrɒbərt tʃen/" },
                    { speaker: "B", en: "Hello Mr. Chen! We have availability next Tuesday at 2 PM or Wednesday at 10 AM. Which works better for you?", zh: "你好陈先生！我们下周二下午2点或周三上午10点有空。您哪个时间更方便？", note: "提供预约时间", phonetic: "/həˈloʊ ˈmɪstər tʃen/ /wiː hæv əˌveɪləˈbɪləti nekst ˈtuːzdeɪ æt tuː piː em ɔːr ˈwenzdeɪ æt ten eɪ em/ /wɪtʃ wɜːrks ˈbetər fɔːr juː/" },
                    { speaker: "A", en: "Tuesday at 2 PM would be perfect. Is there anything I should prepare before the appointment?", zh: "周二下午2点非常合适。预约之前我需要准备什么吗？", note: "确认预约", phonetic: "/ˈtuːzdeɪ æt tuː piː em wʊd biː pərˈfekt/ /ɪz ðer ˈeniθɪŋ aɪ ʃʊd prɪˈpeər bɪˈfɔːr ði əˈpɔɪntmənt/" }
                ]
            }
        ]
    },

    // 在线对话库 - 每次从网络获取
    onlineDialogues: [],

    // 获取所有场景
    getScenes() {
        return this.scenes;
    },

    // 获取指定场景的所有对话
    getConversations(sceneId) {
        const localConvs = this.baseConversations[sceneId] || [];
        
        // 添加在线对话（如果有）
        const onlineForScene = this.onlineDialogues.filter(c => c.sceneId === sceneId);
        
        return [...localConvs, ...onlineForScene];
    },

    // 获取随机对话
    getRandomConversation(sceneId) {
        const conversations = this.getConversations(sceneId);
        if (conversations.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * conversations.length);
        return conversations[randomIndex];
    },

    // 获取所有对话
    getAllConversations() {
        const all = [];
        this.scenes.forEach(scene => {
            const convs = this.getConversations(scene.id);
            convs.forEach(conv => {
                all.push({ ...conv, sceneId: scene.id });
            });
        });
        return all;
    },

    // 模拟每日更新
    getDailyConversations(count = 5) {
        const all = this.getAllConversations();
        const today = new Date().toDateString();
        const seed = this.stringToSeed(today);
        const shuffled = this.seededShuffle([...all], seed);
        return shuffled.slice(0, count);
    },

    // 字符串转种子
    stringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    },

    // 带种子的随机打乱
    seededShuffle(array, seed) {
        const result = [...array];
        let currentIndex = result.length;
        let randomIndex;

        const random = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        while (currentIndex > 0) {
            randomIndex = Math.floor(random() * currentIndex);
            currentIndex--;
            [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
        }

        return result;
    },

    // 搜索对话
    searchConversations(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        this.scenes.forEach(scene => {
            const convs = this.getConversations(scene.id);
            convs.forEach(conv => {
                const matchTitle = conv.title.toLowerCase().includes(lowerQuery);
                const matchDialogue = conv.dialogues.some(d => 
                    d.en.toLowerCase().includes(lowerQuery) || 
                    d.zh.includes(query)
                );
                if (matchTitle || matchDialogue) {
                    results.push({ ...conv, sceneId: scene.id });
                }
            });
        });
        
        return results;
    },

    // 从网络获取对话数据
    async fetchOnlineDialogues() {
        try {
            // 使用多个免费API来获取不同的内容
            const apis = [
                () => this.fetchFromQuotable(),
                () => this.fetchFromUselessFacts(),
                () => this.fetchFromRandomUser()
            ];

            // 随机选择一个API
            const randomApi = apis[Math.floor(Math.random() * apis.length)];
            const dialogues = await randomApi();

            if (dialogues && dialogues.length > 0) {
                this.onlineDialogues = dialogues;
                return dialogues;
            }
        } catch (error) {
            console.log('Online fetch failed:', error);
        }
        return [];
    },

    // API 1: Quotable - 获取名言并转换为对话
    async fetchFromQuotable() {
        try {
            const response = await fetch('https://api.quotable.io/quotes/random?limit=5');
            if (!response.ok) throw new Error('API failed');
            const data = await response.json();
            
            return data.map((quote, index) => ({
                title: `每日名言 ${index + 1}`,
                dialogues: [
                    { 
                        speaker: "A", 
                        en: "Here's an inspiring quote for today.", 
                        zh: "今天有一句启发性的名言。",
                        note: "引入",
                        phonetic: ""
                    },
                    { 
                        speaker: "B", 
                        en: quote.content, 
                        zh: quote.content,
                        note: `— ${quote.author}`,
                        phonetic: ""
                    },
                    {
                        speaker: "A",
                        en: "That's really meaningful. I'll remember that.",
                        zh: "真的很有意义。我会记住的。",
                        note: "回应",
                        phonetic: ""
                    }
                ],
                sceneId: 'greeting',
                online: true
            }));
        } catch (e) {
            return [];
        }
    },

    // API 2: Useless Facts - 获取有趣的事实
    async fetchFromUselessFacts() {
        try {
            const facts = [];
            for (let i = 0; i < 3; i++) {
                const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
                if (response.ok) {
                    const data = await response.json();
                    facts.push(data.text);
                }
            }
            
            return facts.map((fact, index) => ({
                title: `有趣的事实 ${index + 1}`,
                dialogues: [
                    { 
                        speaker: "A", 
                        en: "Did you know this interesting fact?", 
                        zh: "你知道这个有趣的事实吗？",
                        note: "引入话题",
                        phonetic: ""
                    },
                    { 
                        speaker: "B", 
                        en: fact, 
                        zh: fact,
                        note: "有趣的事实",
                        phonetic: ""
                    },
                    {
                        speaker: "A",
                        en: "Wow, I didn't know that! That's fascinating.",
                        zh: "哇，我不知道！太神奇了。",
                        note: "惊讶回应",
                        phonetic: ""
                    }
                ],
                sceneId: 'hobby',
                online: true
            }));
        } catch (e) {
            return [];
        }
    },

    // API 3: Random User - 生成虚拟人物对话
    async fetchFromRandomUser() {
        try {
            const response = await fetch('https://randomuser.me/api/?results=2');
            if (!response.ok) throw new Error('API failed');
            const data = await response.json();
            
            const users = data.results;
            if (users.length < 2) return [];
            
            const user1 = users[0];
            const user2 = users[1];
            
            return [{
                title: "新朋友相识",
                dialogues: [
                    { 
                        speaker: "A", 
                        en: `Hi, I'm ${user1.name.first}. I come from ${user1.location.country}.`, 
                        zh: `你好，我是${user1.name.first}。我来自${user1.location.country}。`,
                        note: "自我介绍",
                        phonetic: ""
                    },
                    { 
                        speaker: "B", 
                        en: `Nice to meet you! I'm ${user2.name.first} from ${user2.location.country}.`, 
                        zh: `很高兴认识你！我是来自${user2.location.country}的${user2.name.first}。`,
                        note: "回应并介绍",
                        phonetic: ""
                    },
                    {
                        speaker: "A",
                        en: `What do you do for a living?`,
                        zh: `你是做什么工作的？`,
                        note: "询问职业",
                        phonetic: ""
                    },
                    {
                        speaker: "B",
                        en: `I work as a software developer. How about you?`,
                        zh: `我是软件开发者。你呢？`,
                        note: "回答并反问",
                        phonetic: ""
                    }
                ],
                sceneId: 'greeting',
                online: true
            }];
        } catch (e) {
            return [];
        }
    },

    // 确保有足够对话，如果不够则从网络获取
    async ensureEnoughDialogues(minCount = 3) {
        const all = this.getAllConversations();
        
        if (all.length < minCount) {
            await this.fetchOnlineDialogues();
        }
        
        return this.getAllConversations();
    }
};
