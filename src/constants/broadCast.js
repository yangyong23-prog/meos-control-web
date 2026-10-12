const broadcastOperateType = {
    manual: 'page_broadcast_manual',
    alarm: 'page_broadcast_alarm',
    auto: 'page_broadcast_auto'
};

// 播报日志中tag样式
const tagStyle = {
    [broadcastOperateType.auto]: {
        color: '#683BD6',
        bgColor: '#F1E5FE'
    },
    [broadcastOperateType.manual]: {
        color: '#E68600',
        bgColor: '#FFF0CC'
    },
    [broadcastOperateType.alarm]: {
        color: '#D72824',
        bgColor: '#FFE6E5'
    }
};

export { broadcastOperateType, tagStyle };
