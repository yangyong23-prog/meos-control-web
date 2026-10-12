const options = [
    {
        url: '/running-monitor/queryAbnormalEventList',
        method: 'post',
        response: () => {
            return {
                data: [
                    {
                        riskLevel: 'string',
                        exceptionStartTime: 0,
                        duration: 0,
                        riskEventName: 'string',
                        exceptionEventCode: 'string'
                    }
                ],
                code: '00000'
            };
        },
        timeout: 1000
    }
];

export default options;
