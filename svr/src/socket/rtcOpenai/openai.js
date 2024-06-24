const daoDog = require("./../../dao/dog/dog")
const bussinessNotify = require("./../../bussiness/notify/notifyHandler")
const rtcCommData = require("./../rtcCommData/commData");
const utils = require("./../../utils/utils");
const bussinessOpenai = require("./../../bussiness/openai/openai")
const rtcConstant = require("../rtcConstant");
const rtcClientEvent = rtcConstant.rtcClientEvent
const check = require("../../bussiness/check/content");
const daoRelation = require("../../dao/relation/relation");

/**
 * ai聊天
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} tables 数据表对象
 * @param {*} dbClient sequelize-orm对象
 * @param {*} data event参数
 * @returns 
 */
async function openai(io, socket, tables, dbClient, data){
    try{
        let cacheSwitchData = rtcCommData.getCacheSwitchData()

        if(!cacheSwitchData.openAiChat){
            socket.emit(rtcClientEvent.tips, {
                room: data.room,
                to: socket.id,
                msg: "当前功能已暂时关闭，有问题可以加群交流"
            });
            return
        }

        let {roomId = "10086", content, value} = data;
        if(value){
            value = value.substr(0, 1000)
        }

        data.content = check.contentFilter(data.content);
        data.value = check.contentFilter(data.value);

        // 有上下文，结合上下文
        if(content){
            content = content.substr(0, 5000);
            content += "。\n，假定以上的内容是提问者和你的对话，结合上面的语境回答下面的问题，并且注意如果提问内容或者你的回答内容涉及政治，请回复 “我已经被设置关闭涉政问答功能”。提问内容为 : "+value;
        }else{
            // 没有就默认
            content = value;
        }

        let {handshake, userAgent, ip} = utils.getSocketClientInfo(socket);
        
        data.time = new Date().toLocaleString()
        data.type = "openai";
        data.content = await bussinessOpenai.openaiChat(content, roomId);
        data.value = "";

        let to = socket.id;
        let otherSocket = io.sockets.connected[to];
        if(otherSocket){
            otherSocket.emit(rtcClientEvent.openaiAnswer, data);
        }

        let recoderId = await daoDog.addDogData({
            name: "ChatGPT聊天",
            roomId: roomId,
            socketId: data.socketId,
            device: userAgent,
            flag: 0,
            content: utils.unescapeStr(data.content),
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

        bussinessNotify.sendOpenaiChatNotify({
            title: "ChatGPT聊天",
            room: roomId,
            keys : JSON.stringify(bussinessOpenai.apiKeysStatus()),
            content: content,
            answer : data.content,
            userAgent: userAgent,
            ip: ip
        })
        
    }catch(e){
        utils.tlConsole(e)
        socket.emit("tips", {
            room: data.room,
            to: socket.id,
            msg: "系统错误"
        });
        bussinessNotify.sendSystemErrorMsg({
            title: "socket-openai",
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
    openai
}