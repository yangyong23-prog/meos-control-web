/**
 * 【市政换热】MunicipalhotstationBoard
 * 【燃气锅炉】ACCHGBhotstationBoard
 */
export const realTimeValue = {
    MunicipalhotstationBoard: [
        {
            title: '热水二次侧实时值',
            data: [
                { name: '热水二次侧流量', infoCode: '2HeatWaterFlow', dataValue: '', unit: 'm³/s' },
                { name: '总管供水温度', infoCode: '2heatWaterMainSupplyTemp', dataValue: '', unit: '℃' },
                { name: '总管回水温度', infoCode: '2heatWaterMainReturnTemp', dataValue: '', unit: '℃' },
                { name: '总管供水压力', infoCode: 'heatSecondarySideWaterMainSupplyPress', dataValue: '', unit: 'kPa' },
                { name: '总管回水压力', infoCode: 'heatSecondarySideWaterMainReturnPress', dataValue: '', unit: 'kPa' },
                { name: '旁通阀压差', infoCode: 'distributorCollectorDetaPress', dataValue: '', unit: 'kPa' }
            ]
        },
        {
            title: '热水一次侧实时值',
            data: [
                { name: '热水一次侧流量', infoCode: '1heatWaterFlow', dataValue: '', unit: 'm³/s' },
                { name: '一次侧供水温度', infoCode: 'heatWaterMainSupplyTemp', dataValue: '', unit: '℃' },
                { name: '一次侧回水温度', infoCode: 'heatWaterMainReturnTemp', dataValue: '', unit: '℃' },
                { name: '一次侧供水压力', infoCode: 'heatWaterMainSupplyPress', dataValue: '', unit: 'kPa' },
                { name: '一次侧回水压力', infoCode: 'heatWaterMainReturnPress', dataValue: '', unit: 'kPa' }
            ]
        }
    ],
    ACCHGBhotstationBoard: [
        {
            title: '供热实时值',
            data: [
                { name: '总管流量', infoCode: '1heatWaterFlow', dataValue: '', unit: 'm³/s' },
                { name: '总管供水温度', infoCode: 'heatWaterMainSupplyTemp', dataValue: '', unit: '℃' },
                { name: '总管回水温度', infoCode: 'heatWaterMainReturnTemp', dataValue: '', unit: '℃' },
                { name: '总管供水压力', infoCode: 'heatWaterMainSupplyPress', dataValue: '', unit: 'kPa' },
                { name: '总管回水压力', infoCode: 'heatWaterMainReturnPress', dataValue: '', unit: 'kPa' },
                { name: '旁通阀压差', infoCode: 'distributorCollectorDetaPress', dataValue: '', unit: 'kPa' }
            ]
        }
    ]
};
export const realTimeParamsInfoCodes = {
    MunicipalhotstationBoard: [
        '2HeatWaterFlow',
        '2heatWaterMainSupplyTemp',
        '2heatWaterMainReturnTemp',
        'heatSecondarySideWaterMainSupplyPress',
        'heatSecondarySideWaterMainReturnPress',
        'distributorCollectorDetaPress',
        '1heatWaterFlow',
        'heatWaterMainSupplyTemp',
        'heatWaterMainReturnTemp',
        'heatWaterMainSupplyPress',
        'heatWaterMainReturnPress'
    ],
    ACCHGBhotstationBoard: [
        '1heatWaterFlow',
        'heatWaterMainSupplyTemp',
        'heatWaterMainReturnTemp',
        'heatWaterMainSupplyPress',
        'heatWaterMainReturnPress',
        'distributorCollectorDetaPress'
    ]
};
export const objectsExistRuleParams = {
    MunicipalhotstationBoard: [
        {
            classCode: 'ACCH',
            infoCodes: [
                '2heatWaterMainSupplyTemp',
                'heatSecondarySideWaterMainSupplyTempSet',
                'heatSecondarySideWaterDetaTemp',
                'heatSecondarySideWaterDetaTempSet',
                'heatSecondarySideWaterDetaPressure',
                'heatSecondarySideWaterDetaPressureSet'
            ]
        },
        {
            classCode: 'ACGEHE',
            infoCodes: ['lowDetaTemp', 'lowOutTemp', 'highDetaTemp', 'highOutTemp']
        }
    ],
    ACCHGBhotstationBoard: [
        {
            classCode: 'ACCHGB',
            infoCodes: ['hotWaterOutTempSet', 'combustionState', 'burnRate', 'hotWaterOutTemp']
        },
        {
            classCode: 'ACCH',
            infoCodes: ['heatWaterMainSupplyTemp', 'heatWaterSupplyTempSet', 'waterDetaTemp', 'waterDetaTempSet', 'waterDetaPress', 'waterDetaPressSet']
        }
    ]
};

