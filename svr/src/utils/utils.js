const os = require('os');
const { inject_env_config } = require('./../../conf/env_config');
const cfg = inject_env_config(require('./../../conf/cfg.json'));
const crypto = require('crypto');

/**
 * 获取本机ip
 * @returns 
 */
function getLocalIP() {
    const osType = os.type(); //系统类型
    const netInfo = os.networkInterfaces(); //网络信息
    let ip = '';
    if (osType === 'Windows_NT') {
        for (let dev in netInfo) {
            //win7的网络信息中显示为本地连接，win10显示为以太网
            if (dev === '本地连接' || dev === '以太网') {
                for (let j = 0; j < netInfo[dev].length; j++) {
                    if (netInfo[dev][j].family === 'IPv4') {
                        ip = netInfo[dev][j].address;
                        break;
                    }
                }
            }
        }

    } else if (osType === 'Linux') {
        for (let dev in netInfo) {
            let iface = netInfo[dev];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }

    return ip;
}

/**
 *  检查两个IP地址是否在同一个子网内
 * @param {*} ip1 
 * @param {*} ip2 
 * @param {*} subnetMask 
 * @returns 
 */
function isSameSubnet(ip1, ip2, subnetMask) {
    // 将IPv4或IPv6地址和子网掩码转换为数字形式
    function ipToNumber(ip) {
        if (ip.indexOf(':') > -1) { // IPv6
            const parts = ip.split(':');
            return parts.map(part => parseInt(part, 16)).join('');
        } else { // IPv4
            const parts = ip.split('.');
            return (parseInt(parts[0]) << 24) |
                (parseInt(parts[1]) << 16) |
                (parseInt(parts[2]) << 8) |
                parseInt(parts[3]);
        }
    }

    // 检查第一个IP和第二个IP是否在同一个子网内
    const ip1Number = ipToNumber(ip1);
    const ip2Number = ipToNumber(ip2);
    const subnetMaskNumber = ipToNumber(subnetMask);

    return (ip1Number & subnetMaskNumber) === (ip2Number & subnetMaskNumber);
}

/**
 * 获取请求的ip
 * @param {*} request 
 * @returns 
 */
function getClientIP(request) {
    let ip = request.headers['x-forwarded-for'] ||
        request.ip ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;

    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }

    ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
    return ip;
}

/**
 * 生成随机数
 * @param {*} req 
 * @returns 
 */
function genFlow(req) {
    return num = Math.floor(Math.random(100000000) * 100000000 + 1);
}

/**
 * 生成随机数
 * @param {*} req 
 * @returns 
 */
function genRoom(req) {
    return num = Math.floor(Math.random(100000000) * 100000000 + 1);
}

/**
 * 格式化时间
 * @param {*} time 
 * @param {*} format 
 * @returns 
 */
function formateDateTime(time, format) {
    let o = {
        'M+': time.getMonth() + 1, // 月份
        'd+': time.getDate(), // 日
        'h+': time.getHours(), // 小时
        'm+': time.getMinutes(), // 分
        's+': time.getSeconds(), // 秒
        'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
        S: time.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + '').substring(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length));
        }
    }
    return format;
}

/**
 * 获取当前时间下一天
 * @param {*} time 
 * @returns 
 */
function getNextDay(time) {
    let date = new Date(time);
    date.setDate(date.getDate() + 1);
    let y = date.getFullYear();
    let m = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return y + "-" + m + "-" + d;
}

/**
 * 获取socket中的请求客户端信息
 * @param {*} socket 
 * @returns 
 */
function getSocketClientInfo(socket){
    let handshake = socket.handshake
    
    let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);

    let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];
    ip = ip.indexOf(":") > -1 ? ip.split(":")[0] : ip;

    let address = socket.handshake.address;
    address = address.length > 7 ? address.substr(7, address.length) : address;

    return {
        handshake, userAgent, ip, address
    }
}

/**
 * 转换文件大小
 * @param {*} size 
 * @returns 
 */
