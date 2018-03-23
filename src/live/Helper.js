/* globals ModuleStore,ModuleLogger */
if(window.Helper !== undefined) throw Error('Not Error!');
window.Helper = {
    // DOM: {},
    userInfo: {},
    showID: location.pathname.substr(1),

    addScriptByFile(path) {
        let scriptDom = $('<script>').attr('src', chrome.extension.getURL(path));
        $('head').append(scriptDom);
        return scriptDom;
    },
    addScriptByText(script) {
        let scriptDom = $('<script>').text(script);
        $('head').append(scriptDom);
        return scriptDom;
    },

    addStylesheetByFile(path) {
        let linkDom = $('<link>').attr('rel', 'stylesheet').attr('href', chrome.extension.getURL(path));
        $('head').append(linkDom);
        return linkDom;
    },
    addStylesheetByText(style) {
        let styleDom = $('<style>').attr('type', 'text/css').text(style);
        $('head').append(styleDom);
        return styleDom;
    },

    getRoomID(showID) {
        return new Promise(resolve => {
            let rid = ModuleStore.getRoomID(showID);
            if(rid) {
                resolve(rid);
                return;
            }
            $.getJSON('//api.live.bilibili.com/room/v1/Room/room_init', {id: showID}).done(r => {
                switch(r.code) {
                    case 0:
                        rid = r.data.room_id;
                        ModuleStore.addRoomID(showID, rid);
                        break;
                    case 1: //房间不存在
                        break;
                    default:
                        ModuleLogger.printUntreated(r);
                        break;
                }
                resolve(rid);
            }).fail(() => resolve(0));
        });
    },
    getUserInfo() {
        return new Promise(resolve => {
            $.getJSON('//api.live.bilibili.com/live_user/v1/UserInfo/get_info_in_room', {roomid: '1'}).done(r => {
                switch(r.code) {
                    case 0:
                        Helper.userInfo.isVIP = Number.parseInt(r.data.level.vip) == 1;
                        Helper.userInfo.isSVIP = Number.parseInt(r.data.level.svip) == 1;
                        Helper.userInfo.userLevel = r.data.level.user_level;
                        Helper.userInfo.uid = r.data.info.uid;
                        Helper.userInfo.username = r.data.info.uname;
                        Helper.userInfo.identification = Number.parseInt(r.data.info.identification) == 1;
                        Helper.userInfo.mobileVerify = Number.parseInt(r.data.info.mobile_verify) == 1;
                        break;
                    case 3: //未登录
                        Helper.userInfo.noLogin = true;
                        break;
                    default:
                        ModuleLogger.printUntreated(r);
                        break;
                }
                resolve();
            });
        });
    },

    format(template, data) {
        if(!data) return template;
        let keys = Object.keys(data);
        let dataList = keys.map(key => data[key]);
        return new Function(keys.join(','), 'return `' + template + '`;').apply(null, dataList); //jshint ignore:line
    }
};

// Helper.escape = string => {
//     return string.replace(/([\\'"&])+?/g, '\\$1');
// };
// Helper.localize = {//TODO 重构 去除不必要文本
//     helper: '哔哩哔哩助手',
//     enabled: '已启用',
//     noLogin: '未登录',
//     noPhone: '未绑定手机',
//     exist: '已在直播间${showID}启动',
//     sign: {
//         title: '自动签到',
//         action: {
//             award: '签到成功, 获得${award}',
//             signed: '今日已签到',
//         }
//     },
//     treasure: {
//         title: '自动领瓜子',
//         action: {
//             award: '已领取${award}瓜子',
//             totalSilver: '总瓜子:${silver}',
//             end: '领取完毕',
//         }
//     },
//     smallTV: {
//         title: '自动小电视',
//         action: {
//             award: '获得${awardName}x${awardNumber} RaffleID:${raffleID} RoomID:${roomID}',
//         }
//     },
//     activity: {
//         title: '活动抽奖',
//         action: {
//             award: '获得${awardName}x${awardNumber} RaffleID:${raffleID} RoomID:${roomID}',
//         }
//     }
// };

Helper.countdown = function(time, callback, element) {
    if(!time || (!(time instanceof Date) && isNaN(time))) {
        ModuleLogger.error('时间设置错误!');
        return;
    }
    if(!(this instanceof Helper.countdown)) return new Helper.countdown(time, callback, element);
    if(!isNaN(time)) {
        let _time = new Date();
        _time.setMilliseconds(_time.getMilliseconds() + time * 1000);
        time = _time;
    }
    let countdown = setInterval(() => {
        let _time = Math.round((time.getTime() - new Date().getTime()) / 1000);
        if(element instanceof jQuery) {
            let min = Math.floor(_time / 60);
            let sec = Math.floor(_time % 60);
            min = min < 10 ? '0' + min : min;
            sec = sec < 10 ? '0' + sec : sec;
            element.text(min + ':' + sec);
        }
        if(_time <= 0) {
            clearInterval(countdown);
            if(typeof callback == 'function') callback();
        }
    }, 100);
    this.countdown = countdown;
};
Helper.countdown.prototype.clearCountdown = function() {
    clearInterval(this.countdown);
};

Helper.timer = function(ms, callback) {
    if(!ms || isNaN(ms)) {
        ModuleLogger.error('时间设置错误!');
        return;
    }
    if(!(this instanceof Helper.timer)) return new Helper.timer(ms, callback);
    this.timer = setInterval(() => {
        if(typeof callback == 'function') callback();
    }, ms);
    if(typeof callback == 'function') callback();
};
Helper.timer.prototype.clearTimer = function() {
    clearInterval(this.timer);
};

Helper.sendMessage = (msg, callback) => chrome.runtime.sendMessage(msg, response => typeof callback == 'function' && callback(response));
Helper.getMessage = callback => chrome.runtime.onMessage.addListener((request, sender, sendResponse) => callback(request, sender, sendResponse));

$.fn.stopPropagation = function() {return this.on('click', e => e.stopPropagation());};
// $.fn.getTop = function() {return !this.parent().is('body') ? this[0].offsetTop + this.parent().getTop() : 0;};
// $.fn.getLeft = function() {return !this.parent().is('body') ? this[0].offsetLeft + this.parent().getLeft() : 0;};
