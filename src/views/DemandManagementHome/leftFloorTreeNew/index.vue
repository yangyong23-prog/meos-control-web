<template>
    <LeftFloorTree :building-select-id="buildingSelectId" :is-hide-footer="hideLeftFooter" @change-tree-data="changeTreeData" @after-selected-node="afterSelectedNode">
        <template #left-footer>
            <div class="footer-wrap" :style="{ justifyContent: !hideLeftBlackList && !hideLeftShieldList ? 'space-between' : 'center' }">
                <m-button
                    v-if="!hideLeftBlackList"
                    type="link"
                    size="small"
                    icon="IconMeriComponentButtonAdd"
                    :disabled="blackListInitTreeLoading || blackListSpaceTypeListLoading"
                    @click="openBlackListModal"
                >
                    <span>{{ i18n.global.t('meos_control_web.space_scope_config') }}</span>
                    <span>{{ `(${treeBlackListSpaceCount ?? 0})` }}</span>
                </m-button>
                <div v-if="!hideLeftBlackList && !hideLeftShieldList" class="separator"></div>
                <m-button v-if="!hideLeftShieldList" type="link" size="small" :disabled="(treeShieldedSpaceCount ?? 0) === 0" @click="openShieldedModal">
                    <span>{{ i18n.global.t('meos_control_web.shielded_zone') }}</span>
                    <span>{{ `(${treeShieldedSpaceCount ?? 0})` }}</span>
                </m-button>
            </div>
        </template>
    </LeftFloorTree>
    <ShieldedSpaceModal v-if="showShieldModal" @close="showShieldModal = false" />
    <BlacklistModal v-model="showBlackListModal" />
</template>

<script setup>
import i18n from '@/localization';
import LeftFloorTree from './LeftFloorTree.vue';
import ShieldedSpaceModal from './ShieldedSpaceModal.vue';
import BlacklistModal from './BlacklistModal.vue';
import useLeftFooter from '../hooks/useLeftFooter';
import {
    treeShieldedSpaceCountInjectKey,
    treeBlackListSpaceCountInjectKey,
    blackListInitTreeLoadingInjectKey,
    blackListSpaceTypeListLoadingInjectKey
} from '../constant/injectKey';

defineProps({
    buildingSelectId: {
        type: String,
        default: ''
    },
    hideLeftFooter: {
        type: Boolean,
        default: false
    },
    hideLeftBlackList: {
        type: Boolean,
        default: false
    },
    hideLeftShieldList: {
        type: Boolean,
        default: false
    }
});

const treeShieldedSpaceCount = inject(treeShieldedSpaceCountInjectKey);
const treeBlackListSpaceCount = inject(treeBlackListSpaceCountInjectKey);
const blackListInitTreeLoading = inject(blackListInitTreeLoadingInjectKey);
const blackListSpaceTypeListLoading = inject(blackListSpaceTypeListLoadingInjectKey);

const emits = defineEmits(['change-tree-data', 'after-selected-node']);

const changeTreeData = data => {
    emits('change-tree-data', data);
};

const afterSelectedNode = data => {
    emits('after-selected-node', data);
};

const { openShieldedModal, openBlackListModal, showShieldModal, showBlackListModal } = useLeftFooter({ treeShieldedSpaceCount });
</script>

<style lang="less" scoped>
.footer-wrap {
    width: 100%;
    padding-inline: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .separator {
        width: 1px;
        height: 13px;
        background: #d9d9d9;
    }
}
</style>
