<template>
    <div class="child-info">
        <m-tips :content="i18n.global.t('meos_control_web.i_am_hint_text')" theme="darkTransparent" placement="top" trigger="hover">
            <span class="tip-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.44212 4.32357C6.44212 4.0014 6.70329 3.74023 7.02546 3.74023C7.34762 3.74023 7.60879 4.0014 7.60879 4.32357V7.75065C7.60879 8.07282 7.34762 8.33398 7.02546 8.33398C6.70329 8.33398 6.44212 8.07282 6.44212 7.75065V4.32357Z"
                        fill="#8B949E"
                    />
                    <path
                        d="M7.72884 9.53097C7.72884 9.93368 7.40238 10.2601 6.99967 10.2601C6.59697 10.2601 6.27051 9.93368 6.27051 9.53097C6.27051 9.12826 6.59697 8.8018 6.99967 8.8018C7.40238 8.8018 7.72884 9.12826 7.72884 9.53097Z"
                        fill="#8B949E"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.2216 6.57131C13.5394 6.5182 13.7539 6.21755 13.7008 5.89979C13.1628 2.6813 10.334 0.291504 6.99873 0.291504C3.67177 0.291504 0.847771 2.66964 0.300395 5.87783C0.246211 6.19541 0.459733 6.49678 0.77731 6.55097C1.09489 6.60515 1.39626 6.39163 1.45044 6.07405C1.9021 3.42686 4.23989 1.45817 6.99873 1.45817C9.76443 1.45817 12.1062 3.43649 12.5501 6.09213C12.6032 6.40989 12.9038 6.62443 13.2216 6.57131ZM0.779861 7.48251C0.462593 7.53847 0.250761 7.84103 0.306722 8.1583C0.869573 11.3494 3.68555 13.7082 6.99873 13.7082C10.3053 13.7082 13.1173 11.3587 13.6876 8.17591C13.7444 7.8588 13.5334 7.55566 13.2163 7.49884C12.8992 7.44202 12.596 7.65304 12.5392 7.97015C12.0687 10.5965 9.74065 12.5415 6.99873 12.5415C4.2513 12.5415 1.92009 10.5888 1.45565 7.95565C1.39969 7.63838 1.09713 7.42655 0.779861 7.48251Z"
                        fill="#1B2129"
                    />
                </svg>
            </span>
        </m-tips>
        <span class="split"></span>
        <m-popover trigger="click" placement="bottom-start" popover-class="manual-intervention-child-info-popover">
            <template #content>
                <div class="child-info-popover-wrap">
                    <m-scrollbar>
                        <div class="child-info-scroll-wrap">
                            <div class="header">
                                <span>{{ i18n.global.t('meos_control_web.child_object_list') }}</span>
                                <span>(禹数大楼)</span>
                            </div>
                            <div v-show="!loading" class="tree-content">
                                <m-tree :data="treeSelectData">
                                    <template #nodeSlot="node">
                                        <div class="tree-item">
                                            <span>{{ node.name }}</span>
                                            <m-tag color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('meos_control_web.configured') }}</m-tag>
                                        </div>
                                    </template>
                                </m-tree>
                            </div>
                            <div v-show="loading" class="loading-wrap">
                                <span class="icon">
                                    <svg
                                        t="1717671157172"
                                        class="icon"
                                        viewBox="0 0 1024 1024"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        p-id="2812"
                                        width="200"
                                        height="200"
                                    >
                                        <path
                                            d="M512 128c0 23.573333-19.2 42.389333-42.581333 45.290667C300.992 194.261333 170.666667 337.92 170.666667 512c0 188.522667 152.810667 341.333333 341.333333 341.333333 174.08 0 317.738667-130.346667 338.709333-298.752C853.610667 531.2 872.426667 512 896 512c23.573333 0 42.88 19.157333 40.554667 42.602667C915.2 770.24 733.248 938.666667 512 938.666667 276.352 938.666667 85.333333 747.648 85.333333 512 85.333333 290.730667 253.76 108.8 469.397333 87.424 492.842667 85.12 512 104.426667 512 128z"
                                            fill="#8B949E"
                                            p-id="2813"
                                        ></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </m-scrollbar>
                </div>
            </template>
            <m-button type="link" size="medium">{{ i18n.global.t('meos_control_web.view_subordinate_object') }}</m-button>
        </m-popover>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const treeSelectData = ref([
    {
        id: 'SE',
        name: i18n.global.t('meos_control_web.hv_specialty'),
        children: [
            {
                id: 'SESD',
                name: i18n.global.t('meos_control_web.hv_civil_defense_system'),
                children: [
                    {
                        id: 'SDCU',
                        objCode: 'SDCU',
                        name: i18n.global.t('meos_control_web.hv_civil_defense_control_module')
                    }
                ]
            },
            {
                id: 'SELT',
                name: i18n.global.t('meos_control_web.lighting_system'),
                children: [
                    {
                        id: 'LTCU',
                        objCode: 'LTCU',
                        name: i18n.global.t('meos_control_web.lighting_control_module')
                    },
                    {
                        id: 'LTLT',
                        objCode: 'LTLT',
                        name: i18n.global.t('meos_control_web.lighting_luminaire')
                    },
                    {
                        id: 'LTCC',
                        objCode: 'LTCC',
                        name: i18n.global.t('meos_control_web.lighting_circuit')
                    },
                    {
                        id: 'LTLG',
                        objCode: 'LTLG',
                        name: i18n.global.t('meos_control_web.lighting_group')
                    }
                ]
            }
        ]
    },
    {
        id: 'LT',
        name: i18n.global.t('meos_control_web.lighting_speciality'),
        children: []
    },
    {
        id: 'FG',
        name: i18n.global.t('meos_control_web.gas_specialty'),
        children: []
    },

    {
        id: 'SP',
        name: i18n.global.t('meos_control_web.security_major'),
        children: [
            {
                id: 'SPNP',
                name: i18n.global.t('meos_control_web.patrol_system'),
                children: [
                    {
                        id: 'NPCU',
                        objCode: 'NPCU',
                        name: i18n.global.t('meos_control_web.patrol_control_module')
                    },
                    {
                        id: 'NPPS',
                        objCode: 'NPPS',
                        name: i18n.global.t('meos_control_web.patrol_wand')
                    },
                    {
                        id: 'NPCP',
                        objCode: 'NPCP',
                        name: i18n.global.t('meos_control_web.patrol_communication_dock')
                    }
                ]
            },
            {
                id: 'SPVS',
                name: i18n.global.t('meos_control_web.video_surveillance_system'),
                children: [
                    {
                        id: 'VSCM',
                        objCode: 'VSCM',
                        name: i18n.global.t('meos_control_web.surveillance_camera')
                    },
                    {
                        id: 'VSSD',
                        objCode: 'VSSD',
                        name: i18n.global.t('meos_control_web.surveillance_video_storage')
                    },
                    {
                        id: 'VSCU',
                        objCode: 'VSCU',
                        name: i18n.global.t('meos_control_web.monitoring_control_module')
                    },
                    {
                        id: 'VSVM',
                        objCode: 'VSVM',
                        name: i18n.global.t('meos_control_web.monitor')
                    },
                    {
                        id: 'VSHT',
                        objCode: 'VSHT',
                        name: i18n.global.t('meos_control_web.monitoring_host')
                    }
                ]
            },
            {
                id: 'SPEG',
                name: i18n.global.t('meos_control_web.access_control_system'),
                children: [
                    {
                        id: 'EGCR',
                        objCode: 'EGCR',
                        name: i18n.global.t('meos_control_web.access_card_reader')
                    },
                    {
                        id: 'EGWT',
                        objCode: 'EGWT',
                        name: i18n.global.t('meos_control_web.access_intercom')
                    },
                    {
                        id: 'EGHT',
                        objCode: 'EGHT',
                        name: i18n.global.t('meos_control_web.access_main_controller')
                    },
                    {
                        id: 'EGCP',
                        objCode: 'EGCP',
                        name: i18n.global.t('meos_control_web.access_control_panel')
                    }
                ]
            }
        ]
    },
    {
        id: 'OT',
        name: i18n.global.t('meos_control_web.others'),
        children: [
            {
                id: 'OTAA',
                name: i18n.global.t('meos_control_web.gas_pipeline_and_accessories'),
                children: [
                    {
                        id: 'AAPS',
                        objCode: 'AAPS',
                        name: i18n.global.t('meos_control_web.gas_pipeline_support_hanger')
                    },
                    {
                        id: 'AAPL',
                        objCode: 'AAPL',
                        name: i18n.global.t('meos_control_web.gas_pipeline')
                    }
                ]
            },
            {
                id: 'OTAE',
                name: i18n.global.t('meos_control_web.actuator'),
                children: [
                    {
                        id: 'AERL',
                        objCode: 'AERL',
                        name: i18n.global.t('meos_control_web.relay')
                    },
                    {
                        id: 'AEIL',
                        objCode: 'AEIL',
                        name: i18n.global.t('meos_control_web.indicator_light')
                    },
                    {
                        id: 'AEAL',
                        objCode: 'AEAL',
                        name: i18n.global.t('meos_control_web.sound_light_alarm')
                    },
                    {
                        id: 'AEFC',
                        objCode: 'AEFC',
                        name: i18n.global.t('meos_control_web.frequency_converter')
                    }
                ]
            },
            {
                id: 'OTXX',
                name: i18n.global.t('meos_control_web.other_systems'),
                children: [
                    {
                        id: 'XXCD',
                        objCode: 'XXCD',
                        name: i18n.global.t('meos_control_web.coding_machine')
                    },
                    {
                        id: 'XXCR',
                        objCode: 'XXCR',
                        name: i18n.global.t('meos_control_web.sweeping_robot')
                    },
                    {
                        id: 'XXUA',
                        objCode: 'XXUA',
                        name: i18n.global.t('meos_control_web.uav')
                    }
                ]
            }
        ]
    },
    {
        id: 'EL',
        name: i18n.global.t('meos_control_web.elevator_specialty'),
        children: []
    }
]);
// const treeSelectData = [];
const loading = ref(false);

