// @ts-ignore
import i18n from '@/localization';
// PDPDRB 机器人
// PDPDBX 箱子

const mockEuips = [
    {
        id: 'Eq990999000718cec97ddd3d4a44ae5ba6a643317d6f',
        name: '3#-AHU-2F-1',
        localId: '6178020',
        localName: '机器人1',
        objType: 'equipment',
        classCode: 'PDPDRB',
        valid: true,
        floorId: 'Fl61011220101bc101e0978941c68884a1eacaccf322',
        bimId: 'Pj9909990007Fl6101122010ad1a51a218e84041b046bd331139a9d5:6178020',
        bluetoothSignCalLocation: '(40371,101835)',
        controlled: true
    },
    {
        id: 'Eq990999000754f2bf7fe2bc4657855e3e542f708f80',
        name: '3#-AHU-1F-1',
        localId: '6176466',
        localName: '机器人2',
        objType: 'equipment',
        classCode: 'PDPDRB',
        valid: true,
        floorId: 'Fl61011220101bc101e0978941c68884a1eacaccf322',
        bimId: 'Pj9909990007Fl6101122010ad1a51a218e84041b046bd331139a9d5:6176466',
        bluetoothSignCalLocation: '(37594.205,159242.06)',
        controlled: true
    },
    {
        id: 'Eq99099900076cb7c66c7549440a885d25612bc2a4a7',
        name: '3#-AHU-3F-2',
        localId: '6259356',
        localName: '机器人3',
        objType: 'equipment',
        classCode: 'PDPDRB',
        valid: true,
        floorId: 'Fl61011220101bc101e0978941c68884a1eacaccf322',
        bimId: 'Pj9909990007Fl6101122010401cfd51c1bb4d76a3116d42095d3837:6259356',
        bluetoothSignCalLocation: '(8311.705,48723.49)',
        controlled: true
    },
    {
        id: 'Eq990999000783f49d7b3a2b4adda6c463d570cadf47',
        name: '3#-AHU-1F-2',
        localId: '6206245',
        localName: '箱子1',
        objType: 'equipment',
        classCode: 'PDPDBX',
        valid: true,
        floorId: 'Fl61011220101bc101e0978941c68884a1eacaccf322',
        bimId: 'Pj9909990007Fl6101122010ad1a51a218e84041b046bd331139a9d5:6206245',
        bluetoothSignCalLocation: '(87248.065,48849.965)',
        controlled: true
    },
    {
        id: 'Eq9909990007c134e132f9984d3983c0375d3975688f',
        name: '3#-AHU-3F-1',
        localId: '6251539',
        localName: '箱子2',
        objType: 'equipment',
        classCode: 'PDPDBX',
        valid: true,
        floorId: 'Fl61011220101bc101e0978941c68884a1eacaccf322',
        bimId: 'Pj9909990007Fl6101122010401cfd51c1bb4d76a3116d42095d3837:6251539',
        bluetoothSignCalLocation: '(40176.715,140251.789)',
        controlled: true
    }
];
export const setTestData = floorList => {
    floorList.forEach(floor => {
        const equipmentList = mockEuips.filter(mockEq => {
            return floor.floorId === mockEq.floorId;
        });
        floor.equipmentList = equipmentList;
    });
};
