
const notify = require("./notify");
const utils = require("./../../utils/utils");

/**
 * 发送公共频道聊天通知
 * @param {*} data 
 */
function sendChatingNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `消息体ID: ${data.msgRecoderId}\n` +
        `发送方ID: ${data.socketId}\n` +
        `文本内容: ${decodeURIComponent(data.msg)}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送开始发送文件通知
 * @param {*} data 
 */
function sendFileInfoNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `发送方ID: ${data.from}\n` +
        `文件名称: ${data.name}\n` +
        `文件类型: ${data.type}\n` +
        `文件大小: ${data.size} == (${data.size / 1024 / 1024}M)\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送文件发送完毕通知
 * @param {*} data 
 */
function sendFileDoneNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `发送方ID: ${data.from}\n` +
        `接收方ID: ${data.to}\n` +
        `文件名称: ${data.name}\n` +
        `文件类型: ${data.type}\n` +
        `文件大小: ${data.size} == (${data.size / 1024 / 1024}M)\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送文本内容通知
 * @param {*} data 
 */
function sendTxtNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `发送方ID: ${data.from}\n` +
        `文本内容: ${decodeURIComponent(data.content)}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送开始录屏通知
 * @param {*} data 
 */
function sendStartScreenNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送停止录屏通知
 * @param {*} data 
 */
function sendStopScreenNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `录屏时长: ${data.cost}秒\n` +
        `录屏大小: ${data.size} == (${data.size / 1024 / 1024}M)\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送开始屏幕共享通知
 * @param {*} data 
 */
function sendStartScreenShareNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送停止屏幕共享通知
 * @param {*} data 
 */
function sendStopScreenShareNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `共享时长: ${data.cost}秒\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送开始音视频通话通知
 * @param {*} data 
 */
function sendStartVideoShareNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送停止音视频通话通知
 * @param {*} data 
 */
function sendStopVideoShareNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `通话时长: ${data.cost}秒\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送取件码通知
 * @param {*} data 
 */
function sendCodeFileNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `取件码ID: ${data.codeId}秒\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送openai聊天通知
 * @param {*} data 
 */
function sendOpenaiChatNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `KEYS状态: ${data.keys}\n` +
        `聊天内容: ${data.content}\n` +
        `回复内容: ${data.answer}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送意见反馈通知
 * @param {*} data 
 */
function sendBugNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>\n` +
        `反馈内容: ${data.msg}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送管理后台登录失败通知
 * @param {*} data 
 */
function sendManageLoginFailedNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `访问密码: ${data.value}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送管理后台登录成功通知
 * @param {*} data 
 */
function sendManageLoginSuccessNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `访问密码: ${data.value}\n` +
        `TOKEN: ${data.token}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送管理后台修改配置通知
 * @param {*} data 
 */
function sendManageUpdateInfoNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `修改内容: ${data.content}\n` +
        `TOKEN: ${data.token}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送管理后台非法修改配置通知
 * @param {*} data 
 */
function sendManageUpdateFailedNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `修改内容: ${data.content}\n` +
        `TOKEN: ${data.token}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 发送创建/加入房间通知
 * @param {*} data 
 */
function sendCreateJoinRoomNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `连接方ID: ${data.socketId}\n` +
        `房间密码: ${data.password}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}


/**
 * 退出房间通知
 * @param {*} data 
 */
function sendExitRoomNotify(data) {
    let notifyMsg = `## <font color='info'>文件传输通知</font> - <font color="warning">${data.title}</font>` +
        ` - <font color="comment">${data.room}</font>\n` +
        `库记录ID: ${data.recoderId}\n` +
        `连接方ID: ${data.socketId}\n` +
        `当前时间: ${utils.formateDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")}\n` +
        `访问IP: ${data.ip}\n` +
        `访问设备: ${data.userAgent}\n`;
    notify.requestMsg(notifyMsg)
}




module.exports = {
    sendExitRoomNotify,
    sendCreateJoinRoomNotify,
    sendManageUpdateFailedNotify,
    sendManageUpdateInfoNotify,
    sendManageLoginSuccessNotify,
    sendManageLoginFailedNotify,
    sendBugNotify,
    sendStopScreenNotify,
    sendStartScreenNotify,
    sendStopScreenShareNotify,
    sendStartScreenShareNotify,
    sendStopVideoShareNotify,
    sendStartVideoShareNotify,
    sendTxtNotify,
    sendCodeFileNotify,
    sendFileDoneNotify,
    sendFileInfoNotify,
    sendChatingNotify,
    sendOpenaiChatNotify
}