const getTreeData = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 5000);
};

getTreeData();
</script>
<style lang="less" scoped>
/* 滚动条整体部分 */
::-webkit-scrollbar {
    width: 12px; /* 垂直滚动条宽度 */
    height: 12px; /* 水平滚动条高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    opacity: 0;
    border-radius: 10px; /* 轨道圆角 */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background: rgba(196, 201, 207, 0.8); /* 滑块颜色 */
    border-radius: 10px; /* 滑块圆角 */
}

/* 滑块悬停状态 */
::-webkit-scrollbar-thumb:hover {
    background: rgba(196, 201, 207, 1);
}
.child-info-popover-wrap {
    padding: 16px 0;
    border-radius: 8px;
    .child-info-scroll-wrap {
        margin-left: 16px;
        width: 300px;
    }
    .header {
        margin-bottom: 8px;
        span {
            &:first-child {
                color: @grey-900;
                font-weight: 700;
                line-height: 22px;
            }
            &:last-child {
                color: @grey-600;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
            }
        }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    .loading-wrap {
        height: 61px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        .icon {
            width: 18px;
            height: 18px;
            animation: rotate 1.5s linear infinite;
            display: flex;
            // background: red;
            align-items: center;
            justify-content: center;
        }
        // .el-loading-spinner .path
    }
    .tree-content {
        max-height: 393px;
        overflow: auto;
        padding-right: 14px;
        margin-right: 2px;
        .m-tree {
            :deep(.nodeSlot) {
                width: 100%;
            }
        }
        .tree-item {
            height: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
}
.child-info {
    flex: 1;
    display: flex;
    align-items: center;
    // background: red;
    margin-left: 4px;
    span {
        display: inline-block;
    }
    .tip-icon {
        cursor: pointer;
        width: 14px;
        height: 14px;
    }
    .split {
        width: 1px;
        height: 14px;
        background: #d9d9d9;
        margin: 0 6px 0 10px;
    }
}
</style>
