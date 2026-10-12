<template>
    <div class="associated-device-sewage">
        <div v-for="item in data" :key="item.name" class="sewage-item">
            <div class="sewage-item-title">{{ item.aliasName }}</div>
            <div v-for="(tem, inx) in item.dataValue" :key="tem.id" class="sewage-item-content">
                <div class="content-top" @mouseenter="hoverObj(tem, inx)" @mouseleave="unhoverObj(tem, inx)">
                    <div ref="contentTopLeft" class="content-top-left">
                        <div v-ellipsis class="localName">{{ tem.localName ?? '--' }}</div>
                        <span style="display: flex; gap: 4px"> <moreTemplateObjectTags :status-data="tem" /></span>
                    </div>
                    <div class="content-top-right">
                        <m-button v-if="tem.isHover" type="link" size="small" class="ml4" @click.stop="clickObj(tem)">{{
                            i18n.global.t('meos_control_web.jump_to_floor_to_view_details')
                        }}</m-button>
                    </div>
                </div>
                <div v-if="tem.relObjects?.length > 0" class="content-association">
                    <div class="btn-wrap" @click="tem.open = !tem.open">
                        <span class="title">{{ i18n.global.t('meos_control_web.related_sewage_pump') }}</span>
                        <IconMeriComponentChevronUp v-if="tem.open" color="#246FE5" size="14" />
                        <IconMeriComponentChevronDown v-else color="#246FE5" size="14" />
                    </div>
                    <div class="association">
                        <div v-for="(rel, relIndex) in tem.relObjects" v-show="tem.open" :key="rel.id" class="association-item">
                            <div class="item" :class="{ 'border-none': relIndex === tem.relObjects.length - 1 }">
                                <div class="item-left">
                                    {{ rel.localName ?? '--' }}
                                    <div class="tags-container">
                                        <m-tag color="#1B4ACC" bg-color="#D9EBFF" size="small" class="ml4 mr4"> {{ rel.inFloor.localName ?? '--' }} </m-tag>
                                        <moreTemplateObjectTags :status-data="rel" />
                                    </div>
                                </div>
                                <!-- 新开标签页跳转详情 -->
                                <m-tips :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="left">
                                    <div class="icon-link fcc bgc-hover" @click.stop="jumpTo(rel.id)">
                                        <SvgIcon name="detail" />
                                    </div>
                                </m-tips>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="no-data">{{ i18n.global.t('meos_control_web.no_associated_submersible_sewage_pump') }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString } from '@/utils/envUtils';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import moreTemplateObjectTags from '@/views/Common/moreTemplateObjectTags/index.vue';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp } from 'meri-icon';
const emits = defineEmits(['openMonitorPlayer', 'unhoverObj', 'hoverObj', 'clickObj']);
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const clickObj = item => {
    emits('clickObj', item);
};
const hoverObj = (item, index) => {
    item.isHover = true;
    setElementsWidthByClassName('content-top-left', index, 'hover');
};
const unhoverObj = (item, index) => {
    item.isHover = false;
    setElementsWidthByClassName('content-top-left', index, 'unhover');
};

const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
function setElementsWidthByClassName(className, index, type) {
    let elements = document.getElementsByClassName(className);
    if (type === 'hover') {
        elements[index].style.width = `${'calc(100% - 112px)'}`;
    } else {
        elements[index].style.width = '100%';
    }
}
</script>
<style lang="less" scoped>
.associated-device-sewage {
    .sewage-item {
        &-title {
            color: #626c78;
            font-size: 14px;
            line-height: 22px;
            padding-left: 12px;
            margin-top: 16px;
        }
        &-content {
            background: #f7f9fa;
            border-radius: 4px;
            padding: 0 0 12px 0;
            margin-top: 8px;
            .content-top {
                height: 40px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 12px 0 12px;
                border-radius: 4px 4px 0px 0px;
                &-left {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }
                .localName {
                    color: #2e3742;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 22px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-right: 8px;
                }
                &-right {
                    display: flex;
                    align-items: center;
                }
            }
            .btn-wrap {
                user-select: none;
                display: flex;
                align-items: center;
                padding: 3px 4px;
                margin-top: 4px;
                border-radius: 4px;
                width: 92px;
                margin-left: 12px;
                .title {
                    color: #246fe5;
                    font-size: 14px;
                    line-height: 22px;
                }
                &:hover {
                    cursor: pointer;
                    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                }
            }
            .association {
                &-item {
                    &:hover {
                        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                    }
                    &:first-child {
                        border-radius: 8px 8px 0 0;
                        &:hover {
                            border-radius: 8px 8px 0 0;
                        }
                    }
                    &:last-child {
                        border-radius: 0 0 8px 8px;
                        &:hover {
                            border-radius: 0 0 8px 8px;
                        }
                    }
                }
            }
            .association-item {
                background: var(--gray-100, #f1f4f6);
                margin: 0 12px 0 12px;
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(196, 201, 207, 0.3);
                    .item-left {
                        flex: 1;
                        color: #1b2129;
                        font-size: 14px;
                        line-height: 22px;
                        padding: 11px 8px;
                    }
                    .tags-container {
                        display: flex;
                        gap: 4px;
                        flex-wrap: wrap;
                    }
                    .bgc-hover {
                        border-radius: 4px;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 26px;
                        height: 26px;
                        margin-right: 4px;
                        &:hover {
                            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                        }
                    }
                }
                .border-none {
                    border-bottom: none;
                }
            }
            .no-data {
                margin-top: 11px;
                padding-left: 12px;
                color: #8b949e;
                font-size: 14px;
                line-height: 22px;
            }
        }
    }
}
</style>
