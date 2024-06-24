// --------------------------- //
// --       comm.js         -- //
// --   version : 1.0.0     -- //
// --   date : 2023-06-22   -- //
// --------------------------- //

window.tlrtcfile = {
    addUrlHashParams: function (obj) {
        let redirect = window.location.protocol + "//" + window.location.host + "#"
        let oldObj = this.getRequestHashArgsObj();
        obj = Object.assign(oldObj, obj);
        for (let key in obj) {
            redirect += key + "=" + encodeURIComponent(obj[key]) + "&";
        }
        return redirect;
    },
    getRequestHashArgsObj: function () {
        let query = decodeURIComponent(window.location.hash.substring(1));
        let args = query.split("&");
        let obj = {};
        for (let i = 0; i < args.length; i++) {
            let pair = args[i].split("=");
            const key = pair[0];
            const val = pair[1];
            if (key) {
                obj[key] = decodeURIComponent(val)
            }
        }
        return obj;
    },
    getRequestHashArgs: function (key) {
        let query = decodeURIComponent(window.location.hash.substring(1));
        let args = query.split("&");
        for (let i = 0; i < args.length; i++) {
            let pair = args[i].split("=");
            if (pair[0] === key) {
                return pair[1];
            }
        }
        return "";
    },
    containChinese: function (str) {
        return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str);
    },
    containNumber: function (str) {
        return /^[0-9]+.?[0-9]*$/.test(str);
    },
    containSymbol: function (str) {
        return new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]").test(str)
    },
    isEmail : function(str){
        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
    },
    genNickNameRandom: function () {
        // 获取指定范围内的随机数
        function randomAccess(min, max) {
            return Math.floor(Math.random() * (min - max) + max)
        }

        // 解码
        function decodeUnicode(str) {
            //Unicode显示方式是\u4e00
            str = "\\u" + str;
            str = str.replace(/\\/g, "%");
            //转换中文
            str = unescape(str);
            //将其他受影响的转换回原来
            str = str.replace(/%/g, "\\");
            return str;
        }

        function getRandomName(len) {
            let name = ""
            for (let i = 0; i < len; i++) {
                let unicodeNum = ""
                unicodeNum = randomAccess(0x4e00, 0x9fa5).toString(16)
                name += decodeUnicode(unicodeNum)
            }
            return name;
        }
        return getRandomName(4);
    },
    escapeStr: function (str) {
        const entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        const encodedMap = {
            '%': '%25',
            '!': '%21',
            "'": '%27',
            '(': '%28',
            ')': '%29',
            '*': '%2A',
            '-': '%2D',
            '.': '%2E',
            '_': '%5F',
            '~': '%7E'
        };
        return String(str).replace(/[&<>"'`=\/%!'()*\-._~]/g, function (s) {
            return entityMap[s] || encodedMap[s] || '';
        });
    },
    unescapeStr: function (str) {
        const entityMap = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
            '&#x2F;': '/',
            '&#x60;': '`',
            '&#x3D;': '='
        };
        const encodedMap = {
            '%25': '%',
            '%21': '!',
            '%27': "'",
            '%28': '(',
            '%29': ')',
            '%2A': '*',
            '%2D': '-',
            '%2E': '.',
            '%5F': '_',
            '%7E': '~'
        };
        return String(str).replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);|%(25|21|27|28|29|2A|2D|2E|5F|7E)/g, function (s) {
            return entityMap[s] || encodedMap[s] || '';
        });
    },
    getNetWorkState: function () {
        let ua = navigator.userAgent;
        let networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
        networkStr = networkStr.toLowerCase().replace('nettype/', '');
        if (!['wifi', '5g', '3g', '4g', '2g', '3gnet', 'slow-2g'].includes(networkStr)) {
            if (navigator.connection) {
                networkStr = navigator.connection.effectiveType
            }
        }
        switch (networkStr) {
            case 'wifi':
                return 'wifi';
            case '5g':
                return '5g';
            case '4g':
                return '4g';
            case '3g' || '3gnet':
                return '3g';
            case '2g' || 'slow-2g':
                return '2g';
            default:
                return 'unknow';
        }
    },
    shaking: function (id, top, left) {
        let a = ['maringTop', 'marginLeft'], b = 0;
        window.shakingId = setInterval(function () {
            document.getElementById(id).style[a[b % 2]] = (b++) % 4 < 2 ? (top + "px") : (left + "px");
            if (b > 15) { clearInterval(window.shakingId); b = 0 }
        }, 32)
    },
    loadJS: function (url, callback) {
        let script = document.createElement('script'),
            fn = callback || function () { };
        script.type = 'text/javascript';
        //IE
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    fn();
                }
            };
        } else {
            //其他浏览器
            script.onload = function () {
                fn();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    },
    isMobile: function () {
        return navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        );
    },
    chatKeydown: function (dom, callback) {
        if (dom) {
            dom.onkeydown = function (e) {
                if (e.defaultPrevented) {
                    return;
                }

                if (e.shiftKey) {
                    // shift+enter 换行
                    return;
                } else if (e.key !== undefined) {
                    if (e.key === "Enter") {
                        // enter键执行
                        callback && callback()
                        e.preventDefault();
                    }
                } else if (e.keyCode !== undefined) {
                    if (e.keyCode === 13) {
                        // enter键执行
                        callback && callback()
                        e.preventDefault();
                    }
                }
            }
        }
    },
    supposeWebrtc: function (rtcConfig) {
        try {
            let testRTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || 
                                        window.mozRTCPeerConnection || window.RTCIceGatherer;
            if (testRTCPeerConnection) {
                new RTCPeerConnection(rtcConfig);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("浏览器不支持webrtc")
            return false;
        }
    },
    checkWebRtcNATType: async function (rtcConfig) {
        // 确认网络连接状态
        try {
            const rtcConnect = new RTCPeerConnection(rtcConfig);
            const dataChannel = rtcConnect.createDataChannel('ping'); // 创建数据通道
            // 生成本地候选者
            const localCandidates = [];
            const candidates = {};
            rtcConnect.onicecandidate = (event) => {
                if(!event.candidate){//等待几秒钟没有候选者了，可以初步判断结果了
                    rtcConnect.close();
                    return
                }

                localCandidates.push(event.candidate.candidate);

                // if (event.candidate.candidate.indexOf('srflx') === -1) return;

                // let fields;
                // if (event.candidate.candidate.indexOf('a=candidate:') === 0) {
                //     fields = event.candidate.candidate.substring(12).split(' ');
                // } else {
                //     fields = event.candidate.candidate.substring(10).split(' ');
                // }
    
                // let candidateFields = {
                //     ip: fields[4],
                //     port: parseInt(fields[5], 10),
                //     type: fields[7]
                // };
    
                // for (let i = 8; i < fields.length; i += 2) {
                //     if(fields[i] === 'raddr'){
                //         candidateFields.relatedAddress = fields[i + 1];
                //     }
                //     if(fields[i] === 'rport'){
                //         candidateFields.relatedPort = parseInt(fields[i + 1], 10);
                //     }
                //     if(fields[i] === 'tcptype'){
                //         candidateFields.tcpType = fields[i + 1];
                //     }
                // }
                // console.log("candidate : ",candidateFields);

                // if (!candidates[candidateFields.relatedPort]){
                //     candidates[candidateFields.relatedPort] = []
                // }
                // candidates[candidateFields.relatedPort].push(candidateFields.port);
            };

            await rtcConnect.setLocalDescription(await rtcConnect.createOffer({
                iceRestart: true // 避免使用缓存的ICE候选者
            }));

            // 等待一段时间以获取完整的ICE候选者
            await new Promise((resolve) => setTimeout(resolve, 2000));


            // 模拟将本地候选者发送给Server并从Server获取Server的候选者
            const serverCandidates = []; // 假设这里填入从Server获取的候选者
            const remoteCandidates = localCandidates.concat(serverCandidates);

            // 解析ICE候选者中的IP和Port
            const candidateIPandPorts = remoteCandidates.map( candidate => {
                const fields = candidate.split(' ');
                let candidateFields = {
                    ip: fields[4],
                    port: parseInt(fields[5], 10),
                    type: fields[7]
                };

                if (candidate.indexOf('srflx') !== -1){
                    let srflxFiled = ""
                    if (candidate.indexOf('a=candidate:') === 0) {
                        srflxFiled = candidate.substring(12).split(' ');
                    } else {
                        srflxFiled = candidate.substring(10).split(' ');
                    }
                    for (let i = 8; i < srflxFiled.length; i += 2) {
                        if(srflxFiled[i] === 'raddr'){
                            candidateFields.relatedAddress = srflxFiled[i + 1];
                        }
                        if(srflxFiled[i] === 'rport'){
                            candidateFields.relatedPort = parseInt(srflxFiled[i + 1], 10);
                        }
                        if(srflxFiled[i] === 'tcptype'){
                            candidateFields.tcpType = srflxFiled[i + 1];
                        }
                    }
    
                }
                return candidateFields;
            });

            console.log("candidateIPandPorts : ",candidateIPandPorts)

            // 判断网络状态是否正常
            const isNetworkBlocked = candidateIPandPorts.length === 0;
            if (isNetworkBlocked) {
                return "udp-blocked";
            }

            // 判断是否在NAT之后，比较第一个候选者的IP和Port
            const isBehindNAT = candidateIPandPorts[0].ip !== candidateIPandPorts[candidateIPandPorts.length - 1].ip ||
                candidateIPandPorts[0].port !== candidateIPandPorts[candidateIPandPorts.length - 1].port;

            if (!isBehindNAT) {
                // 没有经过NAT转换，可能存在网络防火墙
                // TODO: 进行更多验证，例如尝试连接不同的端口和IP
                return "no-nat";
            } else {
                // 判断是否是端口限制型NAT
                const isPortRestrictedNAT = candidateIPandPorts.some((candidate, index) => {
                    const nextCandidate = candidateIPandPorts[index + 1];
                    if (nextCandidate) {
                        return candidate.ip === nextCandidate.ip && candidate.port !== nextCandidate.port;
                    }
                    return false;
                });

                if (isPortRestrictedNAT) return 'port-restricted-nat';

                // 判断是否是IP限制型NAT
                const isIPRestrictedNAT = candidateIPandPorts.some((candidate, index) => {
                    const nextCandidate = candidateIPandPorts[index + 1];
                    if (nextCandidate) {
                        return candidate.ip !== nextCandidate.ip && candidate.port === nextCandidate.port;
                    }
                    return false;
                });

                if (isIPRestrictedNAT) return 'ip-restricted-nat';

                return 'unknown-nat';
            }
        } catch (error) {
            console.error('Error occurred:', error);
            return 'error';
        }
    },
    getWebrtcStats: async function (peerConnection) {
        if (!peerConnection) {
            return "RTCPeerConnection is not available";
        }
        if (!peerConnection.getStats) {
            return "RTCStatsReport is not available";
        }

        function getTypeDescription(type) {
            switch (type) {
                case 'candidate-pair':
                    return '候选者对';
                case 'certificate':
                    return '证书相关的统计信息';
                case 'codec':
                    return '当前音视频编解码器的统计信息';
                case 'csrc':
                    return 'CSRC相关的统计信息';
                case 'data-channel':
                    return '数据通道的相关统计信息';
                case 'inbound-rtp':
                    return '传入数据流的相关统计信息';
                case 'local-candidate':
                    return '本地候选连接的相关统计信息';
                case 'media-source':
                    return '媒体源的相关统计信息';
                case 'outbound-rtp':
                    return '传出数据流的相关统计信息';
                case 'peer-connection':
                    return '对等连接的相关统计信息';
                case 'remote-candidate':
                    return '远程候选连接的相关统计信息';
                case 'remote-inbound-rtp':
                    return '远程传入数据流的相关统计信息';
                case 'remote-outbound-rtp':
                    return '远程传出数据流的相关统计信息';
                case 'track':
                    return '媒体轨道的相关统计信息';
                case 'transport':
                    return '传输协议的相关统计信息';
                case 'media-playout':
                    return '音频播放的相关统计数据'
                default:
                    return '未知类型';
            }
        }

        function getRTCStats(peerConnection) {
            const statsMap = new Map();
            return new Promise((resolve) => {
                peerConnection.getStats().then((stats) => {
                    stats.forEach((report) => {
                        const { type } = report;
                        if (!statsMap.has(type)) {
                            statsMap.set(type, []);
                        }
                        statsMap.get(type).push({ report, description: getTypeDescription(type) });
                    });

                    resolve(statsMap);
                });
            });
        }

        return await getRTCStats(peerConnection);
    },
    copyTxt: function (id, content, callback) {
        let that = this;
        document.querySelector("#" + id).setAttribute("data-clipboard-text", content);
        let clipboard = new ClipboardJS('#' + id);
        clipboard.on('success', function (e) {
            e.clearSelection();
            callback && callback();
        });
    },
    getQrCode: function (id, content) {
        const qrcode = new QRCode(id, {
            text: content,   // 二维码内容
            width: 300,
            height: 300,
            colorDark: "#000000",  // 码的颜色
            colorLight: "#ffffff",  // 码的背景色
            correctLevel: QRCode.CorrectLevel.H  // 高度容错
        });
    },
    getOpEventData: function (callback) {
        window.addEventListener('click', function (event) {
            callback("click", event)
        })
        window.addEventListener('contextmenu', function (event) {
            // event.preventDefault();
            callback("contextmenu", event)
        })
        window.addEventListener('mousemove', function (event) {
            callback("mousemove", event)
        })
        window.addEventListener('mousedown', function () {
            callback("mousedown", null)
        })
        window.addEventListener('mouseup', function () {
            callback("mouseup", null)
        })
        window.addEventListener('wheel', function (event) {
            callback("wheel", event)
        })
        window.addEventListener('keydown', function (event) {
            callback("keydown", event)
        })
        window.addEventListener('keyup', function (event) {
            callback("keyup", event)
        })
    },
    getRoomType: function (type){
        if(type === 'file'){
            return "file_room_type"
        }else if(type === 'live'){
            return "live_room_type"
        }else if(type === 'video'){
            return "video_room_type"
        }else if(type === 'screen'){
            return "screen_room_type"
        }else if(type === 'password'){
            return "password_room_type"
        }else if(type === 'audio'){
            return "audio_room_type"
        }else if(type === 'system'){
            return "system_room_type"
        }else{
            return "unknown_room_type"
        }
    },
    scrollToBottom: function (dom, duration, timeout) {
        let start = dom.scrollTop;
        let end = dom.scrollHeight - dom.clientHeight;
        let change = end - start;
        let currentTime = 0;
        let increment = 20;

        function easeOutCubic(t) {
            return (t = t / 1 - 1) * t * t + 1;
        }

        function animateScroll() {
            currentTime += increment;
            let val = easeOutCubic(currentTime / duration) * change + start;
            dom.scrollTop = val;
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            }
        }

        setTimeout(() => {
            animateScroll()
        }, timeout);
    },
    marginToHidden: function (dom, duration, timeout, callback) {
        let change = 100;
        let currentTime = 0;
        let increment = 20;

        function easeOutCubic(t) {
            return (t = t / 1 - 1) * t * t + 1;
        }

        function animateMargin() {
            currentTime += increment;
            let val = easeOutCubic(currentTime / duration) * change;
            dom.style.marginLeft = val + "%";
            if (val === 100) {
                callback()
            }
            if (currentTime < duration) {
                requestAnimationFrame(animateMargin);
            }
        }

        setTimeout(() => {
            animateMargin()
        }, timeout);
    },
    genNickName: function (language) {
        let { adjectives, nouns } = language === 'zh' ? this.nameDatabase() : this.nameDatabaseEn()
        let adjectiveIndex = Math.floor(Math.random() * adjectives.length);
        let nounIndex = Math.floor(Math.random() * nouns.length);
        let adjective = adjectives[adjectiveIndex];
        let noun = nouns[nounIndex];
        let randomNum = Math.floor(Math.random() * 1000);
        return adjective + noun + randomNum;
    },
    nameDatabase: function () {
        const adjectives = [
            "幽默的", "搞笑的", "疯狂的", "奇怪的", "古怪的", "无聊的", "神秘的", "魔幻的", "风趣的", "调皮的",
            "聪明的", "美丽的", "可爱的", "迷人的", "酷的", "萌萌的", "潇洒的", "霸气的", "猛烈的", "光芒的",
            "伶俐的", "俏皮的", "小巧的", "细腻的", "娇嫩的", "柔软的", "亲切的", "朴实的", "拘谨的", "高傲的",
            "自恋的", "浪漫的", "单纯的", "深情的", "执着的", "冷酷的", "刁蛮的", "天真的", "多情的", "成熟的",
            "忧郁的", "神经质的", "孤独的", "怀旧的", "清新的", "淡雅的", "冷艳的", "高冷的", "玩世不恭的", "逆天的",
            "暴躁的", "暴力的", "妩媚的", "狡猾的", "自信的", "自卑的", "悲观的", "乐观的", "勇敢的", "胆小的", "快乐的",
            "痛苦的", "善良的", "邪恶的", "深邃的", "神圣的", "丰满的", "单薄的", "肥胖的", "瘦弱的", "英俊的", "丑陋的",
            "芳香的", "臭气熏天的", "热情的", "冷漠的", "朝气蓬勃的", "干净的", "脏兮兮的", "无忧无虑的", "喜怒无常的",
            "平凡的", "非凡的", "害羞的", "热心的", "机智的", "敏捷的", "迟钝的", "聪慧的", "无知的", "真诚的", "虚伪的",
            "直率的", "谨慎的", "大胆的", "谦虚的", "傲慢的", "严肃的", "轻松的", "紧张的", "勤劳的", "懒惰的", "守时的",
            "迟到的", "坚强的", "软弱的", "聪慧的", "愚笨的", "机灵的", "迟钝的", "淘气的", "乖巧的", "活泼的", "沉默的",
            "健康的", "不健康的", "高大的", "矮小的", "长的", "短的", "胖的", "瘦的", "美满的", "不幸的", "富有的", "贫穷的",
            "快乐的", "不开心的", "甜美的", "苦涩的", "精明的", "愚蠢的", "聪明的", "智商高的", "心灵手巧的", "笨手笨脚的",
            "冷静的", "冲动的", "踏实的", "轻浮的", "温柔的", "粗暴的", "好学的", "讨厌学习的", "好吃的", "不好吃的", "耐心的",
            "急躁的", "友善的", "冷漠的", "豁达的", "固执的", "谨慎的", "善良的", "狠毒的", "平和的", "狂躁的", "机会主义的",
            "悲观的", "乐观的", "心胸开阔的", "偏狭的", "讲义气的", "不守信用的", "有魅力的", "无趣的", "有思想的", "无聊的",
            "谋略深的", "目光短浅的", "善解人意的", "自私的", "坦率的", "虚伪的", "好奇的", "不解风情的", "喜欢交友的",
            "独来独往的", "健谈的", "静默的", "喜欢思考的", "机智幽默的", "情感丰富的", "心地善良的", "充满自信的", "天真烂漫的",
            "追求完美的", "充满活力的", "喜欢冒险的", "充满创造力的", "沉着冷静的", "目标明确的", "性格温和的", "乐于助人的",
            "聪明伶俐的", "重情重义的", "思维敏捷的", "慷慨大方的", "婉约多姿的", "时尚前卫的", "豁达开朗的", "气质高雅的",
            "优雅大方的", "沉静深沉的", "坚韧不拔的", "独立自主的", "外向开朗的", "内向沉默的", "深情专注的", "精力旺盛的",
            "富于幽默的", "心思细腻的", "喜怒形于色的", "忠心耿耿的", "玩世不恭的", "活力四射的", "脚踏实地的", "注重细节的",
            "保守谨慎的", "世故圆滑的", "梦想家的", "勇往直前的", "干练果敢的", "待人友善的", "思想开放的", "敢于挑战的",
            "感性洒脱的", "洒脱不羁的", "自我牺牲的", "处事果断的", "好奇心强的", "待人热情的", "热情洋溢的", "孤独悲伤的",
            "浪漫多情的", "爱笑的", "不羁的", "傻气的", "不拘小节的", "懒散的", "无聊的", "低调的", "敏感的", "冷酷的", "专注的",
            "不屑的", "激情的", "忠诚的", "神秘的", "高傲的", "自由的", "文艺的", "时尚的", "落落大方的", "有才华的", "有气质的",
            "阳光的", "风趣的", "天真浪漫的", "爽朗开朗的", "内敛沉静的", "刻苦努力的", "性格迥异的", "个性张扬的", "脾气火爆的",
            "傲娇的", "爱撒娇的", "心思缜密的", "理智果断的", "懒惰的", "喜欢拖延的", "有责任感的", "追求自由的", "感性的", "理性的",
            "缺乏安全感的", "追求安全感的", "情绪化的", "乐观的", "悲观的", "现实主义的", "理想主义的", "平易近人的", "目中无人的",
            "重视亲情的", "重视友情的", "重视爱情的", "有爱心的", "有正义感的", "有同情心的", "有童心的", "有自信的", "胆小怕事的",
            "爱唠叨的", "话多的", "话少的", "勇于冒险的", "爱挑战的", "善于发现美的", "自我意识强的", "不喜欢被约束的", "慢热型的",
            "热情洋溢的", "容易受伤的", "重视感情的", "善于沟通的", "不善于表达的", "有幽默感的", "平易近人的", "有亲和力的", "脸皮厚的",
            "喜欢交际的", "宅男/宅女的", "喜欢独处的", "有自知之明的", "喜欢音乐的", "喜欢阅读的", "喜欢旅行的", "喜欢美食的", "喜欢运动的",
            "喜欢摄影的", "喜欢收藏的", "喜欢购物的", "不喜欢出门的", "喜欢挑剔的", "喜欢自省的", "不喜欢评价他人的", "喜欢评价他人的",
            "有品位的", "不讲卫生的", "讲究卫生的", "喜欢干净的", "喜欢乱的", "喜欢组织的", "喜欢随意的", "喜欢收纳的"
        ];
        const nouns = [
            '狗子', '猫咪', '小鹿', '小熊', '小兔', '小羊', '小猪', '小马', '小狮子', '小老虎',
            '小猴子', '小鱼儿', '小乌龟', '小鸟儿', '小蚂蚁', '小蜜蜂', '小蝴蝶', '小蜻蜓', '小螃蟹', '小章鱼',
            '小海豚', '小鲨鱼', '小鲸鱼', '小鳄鱼', '小鸭子', '小雪人', '小皮球', '小篮球', '小足球', '小排球',
            '小棒球', '小滑板', '小冰棍', '小雨伞', '小手套', '小电影', '小蓝天', '小公主', '小王子', '小玩具',
            '小糖果', '小巧克力', '小冰淇淋', '小蛋糕', '小披萨', '小汉堡', '小炸鸡', '小烤鸭', '小鱼丸', '小火锅',
            '小串串', '小煎饼', '小油条', '小葱油饼', '小米粥', '小酸奶', '小豆腐', '小饺子', '小包子', '小馄饨',
            '小面条', '小牛肉面', '小糯米鸡', '小蒸饺', '小炒面', '小蒸包', '小烤肉', '小烤串', '小花生米', '小太阳',
            '小月亮', '小星星', '小彩虹', '小风车', '小气球', '小钢琴', '小吉他', '小音响', '小麦克风', '小演员',
            '小画家', '小工程师', '小医生', '小警察', '小消防员', '小司机', '小农民', '小潜水员', '小飞行员', '小篮球',
            '小游泳健将', '小跑步冠军', '小武术高手', '小芭蕾舞者', '小沙画家', '小书法家', '小拼图专家', '小玩具收藏家',
            '小电影制片人', '小太空旅行家', '超级英雄', '无敌大魔王', '终极霸主', '至尊帝王', '天降巨人', '绝世奇才', '神话之门',
            '恐怖怪兽', '魔法使者', '神秘剑客', '不朽传说', '宇宙霸主', '地狱火山', '无尽黑暗', '闪耀之星', '璀璨之光', '金色骑士',
            '毁天灭地', '战无不胜', '碾压一切', '绝世高手', '超凡脱俗', '万象之王', '黑暗骑士', '霸天战神', '万众瞩目', '震古烁今',
            '纵横天下', '永不磨灭', '恒久不变', '帝国之主', '不屈不挠', '狂暴之王', '超越极限', '魔力无边', '星光闪耀', '无尽追求',
            '刀锋之舞', '独步天下', '吞噬万物', '永恒之境', '灭世战神', '海量财富', '神话传说', '唯我独尊', '万剑归宗', '嗜血狂魔',
            '深海之王', '幻想之城', '天命之子'
        ]
        return { adjectives, nouns }
    },
    nameDatabaseEn: function () {
        const adjectives = [
            "Humorous", "Funny", "Crazy", "Strange", "Quirky", "Boring", "Mysterious", "Magical", "Witty", "Playful",
            "Clever", "Beautiful", "Cute", "Charming", "Cool", "Adorable", "Stylish", "Majestic", "Fierce", "Radiant",
            "Clever", "Mischievous", "Tiny", "Delicate", "Tender", "Soft", "Friendly", "Humble", "Reserved", "Proud",
            "Narcissistic", "Romantic", "Innocent", "Passionate", "Persistent", "Cold", "Spoiled", "Naive", "Passionate", "Mature",
            "Melancholic", "Neurotic", "Lonely", "Nostalgic", "Fresh", "Elegant", "Elegant", "Aloof", "Sassy", "Rebellious",
            "Irritable", "Violent", "Alluring", "Crafty", "Confident", "Insecure", "Pessimistic", "Optimistic", "Brave", "Timid", "Joyful",
            "Painful", "Kind", "Evil", "Profound", "Sacred", "Plump", "Slender", "Obese", "Slender", "Handsome", "Ugly",
            "Fragrant", "Stinky", "Passionate", "Indifferent", "Vibrant", "Clean", "Dirty", "Carefree", "Moody",
            "Ordinary", "Extraordinary", "Shy", "Warm-hearted", "Witty", "Agile", "Dull", "Intelligent", "Ignorant", "Sincere", "Hypocritical",
            "Frank", "Cautious", "Bold", "Humble", "Arrogant", "Serious", "Relaxed", "Anxious", "Hardworking", "Lazy", "Punctual",
            "Late", "Strong", "Weak", "Intelligent", "Stupid", "Smart", "Clever", "Mischievous", "Naughty", "Lively", "Silent",
            "Healthy", "Unhealthy", "Tall", "Short", "Long", "Short", "Fat", "Thin", "Happy", "Unhappy", "Sweet", "Bitter",
            "Astute", "Foolish", "Intelligent", "High IQ", "Resourceful", "Clumsy", "Calm", "Impulsive", "Steady", "Frivolous",
            "Gentle", "Rough", "Learner", "Hates Learning", "Eater", "Picky Eater", "Patient", "Impatient", "Friendly", "Aloof", "Tolerant",
            "Stubborn", "Cautious", "Kind", "Malicious", "Calm", "Hysterical", "Opportunistic", "Pessimistic", "Optimistic", "Open-minded", "Narrow-minded",
            "Loyal", "Untrustworthy", "Charming", "Boring", "Thoughtful", "Boring", "Strategic", "Shortsighted", "Understanding", "Selfish", "Frank",
            "Curious", "Insensitive", "Social", "Reclusive", "Talkative", "Quiet", "Thoughtful", "Quick-witted", "Emotionally Rich", "Kind-hearted", "Confident",
            "Innocent", "Pursuing Perfection", "Energetic", "Adventurous", "Creative", "Calm", "Goal-oriented", "Gentle", "Helpful",
            "Smart and Quick-witted", "Loyal", "Quick-witted", "Generous", "Graceful and Multifaceted", "Fashionable", "Easy-going", "Elegant and Graceful",
            "Resilient", "Independent", "Outgoing", "Introverted", "Passionate and Focused", "Energetic", "Humerous", "Thoughtful and Kind", "Sacrificing",
            "Decisive", "Curious", "Warm-hearted", "Enthusiastic", "Lonely and Sad", "Romantic and Passionate", "Smiling", "Unrestrained", "Silly", "Carefree",
            "Lazy", "Boring", "Low-key", "Sensitive", "Cold", "Focused", "Scornful", "Passionate", "Loyal", "Mysterious", "Proud", "Free", "Artistic",
            "Fashionable", "Generous", "Talented", "Elegant", "Sunny", "Witty", "Naive and Romantic", "Cheerful", "Reserved and Calm", "Diligent", "Lazy",
            "Responsible", "Desiring Freedom", "Emotional", "Rational", "Insecure", "Seeking Security", "Emotional", "Optimistic", "Pessimistic", "Realistic", "Idealistic",
            "Approachable", "Arrogant", "Valuing Family", "Valuing Friendship", "Valuing Love", "Compassionate", "Sense of Justice", "Compassionate", "Childlike", "Confident", "Timid",
            "Talkative", "Reserved", "Outgoing", "Introverted", "Curious", "Not Understanding Others", "Sociable", "Loves Being Alone", "Self-aware", "Loves Music", "Loves Reading",
            "Loves Traveling", "Loves Food", "Loves Sports", "Loves Photography", "Loves Collecting", "Loves Shopping", "Hates Going Out", "Picky", "Self-reflective", "Doesn't Judge Others",
            "Judges Others", "Tasteful", "Unhygienic", "Hygienic", "Loves Cleanliness", "Loves Chaos", "Loves Organization", "Loves Casualness", "Loves Tidiness"
          ];
          
          const nouns = [
            'Puppy', 'Kitten', 'Fawn', 'Bear Cub', 'Bunny', 'Lamb', 'Piglet', 'Foal', 'Little Lion', 'Little Tiger',
            'Little Monkey', 'Little Fish', 'Little Turtle', 'Little Bird', 'Little Ant', 'Little Bee', 'Little Butterfly', 'Little Dragonfly', 'Little Crab', 'Little Octopus',
            'Little Dolphin', 'Little Shark', 'Little Whale', 'Little Crocodile', 'Little Duck', 'Snowman', 'Little Ball', 'Little Basketball', 'Little Soccer', 'Little Volleyball',
            'Little Baseball', 'Little Skateboard', 'Little Ice Cream', 'Little Umbrella', 'Little Glove', 'Little Movie', 'Little Blue Sky', 'Little Princess', 'Little Prince', 'Little Toy',
            'Little Candy', 'Little Chocolate', 'Little Ice Cream', 'Little Cake', 'Little Pizza', 'Little Burger', 'Little Fried Chicken', 'Little Roast Duck', 'Little Fish Ball', 'Little Hot Pot',
            'Little Skewer', 'Little Pancake', 'Little Deep-Fried Dough Stick', 'Little Rice Porridge', 'Little Yogurt', 'Little Tofu', 'Little Dumpling', 'Little Bun', 'Little Wonton',
            'Little Noodles', 'Little Beef Noodles', 'Little Glutinous Rice Chicken', 'Little Steamed Dumpling', 'Little Fried Noodles', 'Little Steamed Bun', 'Little Roast Meat', 'Little Skewer', 'Little Peanut', 'Little Sun',
            'Little Moon', 'Little Star', 'Little Rainbow', 'Little Windmill', 'Little Balloon', 'Little Piano', 'Little Guitar', 'Little Speaker', 'Little Microphone', 'Little Actor',
            'Little Painter', 'Little Engineer', 'Little Doctor', 'Little Policeman', 'Little Firefighter', 'Little Driver', 'Little Farmer', 'Little Diver', 'Little Pilot', 'Little Basketball',
            'Little Swimming Champion', 'Little Running Champion', 'Little Martial Arts Expert', 'Little Ballet Dancer', 'Little Sand Painter', 'Little Calligrapher', 'Little Jigsaw Expert', 'Little Toy Collector',
            'Little Movie Producer', 'Little Space Traveler', 'Superhero', 'Invincible Demon King', 'Ultimate Overlord', 'Supreme Emperor', 'Giant from Heaven', 'Peerless Genius', 'Mythical Gate',
            'Terrifying Monster', 'Wizard', 'Mysterious Swordsman', 'Immortal Legend', 'Cosmic Tyrant', 'Volcano of Hell', 'Endless Darkness', 'Shining Star', 'Radiant Light', 'Golden Knight',
            'Doomsday Annihilator', 'Invincible', 'Crushing Everything', 'Peerless Master', 'Extraordinary', 'King of All', 'Dark Knight', 'War God', 'Center of Attention', 'Shocking the World',
            'Domineering', 'Never Wavering', 'Empire Ruler', 'Unyielding', 'Ruthless King', 'Beyond Limits', 'Infinite Power', 'Shining Brightly', 'Endless Pursuit', 'Dance of the Blade',
            'Solo World', 'Consuming Everything', 'Eternal Realm', 'Doomsday War God', 'Vast Wealth', 'Mythical Legend', 'Unrivaled', 'Master of a Thousand Swords', 'Bloodthirsty Demon', 'King of the Deep Sea',
            'Fantasy City', 'Chosen One', 'Immortal Swordsman', 'Eternal Legend', 'Cosmic Overlord', 'Fire Volcano', 'Boundless Darkness', 'Shining Star', 'Infinite Quest', 'Dance of the Blade',
            'Swallower of All Things', 'Eternal War God', 'Massive Fortune', 'Mythical Legend', 'Only One', 'Myriad Swords Return to the Origin', 'Bloodthirsty Madman', 'King of the Deep Sea', 'Fantasy City', 'Chosen One',
            'Immortal Swordsman', 'Eternal Legend', 'Cosmic Overlord', 'Fire Volcano', 'Boundless Darkness', 'Shining Star', 'Infinite Quest', 'Dance of the Blade', 'Swallower of All Things', 'Eternal War God',
            'Massive Fortune', 'Mythical Legend', 'Only One', 'Myriad Swords Return to the Origin', 'Bloodthirsty Madman', 'King of the Deep Sea', 'Fantasy City', 'Chosen One'
          ];
          
        return { adjectives, nouns }
    },
    previewCodeFile: function (options) {
        let { file, max, callback } = options;

        if (file.size > max) {
            return callback(`最大只能预览 ${max / 1024 / 1024}M的文件`);
        }

        let reader = new FileReader();
        reader.onloadend = function () {
            const content = reader.result;
            let lang, html;

            if (file.type === "text/plain") {
                lang = "plaintext";
                html = content;
            } else {
                lang = file.name.split(".").pop();
                if (lang === 'log') { lang = 'txt' }
                html = hljs.highlight(content, { language: lang }).value;
            }

            if (typeof hljs.getLanguage(lang) === "undefined") {
                return callback && callback("预览文件 【" + file.name + "】，【" + file.type + "】格式不支持预览")
            }

            if (window.layer) {
                layer.open({
                    title: file.name,
                    type: 1,
                    content: `
                        <div class="file-preview">
                            <pre><code class="hljs ${lang}">${html}</code></pre>
                        </div>
                    `,
                    area: ["80%", "80%"],
                    success: function (layero, index) {
                        document.querySelector(".layui-layer-content").style.borderRadius = "15px"
                    },
                });
            }

            return callback && callback("预览文件 【" + file.name + "】")
        };

        reader.readAsText(file);
    },
    previewPdfFile: async function (options) {
        let { file, max, callback } = options;

        if (file.size > max) {
            return callback(`最大只能预览 ${max / 1024 / 1024}M的文件`)
        }

        layer.open({
            type: 1,
            area: ["80%", "80%"],
            title: file.name,
            content: `  <div id="tl-rtc-file-pdf-container" style="height: 100%;"> </div> `,
            success: function (layero, index) {
                document.querySelector(".layui-layer-content").style.borderRadius = "15px"
                try {
                    let fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.js';
                        pdfjsLib.getDocument(e.target.result).promise.then(async function (pdf) {
                            function renderPage(numPages, num) {
                                if (num - 1 >= numPages) {
                                    return callback && callback("pdf加载渲染完毕")
                                }
                                pdf.getPage(num).then(function (page) {
                                    const viewport = page.getViewport({ scale: 1.5 });
                                    const canvas = document.createElement('canvas');
                                    let pdfDom = document.getElementById("tl-rtc-file-pdf-container");
                                    if (pdfDom) {
                                        pdfDom.appendChild(canvas);
                                        canvas.setAttribute("style", "height: auto; width: 100%;")
                                        canvas.height = viewport.height;
                                        canvas.width = viewport.width;

                                        page.render({
                                            canvasContext: canvas.getContext('2d'),
                                            viewport: viewport
                                        }).promise.then(function (e) {
                                            let dom = document.querySelector(".layui-layer-title");
                                            if (dom) {
                                                dom.innerText = `共${numPages}页 - 已渲染${num}页`;
                                            }
                                            renderPage(numPages, num + 1)
                                        });
                                    }
                                })
                            }
                            renderPage(pdf.numPages, 1)
                        });
                    }
                    fileReader.readAsDataURL(file);
                } catch (e) {
                    return callback && callback("加载预览pdf资源失败");
                }
            }
        });
    },
    previewWordFile: function (options) {
        let { file, max, callback } = options;

        if (file.size > max) {
            return callback(`最大只能预览 ${max / 1024 / 1024}M的文件`)
        }

        layer.open({
            type: 1,
            content: `
                <div style="width:100%;height:100%;" id="tl-rtc-file-word"></div>
            `,
            area: ["80%", "80%"],
            title: file.name,
            success: function (layero, index) {
                document.querySelector(".layui-layer-content").style.borderRadius = "15px"
                let reader = new FileReader();
                reader.onload = function (event) {
                    let blob = new Blob([event.target.result], { type: file.type });
                    docx.renderAsync(blob, document.getElementById("tl-rtc-file-word"))
                };
                reader.readAsArrayBuffer(file);
            },
        });
    },
    previewExcelFile: function (options) {
        let { file, max, callback } = options;

        if (file.size > max) {
            return callback(`最大只能预览 ${max / 1024 / 1024}M的文件`)
        }

        // 创建iframe元素
        let iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "100%";

        // 把iframe加入到弹窗的内容区域中
        let content = document.createElement("div");
        content.style.width = "100%";
        content.style.height = "100%";
        content.appendChild(iframe);

        layer.open({
            type: 1,
            content,
            area: ["80%"],
            title: file.name,
            success: function (layero, index) {
                document.querySelector(".layui-layer-content").style.borderRadius = "15px"
                Office.initialize = function () {
                    Excel.run(iframe, function (context) {
                        context.workbook.worksheets.getActiveWorksheet().getRange().format.autofitColumns();
                        context.workbook.worksheets.getActiveWorksheet().getRange().format.autofitRows();
                        context.workbook.worksheets.getActiveWorksheet().getRange().format.horizontalAlignment = "Center";
                        context.workbook.worksheets.getActiveWorksheet().getRange().format.verticalAlignment = "Center";
                        context.workbook.worksheets.getActiveWorksheet().getRange().values = [[file.name]];
                        return context.sync();
                    });
                };
            },
        });
    },
    previewImageFile: function (options) {
        let { file, max, callback } = options;

        if (file.size > max) {
            return callback(`最大只能预览 ${max / 1024 / 1024}M的文件`)
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            let img = new Image();
            img.src = reader.result;
            img.onload = function () {
                layer.open({
                    title: file.name,
                    type: 1,
                    shadeClose: true,
                    area: [`65%`],
                    content: `
                        <div style="display: flex; justify-content: center; align-items: center;">
                            <img src="${reader.result}" style="max-width: 98%; max-height: 98%;  margin-left: 1%;  margin-top: 1%;">
                        </div>
                    `,
                    success: function () {
                        document.querySelector(".layui-layer-content").style.borderRadius = "15px";
                    }
                });
            };
        };
    }
}