function getFileSizeStr(size) {
    let sizeStr = (size / 1048576).toString();
    let head = sizeStr.split(".")[0];
    let tail = "";
    if (sizeStr.split(".")[1]) {
        tail = sizeStr.split(".")[1].substring(0, 3);
    }
    return head + '.' + tail + "M";
}

function tlConsole(...msg){
    console.log(`\x1B[1m${new Date().toLocaleString()}\x1B[0m \x1B[40m\x1B[33m tl-rtc-file-${cfg.version} \x1B[0m : \x1B[36m%s\x1B[0m`,...msg)
}

function tlConsoleIcon(){
    const icon = `
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
 .   .          .            .-.   .     
_|_  |         _|_           |  o  |        
 .   |  ___ .--.|   .-. ___ -|- .  |  .-.   tl-rtc-file-${cfg.version}
 |   |      |   |  [         |  |  | [.-'   Copyright (c) 2023 tl-open-source
 [._ |      |   [_  ._.      |  |  | [._.   MIT License
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
`;
    console.log(icon);
}


/**
 * 生成客户端控制台打印logo
 */
function genClientLogo(){
    let style = "font-size:20px;color: black; font-style: italic;";
    style += "font-weight: bold; font-family: system-ui;";
    style += "padding: 8px;cursor: pointer;"
    return style;
}


/**
 * 生成turn服务的iceServers配置
 * @param {*} withTurn 
 * @param {*} useSecret
 * @param {*} username 
 * @returns 
 */
function genTurnServerIceServersConfig(withTurn, useSecret, username){
    let iceServers = [{
        urls : cfg.webrtc.stun.host
    }];

    //无需turn中继
    if(!withTurn){
        return iceServers;
    }

    //turn固定账号模式
    if(!useSecret){
        iceServers.push({
            urls : cfg.webrtc.turn.host,
            username: cfg.webrtc.turn.username,
            credential: cfg.webrtc.turn.credential
        })
        return iceServers;
    }

    // 有效账号模式
    const secret = cfg.webrtc.turn.secret;
    //生成账号的有效期
    const expirseTime = cfg.webrtc.turn.expire;
    //当前时间
    const time = new Date().getTime();
    //turn服务的用户名规则
    const turnUsername = `${time + expirseTime}:${username}`;
    //turn服务的密码规则
    const dig = crypto.createHmac('sha1', secret).update(turnUsername).digest();
    const turnPassword = Buffer.from(dig, 'utf-8').toString('base64');

    iceServers.push({
        urls : cfg.webrtc.turn.host,
        username: turnUsername,
        credential: turnPassword,
    })

    return iceServers;
}

/**
 * 转义字符串
 * @param {*} str 
 * @returns 
 */
function escapeStr(str) {
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
}

/**
 * 解析转义字符串
 * @param {*} str 
 * @returns 
 */
function unescapeStr(str) {
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
}

/**
 *  根据socketid加密websocket数据
 * @param {*} socketId 
 * @param {*} data 
 * @returns 
 */
function encryptSocketData(socketId, data){
    const key = "tl-rtc-file";
    const iv = socketId.substring(0, 16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

/**
 * 根据socketid解密websocket数据
 * @param {*} socketId 
 * @param {*} data 
 * @returns 
 */
function decryptSocketData(socketId, data){
    const key = "tl-rtc-file";
    const iv = socketId.substring(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

/**
 *  根据flag和bit获取对应的值
 * @param {*} flag 
 * @param {*} bit 
 */
function checkBit(flag, bit){
    return (flag & bit) === bit;
}

/**
 * 根据flag和bit设置对应的值
 * @param {*} flag 
 * @param {*} bit 
 */
function setBit(flag, bit){
    return flag | bit;
}



module.exports = {
    getLocalIP,
    getClientIP,
    genFlow,
    genRoom,
    formateDateTime,
    getNextDay,
    getSocketClientInfo,
    getFileSizeStr,
    tlConsole,
    tlConsoleIcon,
    genTurnServerIceServersConfig,
    genClientLogo,
    unescapeStr,
    escapeStr,
    isSameSubnet,
    checkBit,
    setBit
}