const daoDog = require("./../../dao/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const utils = require("./../../utils/utils");
const rtcConstant = require("../rtcConstant");
const rtcServerMessageEvent = rtcConstant.rtcServerMessageEvent
const check = require("../../bussiness/check/content");
const daoRelation = require("./../../dao/relation/relation")

let rtcEventOpName = {
    "sendFileInfo": "准备发送文件",
    "sendDone": "文件发送完毕",
    "sendBugs": "收到问题反馈",
    "startScreen": "开始网页录屏",
    "stopScreen": "停止网页录屏",
    "startScreenShare": "开始屏幕共享",
    "stopScreenShare": "停止屏幕共享",
    "startVideoShare": "开始音视频通话",
    "stopVideoShare": "停止音视频通话",
    "startAudioShare": "开始语音连麦",
    "stopAudioShare": "停止语音连麦",
    "startLiveShare": "开启直播",
    "stopLiveShare": "关闭直播",
    "startRemoteDraw": "开启远程画笔",
    "stopRemoteDraw": "关闭远程画笔",
}

/**
 * 公共模板广播消息
 * 指定了to : 就会发送给指定的用户
 * 没有指定to : 广播给除了自己外的房间内的所有用户
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function message(io, socket, tables, dbClient, data){
    try {
        let {emitType, room, from, to, liveShareMode = '', liveShareRole = ''} = data;

        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);

        if (emitType === rtcServerMessageEvent.sendFileInfo) {
            data.name = check.contentFilter(data.name);
            bussinessNotify.sendFileInfoNotify({
                title: rtcEventOpName.sendFileInfo,
                room: data.room,
                recoderId: data.recoderId,
                from: data.from,
                name: data.name,
                type: data.type,
                size: data.size,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === rtcServerMessageEvent.sendDone) {
            data.name = check.contentFilter(data.name);
            bussinessNotify.sendFileDoneNotify({
                title: rtcEventOpName.sendDone,
                room: data.room,
                to: data.to,
                from: data.from,
                name: data.name,
                type: data.type,
                size: data.size,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === rtcServerMessageEvent.sendBugs) {
            bussinessNotify.sendBugNotify({
                title: rtcEventOpName.sendBugs,
                room: data.room,
                msg: data.msg,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === rtcServerMessageEvent.startScreen) {
            bussinessNotify.sendStartScreenNotify({
                title: rtcEventOpName.startScreen,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === rtcServerMessageEvent.stopScreen) {
            bussinessNotify.sendStopScreenNotify({
                title: rtcEventOpName.stopScreen,
                userAgent: data.userAgent,
                cost: data.cost,
                size: data.size,
                userAgent: userAgent,
                ip: ip
            })
        }

        if (emitType === rtcServerMessageEvent.startScreenShare) {
            bussinessNotify.sendStartScreenShareNotify({
                title: rtcEventOpName.startScreenShare,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.stopScreenShare) {
            bussinessNotify.sendStopScreenShareNotify({
                title: rtcEventOpName.stopScreenShare,
                userAgent: data.userAgent,
                cost: data.cost,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.startVideoShare) {
            bussinessNotify.sendStartVideoShareNotify({
                title: rtcEventOpName.startVideoShare,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.stopVideoShare) {
            bussinessNotify.sendStopVideoShareNotify({
                title: rtcEventOpName.stopVideoShare,
                userAgent: data.userAgent,
                cost: data.cost,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.startAudioShare) {
            bussinessNotify.sendStartAudioShareNotify({
                title: rtcEventOpName.startAudioShare,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.stopAudioShare) {
            bussinessNotify.sendStopAudioShareNotify({
                title: rtcEventOpName.stopAudioShare,
                userAgent: data.userAgent,
                cost: data.cost,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.startLiveShare) {
            bussinessNotify.sendStartLiveShareNotify({
                title: rtcEventOpName.startLiveShare,
                liveShareMode : liveShareMode,
                liveShareRole : liveShareRole,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.stopLiveShare) {
            bussinessNotify.sendStopLiveShareNotify({
                title: rtcEventOpName.stopLiveShare,
                userAgent: data.userAgent,
                liveShareMode : liveShareMode,
                liveShareRole : liveShareRole,
                cost: data.cost,
                userAgent: userAgent,
                ip: ip,
                room: data.room
            })
        }

        if (emitType === rtcServerMessageEvent.startRemoteDraw) {
            bussinessNotify.sendStartRemoteDrawNotify({
                title: rtcEventOpName.startRemoteDraw,
                userAgent: userAgent,
                ip: ip,
                room: data.room,
            })
        }

        if (emitType === rtcServerMessageEvent.stopRemoteDraw) {
            bussinessNotify.sendStopRemoteDrawNotify({
                title: rtcEventOpName.stopRemoteDraw,
                userAgent: data.userAgent,
                userAgent: userAgent,
                ip: ip,
                room: data.room,
                drawCount : data.drawCount
            })
        }

        if (rtcEventOpName[emitType]) {
            let recoderId = await daoDog.addDogData({
                name: rtcEventOpName[emitType],
                roomId: room || "",
                socketId: "",
                device: userAgent,
                flag: 0,
                content: JSON.stringify(data),
                handshake: JSON.stringify(handshake),
                ip: ip
            }, tables, dbClient);

            //添加用户-操作关联记录
            if(socket.userId){
                daoRelation.addUserDogRelation({
                    dogId : recoderId,
                    userId : socket.userId,
                }, tables, dbClient);
            }
        }

        // 指定发送
        if(to && to !== ''){
            let toOtherSocket = io.sockets.connected[to];
            if(toOtherSocket){
                toOtherSocket.emit(emitType, data);
            }
            return
        }

        // 没指定，走广播（除了自己）
        let clientsInRoom = io.sockets.adapter.rooms[room];
        if (!clientsInRoom) {
            return
        }
        let otherSocketIds = Object.keys(clientsInRoom.sockets);
        for (let i = 0; i < otherSocketIds.length; i++) {
            if(from === otherSocketIds[i]){ //跳过自己
                continue;
            }
            let otherSocket = io.sockets.connected[otherSocketIds[i]];
            if(!otherSocket){
                continue;
            }
            otherSocket.emit(emitType, data);
        }

    } catch (e) {
        utils.tlConsole(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-message",
            data: JSON.stringify(data),
            room: data.room,
            from : socket.id,
            msg : JSON.stringify({
                message: e.message,
                fileName: e.fileName,
                lineNumber: e.lineNumber,
                stack: e.stack,
                name: e.name
            }, null, '\t')
        })
    }
}

module.exports = {
    message
}