/* globals store */
class ModuleStore {
    static init() {
        this.storage = {
            get(key) {
                return JSON.parse(window.localStorage.getItem(`MGH_${key}`));
            },
            set(key, value) {
                window.localStorage.setItem(`MGH_${key}`, JSON.stringify(value));
            },
            del(key) {
                window.localStorage.removeItem(`MGH_${key}`);
            },
        };

        if(!this.storage.get('Version')) this.storage.set('Version', 1); //储存信息版本
        if(!this.storage.get('NoticeVersion')) this.storage.set('NoticeVersion', 0); //通知版本
        if(!this.storage.get('RoomIDs')) this.storage.set('RoomIDs', {}); //房间号


        // !store.get('BH_SignDate') && store.set('BH_SignDate', '1970/1/1');
        // !store.get('BH_TreasureDate') && store.set('BH_TreasureDate', '1970/1/1');
        // !store.get('BH_SmallTVStatInfo') && store.set('BH_SmallTVStatInfo', {});
        // !store.get('BH_SmallTVTimes') && store.set('BH_SmallTVTimes', 0);
        // !store.get('BH_SchoolTimes') && store.set('BH_SchoolTimes', 0);
        // !store.get('BH_HideSetting') && store.set('BH_HideSetting', {});

        //store.get('BH_SmallTVCount') !== undefined && store.set('BH_SmallTVTimes', store.get('BH_SmallTVTimes') + store.get('BH_SmallTVCount')) && store.remove('BH_SmallTVCount');



        // this.list = {
        //     'smallTV': 'BH_SmallTV',
        //     'school': 'BH_School',
        //     'summer': 'BH_Summer',
        //     'lighten': 'BH_Lighten',
        // };
    }

    static getRoomID(showID) {
        let room_ids = this.storage.get('RoomIDs');
        return room_ids === null ? 0 : room_ids[showID] || 0;
    }
    static addRoomID(showID, roomID) {
        if(Number.isInteger(roomID) === 0) return;
        let room_ids = this.storage.get('RoomIDs');
        room_ids[showID] = roomID;
        this.storage.set('RoomIDs', room_ids);
    }

    static sign(key) {//TODO 删除
        switch(key) {
            case 'get':
                return store.get('BH_SignDate') == new Date().toLocaleDateString();
            case 'set':
                store.set('BH_SignDate', new Date().toLocaleDateString());
                break;
        }
    }

    static treasure(key) {//TODO 删除
        switch(key) {
            case 'getEnd':
                return store.get('BH_TreasureDate') == new Date().toLocaleDateString();
            case 'end':
                store.set('BH_TreasureDate', new Date().toLocaleDateString());
                break;
        }
    }

    static addTimes(key, number) {
        // key = this.list[key] + 'Times';
        // store.set(key, store.get(key) + number);
    }
    static getTimes(key) {
        // key = this.list[key] + 'Times';
        // return store.get(key) || 0;
    }

    static addStatinfo(key, awardKey, number) {
        // key = this.list[key] + 'StatInfo';
        // let statInfo = store.get(key);
        // statInfo[awardKey] = (statInfo[awardKey] || 0) + number;
        // store.set(key, statInfo);
    }
    static getStatinfo(key) {
        // key = this.list[key] + 'StatInfo';
        // return store.get(key) || [];
    }
}
