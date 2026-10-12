<template>
    <div class="copy-info-warp">
        <div class="title">选择需要引用的副本</div>
        <div class="sub-title">引用其他副本信息点会覆盖当前副本信息点</div>
        <div class="select-warp">
            <m-form ref="Mform" label-width="0" :rules="rules" :model="params">
                <m-form-item label="" prop="copyName">
                    <m-select v-model="params.copyName" :size="298" :options="copyGraphTypeList"> </m-select>
                </m-form-item>
            </m-form>
        </div>
        <div class="btn-warp">
            <m-button type="default" size="medium" @click="cancelCopy">取消</m-button>
            <m-button type="primary" size="medium" @click="checkForm">确认引用</m-button>
        </div>
        <div class="content">
            <div class="content-title">可被引用的内容如下</div>
            <p>单独信息点</p>
            <span>实例的独立信息点</span>
            <p>打组信息点</p>
            <span>实例的多个信息点，或者多个实例的相同信息点。</span>
            <p>标签</p>
            <span>运行状态、手自动状态等状态信息点使用标签表达。</span>
            <p>系统信息点</p>
            <div class="line"></div>
            <div class="content-title">不可被引用的内容</div>
            <p>因为更新自定义的设备顺序</p>
            <p>小附件的位置和缩放比例</p>
            <p>对象的自定义名称</p>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue';
import useCopyInfoPoint from '../hooks/useCopyInfoPoint';
import { copyGraphTypeListKey } from '@/utils/injectionKey';
const copyGraphTypeList = inject(copyGraphTypeListKey);
const emits = defineEmits(['clearChoose']);
const { Mform, rules, params, checkForm, cancelCopy } = useCopyInfoPoint(emits);
</script>
<style lang="scss" scoped>
.copy-info-warp {
    height: 100%;
    padding: 0 20px 12px;
    .title {
        color: #2e3742;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
    }
    .sub-title {
        margin-top: 4px;
        color: #e68600;
        font-size: 14px;
        line-height: 22px;
    }
    .select-warp {
        margin: 12px 0;
        width: 100%;
    }
    .btn-warp {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }
    .content {
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 4px;
        background: #f7f9fa;
        &-title {
            color: #2e3742;
            font-size: 14px;
            font-weight: 700;
            line-height: 22px;
        }
        .line {
            width: 100%;
            height: 1px;
            margin: 12px 0;
            background: #e1e5eb;
        }
        p {
            color: #1b2129;
            font-size: 14px;
            line-height: 24px;
            margin-top: 12px;
        }
        span {
            display: inline-block;
            color: #626c78;
            font-size: 12px;
            line-height: 20px;
        }
    }
}
</style>