export const infoCodeParams = {
    MunicipalhotstationBoard: [
        '2heatWaterMainSupplyTemp',
        'heatSecondarySideWaterMainSupplyTempSet',
        'heatSecondarySideWaterDetaTemp',
        'heatSecondarySideWaterDetaTempSet',
        'heatSecondarySideWaterDetaPressure',
        'heatSecondarySideWaterDetaPressureSet',
        'lowDetaTemp',
        'lowOutTemp',
        'highDetaTemp',
        'highOutTemp'
    ],
    ACCHGBhotstationBoard: [
        'hotWaterOutTempSet',
        'combustionState',
        'burnRate',
        'heatWaterMainSupplyTemp',
        'heatWaterSupplyTempSet',
        'waterDetaTemp',
        'waterDetaTempSet',
        'waterDetaPress',
        'waterDetaPressSet'
    ]
};
export const objIdsParams = {
    MunicipalhotstationBoard: [
        'Eq952245755826cbcc248a474544b484d2e8a9ab4682',
        'Eq9522457558354b0204294d44f6b022523cbf3f49f5',
        'Eq95224575583aad1ae45b0e4b8e99901f76cd8a98dd',
        'Eq9522457558607cd122c01544f6b97f8e37b8e7c67f',
        'Eq9522457558990e2d7770404148bb8d3354c253c13f',
        'Eq9522457558adafe6e7f0c04704a1cde271085f0756',
        'Eq9522457558b6ef6c38fbe0462fa58418dcd7e22537',
        'Eq9522457558c162bd298264479797607fe09b303d2d',
        'Eq9522457558f620ab87f969429fa2bd1b155dc252b4',
        'Eq95224575588f210a3619584e29ace69d93972e7d4f',
        'Eq9522457558a3c86d6a1f70416d958f0dc4558bd3ef',
        'Eq95224575586a66c85b489e4394afa5319245600a79',
        'Eq95224575588037b2d25ff2428dbc1ff4a54ff98d72',
        'Eq95224575581260db825d1f468cab0c8eb6fe80aeaf',
        'Eq95224575582d18fe488f444d3eb4dccda13e9c4c79',
        'Eq95224575588f2371e2560040579abb82c3e09130fa',
        'Eq9522457558182d32dc24934a759d7637189b5bce7d',
        'Eq9522457558ef19237ee0eb45c8bb64d70cd10a9ba7',
        'Eq9522457558eb3a42cf7d1042e098c74e908b7cb573',
        'Eq9522457558c211014242174755921dba02c33ac5c4',
        'Eq952245755899fe90404bf5480da84b7bde36bf4b70'
    ],
    ACCHGBhotstationBoard: [
        'Eq7480382824b68dd6d15dd34462b90c332330b90b1a',
        'Eq74803828240034f66037ec48c98cfc1a42345b3a29',
        'Eq748038282426adf464d48f4158be10dc37e30981fe',
        'Eq7480382824ad8fbb979806426eb9fc33be50164b70',
        'Eq7480382824bd94b73d7dba41b08600890abfe8bcb7',
        'Eq748038282447c14bfe3d3b406d9ec6ce6ea452f44b',
        'Eq74803828246ef87cb4793e4f97bf44206c2b2b8ffe',
        'Eq7480382824080093b2d61941f79dfdc30625fd4993',
        'Eq7480382824f19d7e980347407db3ac2f70c6c932f1',
        'Eq3201050003c8f227762b094bfd8e20ef1e32dfd7b4'
    ]
};
