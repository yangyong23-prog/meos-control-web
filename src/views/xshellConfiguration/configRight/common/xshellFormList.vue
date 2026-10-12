<template>
    <title-type
        v-if="props.title && props.dataList.length"
        :style="{ minWidth: title === i18n.global.t('meos_control_web.space_quality_demand_input_condition') ? '1050px' : 'auto' }"
        :title="props.title"
        :sub-title="props.subTitle"
    />
    <m-form ref="Mform" :model="props.xshellParams" :label-position="'left'">
        <div class="form-box" :class="[props.row == '2' && 'form-container', isEllipsis && 'from-isEllipsis']">
            <div
                v-for="(item, index) in props.dataList"
                :key="index + item.code"
                :class="{
                    'form-box-data': true,
                    'flex-column-layout': !!item?.tabInstanceTitle || !!item?.groupName
                }"
            >
                <!-- 五级分类-实例名称 -->
                <span v-if="item?.tabInstanceTitle" class="instance-title">{{ item?.tabInstanceTitle || '' }}</span>
                <!-- 分组名称 -->
                <div v-if="item?.groupName" class="group-name-title">{{ item?.groupName }}</div>
                <div class="flex-row-layout">
                    <VisibilityWithDeviceSelector v-if="HALF_SECTION_VISIBILITY.includes(item.code)" :index="index" :item="item" :check-modify="checkModify">
                        <template #label>
                            <div class="label-position" :style="{ width: props.labelWidth }">
                                <div class="label-top">
                                    <div class="fc">
                                        <span v-ellipsis class="item-name" :class="{ 'item-name-ellipsis': isEllipsis }">{{ item.name }}</span>
                                        <span v-if="!isEllipsis && !DEFAULT_EMPTY.includes(item.code)" class="label-icon">*</span>
                                        <m-tips v-if="item.desc && !isEllipsis" :disabled="!item.desc" theme="darkTransparent">
                                            <template #content>
                                                <div style="max-width: 420px">{{ item.desc }}</div>
                                            </template>
                                            <IconMeriComponentDialogLinear class="label-icon-linear" size="16" color="#626C78" />
                                        </m-tips>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </VisibilityWithDeviceSelector>

                    <m-form-item
                        v-else-if="item.valueType === 'MULTIPLE'"
                        :prop="`item.${index}.valueInputLeft`"
                        :item-model="item.valueInputLeft"
                        require-asterisk-position="right"
                        class="form-item-left"
                        :rules="[
                            {
                                type: 'array',
                                required: false,
                                message: i18n.global.t('meos_control_web.please_select'),
                                trigger: ['blur', 'change']
                            },
                            {
                                validator: (value, rule, callback) => validateInput(item, callback, 'left'),
                                trigger: ['blur', 'change']
                            }
                        ]"
                    >
                        <template #label>
                            <div class="label-position" :style="{ width: props.labelWidth }">
                                <div class="label-top">
                                    <div class="fc">
                                        <span class="item-name">{{ item.name }}</span>
                                        <m-tips v-if="item.desc" :content="item.desc" theme="darkTransparent" width="420px">
                                            <IconMeriComponentDialogLinear class="label-icon-linear" size="16" color="#626C78" />
                                        </m-tips>
                                    </div>

                                    <div class="label-bottom">
                                        <span>
                                            <span v-if="ALG_COLDHOT_COSTS_PERCENT.includes(item.code)">
                                                {{
                                                    (!item.valueInputLeft && item.valueInputLeft !== 0) ||
                                                    (item.valueInputLeft &&
                                                        item.valueInputRight &&
                                                        (item.valueInputLeft >= item.valueInputRight ||
                                                            item.valueInputRight <= item.valueInputLeft ||
                                                            (item.valueInputRight - item.valueInputLeft) / item.valueInputLeft < 0.2))
                                                        ? item.hint.slice(0, item.name.length * 2.8) + '...'
                                                        : item.hint
                                                }}</span
                                            >
                                            <span v-else>{{ item.hint }}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- 多选的下拉框 -->
                        <template v-if="item.valueType === 'MULTIPLE'">
                            <m-select
                                v-model="item.valueInputLeft"
                                :options="item.mulInstanceList"
                                multiple
                                clearable
                                searchable
                                panel-searchable
                                :menu-size="240"
                                @change="val => checkModify(val, item, 'left')"
                                @clear="event => checkModify(null, item, 'left')"
                            >
                            </m-select>
                        </template>
                    </m-form-item>
                    <m-form-item
                        v-else-if="isFlowDemandConfigItem(item)"
                        :prop="`item.${index}.valueInputLeft`"
                        :item-model="item.valueInputLeft"
                        require-asterisk-position="right"
                        class="form-item-left vertical-layout"
                    >
                        <template #label>
                            <div class="label-position" :style="{ width: props.labelWidth }">
                                <div class="label-top">
                                    <div class="fc">
                                        <span class="item-name">{{ item.name }}</span>
                                        <m-tips v-if="item.desc" :content="item.desc" theme="darkTransparent" width="420px">
                                            <IconMeriComponentDialogLinear class="label-icon-linear" size="16" color="#626C78" />
                                        </m-tips>
                                    </div>

                                    <div class="label-bottom">
                                        <span>
                                            {{ item.hint }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <FlowDemandConfigList v-model="item.valueInputLeft" :options="item.mulInstanceList" @change="val => checkModify(val, item, 'left')" />
                    </m-form-item>
                    <m-form-item
                        v-else-if="ALG_COOL_OPEN_LIMIT.includes(item.code)"
                        :prop="`item.${index}.valueInputLeft`"
                        :item-model="item.valueInputLeft"
                        require-asterisk-position="right"
                        class="form-item-left vertical-layout"
                        :rules="[
                            {
                                type: 'array',
                                required: false,
                                message: i18n.global.t('meos_control_web.please_select'),
                                trigger: ['blur', 'change']
                            }
                        ]"
                    >
                        <template #label>
                            <div class="label-position" :style="{ width: props.labelWidth }">
                                <div class="label-top">
                                    <div class="fc">
                                        <span class="item-name">{{ item.name }}</span>
                                        <m-tips v-if="item.desc" :content="item.desc" theme="darkTransparent" width="420px">
                                            <IconMeriComponentDialogLinear class="label-icon-linear" size="16" color="#626C78" />
                                        </m-tips>
                                    </div>

                                    <div class="label-bottom">
                                        <span>
                                            {{ item.hint }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <!-- 多个动态表单组件 -->
                        <template v-if="ALG_COOL_OPEN_LIMIT.includes(item.code)">
                            <MultipleRowsFormList
                                v-model="item.valueInputLeft"
                                :options="item.mulInstanceList"
                                :rule-mode="ALG_COOL_OPEN_LIMIT_INTERVAL.includes(item.code) ? 'intervalTime' : 'countLimit'"
                                :range-select-free="ALG_COOL_OPEN_RANGE_SELECT_FREE.includes(item.code)"
                                :show-host-name="ALG_COOL_OPEN_SHOW_HOST_NAME.includes(item.code)"
                                @change="val => checkModify(val, item, 'left')"
                            ></MultipleRowsFormList>
                        </template>
                    </m-form-item>
                    <m-form-item
                        v-else-if="EFFICIENCY_INPUT_RANGE.includes(item.code) || OUTDOOR_WET_BULB_TEMP_CONFIG.includes(item.code)"
                        :prop="`item.${index}.valueInputLeft`"
                        :item-model="item.valueInputLeft"
                        require-asterisk-position="right"
                        :class="{
                            'form-item-left': true,
                            'full-width': EFFICIENCY_INPUT_RANGE.includes(item.code),
                            'fixed-width': OUTDOOR_WET_BULB_TEMP_CONFIG.includes(item.code)
                        }"
                        :rules="[
                            {
                                type: 'array',
                                required: false,
                                message: i18n.global.t('meos_control_web.please_select'),
                                trigger: ['blur', 'change']
                            }
                        ]"
                    >
                        <RangeThresholdInput
                            ref="multipleRangeRef"
                            v-model="item.valueInputLeft"
                            :title="item.name"
                            :default-values="item.defaultValues"
                            :first-disabled="EFFICIENCY_INPUT_RANGE.includes(item.code)"
                            :last-disabled="item.lastDisabled"
                            :valid-equal="EFFICIENCY_INPUT_RANGE.includes(item.code)"
                            :names="item.names"
                            :colors="item.colors"
                            :unit="item.unit"
                            :enable-min-max="OUTDOOR_WET_BULB_TEMP_CONFIG.includes(item.code)"
                            :min="item.min"
                            :max="item.max"
                            :hint="item.hint"
                            @change="val => checkModify(val, item, 'left')"
                        />
                    </m-form-item>
                    <m-form-item
                        v-else-if="ALG_MODAL_CONFIG.includes(item.code)"
                        :prop="`item.${index}.valueInputLeft`"
                        :item-model="item.valueInputLeft"
                        require-asterisk-position="right"
                        class="form-item-left"
                        :rules="[
                            {
                                type: 'array',
                                required: false,
                                message: i18n.global.t('meos_control_web.please_select'),
                                trigger: ['blur', 'change']
                            }
                        ]"
                    >
                        <template #label>
                            <div class="label-position" :style="{ width: props.labelWidth }">
                                <div class="label-top">
                                    <div class="fc">
                                        <span class="item-name">{{ item.name }}</span>
                                        <m-tips v-if="item.desc" :content="item.desc" theme="darkTransparent" width="420px">
                                            <IconMeriComponentDialogLinear class="label-icon-linear" size="16" color="#626C78" />
                                        </m-tips>
                                    </div>

                                    <div class="label-bottom">
                                        <span>
                                            {{ item.hint }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <!-- 弹窗配置组件 -->
                        <template v-if="ALG_MODAL_CONFIG.includes(item.code)">
                            <ModalConfigList
                                v-model="item.valueInputLeft"
                                :title="item.name"
                                :sub-title="item.hint"
                                :min="item.min"
                                :max="item.max"
                                :unit="item.unit"
                                @change="val => checkModify(val, item, 'left')"
                            ></ModalConfigList>
                        </template>
                    </m-form-item>
                    <m-form-item
                        v-else-if="getDynamicShowConfig(item).show"
                        :prop="`item.${index}.valueInputLeft`"
                        :item-model="item.valueInputLeft || item.valueInputLeft == '0' ? (isNaN(item.valueInputLeft) ? 1 : Number(item.valueInputLeft)) : ''"
                        require-asterisk-position="right"
                        class="form-item-left"
                        :rules="[
                            {
                                type: 'number',
                                required: DEFAULT_EMPTY.includes(item.code) || getDynamicShowConfig(item)?.emptyMsg || isMultipleCheckboxItem(item) ? false : true,
                                message:
                                    ALG_COOLING_MATHINE_MIN_ENABLED.includes(item.code) || WEATHER_WEATHER_CHANGE.includes(item.code)
                                        ? ''
                                        : i18n.global.t('meos_control_web.content_required'),
                                trigger: ['blur', 'change']
                            },
                            {
                                validator: (value, rule, callback) => validateInput(item, callback, 'left'),
                                trigger: ['blur', 'change']
                            }
                        ]"
                    >
                        <template #label>
                            <div class="label-position" :style="{ width: props.labelWidth }">
                                <div class="label-top">
                                    <div class="fc">
                                        <span v-ellipsis class="item-name" :class="{ 'item-name-ellipsis': isEllipsis }">{{ item.name }}</span>
                                        <span
                                            v-if="!isEllipsis && !DEFAULT_EMPTY.includes(item.code) && !getDynamicShowConfig(item)?.emptyMsg && !isMultipleCheckboxItem(item)"
                                            class="label-icon"
                                            >*</span
                                        >
                                        <m-tips v-if="item.desc && !isEllipsis" :disabled="!item.desc" theme="darkTransparent">
                                            <template #content>
                                                <div style="max-width: 420px">{{ item.desc }}</div>
                                            </template>
                                            <IconMeriComponentDialogLinear class="label-icon-linear" size="16" color="#626C78" />
                                        </m-tips>
                                    </div>

                                    <div class="label-bottom">
                                        <span v-if="ALG_MACHINE_LARGE_SMALL.includes(item.code) && item.min == 0 && item.max == 0">{{
                                            i18n.global.t('meos_control_web.no_device_exist', {
                                                equip: type === 'ACCC' ? i18n.global.t('meos_control_web.chiller') : i18n.global.t('meos_control_web.control_team')
                                            })
                                        }}</span>
                                        <span v-else>
                                            <template v-if="!isEllipsis">
                                                <span v-if="ALG_COLDHOT_COSTS_PERCENT.includes(item.code)">
                                                    {{
                                                        (!item.valueInputLeft && item.valueInputLeft !== 0) ||
                                                        (item.valueInputLeft &&
                                                            item.valueInputRight &&
                                                            (item.valueInputLeft >= item.valueInputRight ||
                                                                item.valueInputRight <= item.valueInputLeft ||
                                                                (item.valueInputRight - item.valueInputLeft) / item.valueInputLeft < 0.2))
                                                            ? item.hint.slice(0, item.name.length * 2.8) + '...'
                                                            : item.hint
                                                    }}</span
                                                >
                                                <span v-else>{{ item.hint }}</span>
                                            </template>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <!-- 上下箭头可切换的input -->
                        <template v-if="ALG_COOLING_SWITCH.includes(item.code)">
                            <div class="arrow-default">
                                <m-input-number
                                    v-model="item.valueInputLeft"
                                    class="number-default"
                                    width="136"
                                    text-align="left"
                                    placeholder
                                    controls="rightButton"
                                    :precision="0"
                                    :min="item.min"
                                    :max="item.max"
                                    :step="5"
                                    title
                                    :disabled="!item.editAuth"
                                    @blur="numberInputBlur(item)"
                                    @change="val => checkModify(val, item, 'left')"
                                >
                                    <template #suffix>{{ item?.unit?.split(',')?.[0] || item.unit }}</template>
                                </m-input-number>
                                <IconMeriComponentArrowUp
                                    :color="
                                        ALG_PROJECT_POWER.includes(item.code)
                                            ? Number(item.valueInputLeft) + 14 >= item.max
                                                ? '#E1E5EB'
                                                : '#8B949E'
                                            : Number(item.valueInputLeft) + 4 >= item.max
                                            ? '#E1E5EB'
                                            : '#8B949E'
                                    "
                                    class="arrow-up"
                                    :style="{
                                        cursor: ALG_PROJECT_POWER.includes(item.code)
                                            ? Number(item.valueInputLeft) + 14 >= item.max || !item.editAuth
                                                ? 'not-allowed'
                                                : 'pointer'
                                            : Number(item.valueInputLeft) + 4 >= item.max || !item.editAuth
                                            ? 'not-allowed'
                                            : 'pointer'
                                    }"
                                    @click="changeArrow(item, 0)"
                                />
                                <IconMeriComponentArrowDown
                                    :disabled="item.valueInputLeft == 0"
                                    :color="
                                        ALG_PROJECT_POWER.includes(item.code)
                                            ? Number(item.valueInputLeft) - 4 <= item.min
                                                ? '#E1E5EB'
                                                : '#8B949E'
                                            : Number(item.valueInputLeft) - 4 <= item.min
                                            ? '#E1E5EB'
                                            : '#8B949E'
                                    "
                                    class="arrow-down"
                                    :style="{
                                        cursor: ALG_PROJECT_POWER.includes(item.code)
                                            ? Number(item.valueInputLeft) - 14 <= item.min || !item.editAuth
                                                ? 'not-allowed'
                                                : 'pointer'
                                            : Number(item.valueInputLeft) - 4 <= item.min || !item.editAuth
                                            ? 'not-allowed'
                                            : 'pointer'
                                    }"
                                    @click="changeArrow(item, 1)"
                                />
                            </div>
                        </template>
                        <template v-else-if="ALG_COOLING_MATHINE_MIN_ENABLED.includes(item.code)">
                            <!-- 是否支持同时开启大小机 -->
                            <m-radio-group v-model="item.valueInputLeft" @change="val => checkModify(val, item, 'left')">
                                <div class="list" style="line-height: 14px">
                                    <m-radio v-for="radio in options" :key="radio.label" :disabled="!item.editAuth" :label="radio.value">{{ radio.label }}</m-radio>
                                </div>
                            </m-radio-group>
                        </template>
                        <template v-else-if="WEATHER_WEATHER_CHANGE.includes(item.code)">
                            <!-- 是否支持同时开启大小机 -->
                            <m-radio-group v-model="item.valueInputLeft" @change="val => checkModify(val, item, 'left')">
                                <div class="list" style="line-height: 14px">
                                    <m-radio v-for="radio in weatherOptions" :key="radio.label" :disabled="!item.editAuth" :label="radio.value">{{ radio.label }}</m-radio>
                                </div>
                            </m-radio-group>
                        </template>
                        <template v-else-if="GRAPH_ANIMATION_VISIBLE.includes(item.code)">
                            <m-radio-group v-model="item.valueInputLeft" @change="val => checkModify(val, item, 'left')">
                                <div class="list" style="line-height: 14px">
                                    <m-radio v-for="radio in graphAnimationVisibleOptions" :key="radio.label" :disabled="!item.editAuth" :label="radio.value">{{
                                        radio.label
                                    }}</m-radio>
                                </div>
                            </m-radio-group>
                        </template>
                        <template v-else-if="GRAPH_ANIMATION_EFFECT.includes(item.code)">
                            <m-radio-group v-model="item.valueInputLeft" @change="val => checkModify(val, item, 'left')">
                                <m-tips :disabled="item.editAuth" placement="bottom" :content="GRAPH_ANIMATION_EFFECT_DISABLE_TIPS" theme="darkTransparent">
                                    <div class="list" style="line-height: 14px">
                                        <m-radio v-for="radio in graphAnimationEffectOptions" :key="radio.label" :disabled="!item.editAuth" :label="radio.value">{{
                                            radio.label
                                        }}</m-radio>
                                    </div>
                                </m-tips>
                            </m-radio-group>
                        </template>
                        <template v-else-if="VAL_SOURCE_JSON_ENUM.includes(item.code)">
                            <m-radio-group v-model="item.valueInputLeft" @change="val => checkModify(val, item, 'left')">
                                <div class="list" style="line-height: 14px">
                                    <m-radio v-for="radio in item.options" :key="radio.value" :disabled="!item.editAuth" :label="radio.value">
                                        {{ radio.label }}
                                    </m-radio>
                                </div>
                            </m-radio-group>
                        </template>
                        <!-- 累计运行时间，自控期间累计运行时间单选 -->
                        <template v-else-if="CONTROL_COOD_AND_HOT.includes(item.group)">
                            <!-- 控制逻辑选机条件输入 -->
                            <m-radio-group v-model="item.valueInputLeft" @change="val => checkModify(val, item, 'left')">
                                <div class="list" style="line-height: 14px">
                                    <m-radio
                                        v-for="radio in runTimeOptions"
                                        :key="radio.label"
                                        :disabled="!item.editAuth"
                                        style="font-size: 14px; color: #626c78"
                                        :label="radio.value"
                                        >{{ radio.label }}</m-radio
                                    >
                                </div>
                            </m-radio-group>
                        </template>
                        <!-- 多选 checkbox -->
                        <template v-else-if="isMultipleCheckboxItem(item)">
                            <m-checkbox-group v-model="item.valueInputLeft" @change="val => checkModify(val, item, 'left')">
                                <div class="checkbox-list">
                                    <m-checkbox v-for="option in item.mulInstanceList" :key="option.id" :label="option.id">
                                        {{ option.name }}
                                    </m-checkbox>
                                </div>
                            </m-checkbox-group>
                        </template>

                        <!-- 单选下拉字段 -->
                        <template v-else-if="isSingleSelectItem(item) || IS_SHIELD_OR_NOT_CODES.includes(item.code)">
                            <template v-if="getDynamicShowConfig(item).emptyMsg && !item.mulInstanceList?.length">
                                <span class="empty-msg">{{ getDynamicShowConfig(item).emptyMsg }}</span>
                            </template>
                            <m-select
                                v-else
                                v-model="item.valueInputLeft"
                                :options="item.mulInstanceList"
                                :clearable="isSingleSelectClearable(item)"
                                :menu-size="240"
                                @change="val => checkModify(val, item, 'left')"
                                @clear="event => checkModify(null, item, 'left')"
                            >
                            </m-select>
                        </template>
                        <!-- 空间异常的阈值判定 -->
                        <template v-else-if="item.code == 'alg_space_error_threshold'">
                            <m-input-number
                                :key="item.code"
                                v-model="item.valueInputLeft"
                                :disabled="!item.editAuth"
                                class="number-default"
                                :width="props.width ? props.width : '136px'"
                                text-align="left"
                                placeholder
                                :precision="1"
                                :min="item.min"
                                :max="item.max"
                                @blur="numberInputBlur(item)"
                                @change="val => checkModify(val, item, 'left')"
                            >
                            </m-input-number>
                        </template>
                        <!-- 判断加开大机还是小机的加权平均差值M的范围 不需要判断两个值的区间 只需要判断范围的 -->
                        <template v-else-if="ALG_COLDHOT_ADD_AVERAGE.includes(item.code)">
                            <m-input
                                v-model="item.valueInputLeft"
                                :disabled="!item.editAuth"
                                style="margin-right: 12px"
                                @input="averageInput(item, 'left')"
                                @blur="averageBlur(item, 'left')"
                                @change="val => checkModify(val, item, 'left')"
                                @clear="event => checkModify(null, item, 'left')"
                            >
                                <template #prepend>{{ i18n.global.t('meos_control_web.large_unit_add_limit') }}</template>
                            </m-input>
                        </template>
                        <!-- 供冷失衡、供热失衡 -->
                        <template v-else-if="ALG_LEFT_INPUT_PREFIX_CODES.includes(item.code)">
                            <span style="margin-right: 10px">{{ ALG_LEFT_INPUT_PREFIX.find(v => v.code == item.code)?.prefix || '' }}</span>
                            <span style="margin-right: 10px">{{ ALG_LEFT_INPUT_PREFIX.find(v => v.code == item.code)?.divider || '' }}</span>
                            <m-input-number
                                :key="item.code"
                                v-model="item.valueInputLeft"
                                :disabled="!item.editAuth"
                                class="number-default long-suffix"
                                :width="props.width ? props.width : '160px'"
                                text-align="left"
                                placeholder
                                controls="rightButton"
                                :precision="1"
                                :min="item.min"
                                @blur="numberInputBlur(item)"
                                @change="val => checkModify(val, item, 'left')"
                            >
                                <template #suffix>
                                    {{ ALG_LEFT_INPUT_PREFIX.find(v => v.code == item.code)?.name || item.unit }}
                                </template>
                            </m-input-number>
                        </template>
                        <!-- 判断加机的供水温度插值与持续时间 -->
                        <template v-else-if="ALG_COOL_ADD_WTDI_DURATION.includes(item.code)">
                            <m-input-number
                                :key="item.code"
                                v-model="item.valueInputLeft"
                                :disabled="!item.editAuth"
                                class="number-default"
                                :width="props.width ? props.width : '136px'"
                                text-align="left"
                                placeholder
                                controls="rightButton"
                                :precision="COMPOSITE_PAIR_WITH_DURATION_INTEGER_CODES.includes(item.code) ? 0 : 1"
                                :min="item.min"
                                @blur="numberInputBlur(item)"
                                @change="val => checkModify(val, item, 'left')"
                            >
                                <template #suffix> {{ getItemUnit(item.unit, `℃`) }}</template>
                            </m-input-number>
                        </template>
                        <!-- 保留一位小数的InputNumber -->
                        <template v-else-if="ALG_TEMP_PRESS_DIFF.includes(item.code)">
                            <m-input-number
                                :key="item.code"
                                v-model="item.valueInputLeft"
                                :disabled="
                                    (!item.editAuth && item.defaultValues.split(',').length == 1) ||
                                    (!item.editAuth && item.defaultValues.split(',').length == 2 && DISABLED_UPPER_AND_LOWER_LIMIT.includes(item.code)) ||
                                    (!item.editAuth && item.defaultValues.split(',').length == 2 && DISABLED_LOWER_LIMIT.includes(item.code))
                                "
                                :class="{ 'number-default': true, 'no-unit': ALG_NO_UNIT.includes(item.code) }"
                                :width="props.width ? props.width : '136px'"
                                text-align="left"
                                placeholder
                                controls="rightButton"
                                :precision="1"
                                :min="item.min"
                                @blur="numberInputBlur(item)"
                                @change="val => checkModify(val, item, 'left')"
                            >
                                <template v-if="!ALG_NO_UNIT.includes(item.code)" #suffix>{{ item?.unit?.split(',')?.[0] || item.unit }}</template>
                            </m-input-number>
                        </template>
                        <template v-else>
                            <m-input-number
                                :key="item.code"
                                v-model="item.valueInputLeft"
                                class="number-default"
                                :width="props.width ? props.width : '136px'"
                                text-align="left"
                                placeholder
                                controls="rightButton"
                                :precision="0"
                                :min="item.min"
                                :disabled="
                                    (ALG_MACHINE_LARGE_SMALL.includes(item.code) && item.min == 0 && item.max == 0) ||
                                    (!item.editAuth && item.defaultValues.split(',').length == 1) ||
                                    (!item.editAuth && item.defaultValues.split(',').length == 2 && DISABLED_UPPER_AND_LOWER_LIMIT.includes(item.code)) ||
                                    (!item.editAuth && item.defaultValues.split(',').length == 2 && DISABLED_LOWER_LIMIT.includes(item.code))
                                "
                                @blur="numberInputBlur(item)"
                                @change="val => checkModify(val, item, 'left')"
                            >
                                <template v-if="!ALG_NO_UNIT.includes(item.code)" #suffix>{{ item?.unit?.split(',')?.[0] || item.unit }}</template>
                            </m-input-number>
                        </template>

                        <m-tips
                            v-if="!isEllipsis && typeof item?.defaultValues === 'string' && item?.defaultValues?.split(',').length == 1"
                            :content="defaultValueTips(item)"
                            theme="darkTransparent"
                            :disabled="!NO_DISABLED_LIMIT.includes(item.code) && !item.editAuth"
                        >
                            <m-button
                                class="default-text"
                                type="link"
                                size="medium"
                                :style="{
                                    zIndex:
                                        ALG_COOLING_MATHINE_MIN_ENABLED.includes(item.code) || WEATHER_WEATHER_CHANGE.includes(item.code)
                                            ? item.valueInputLeft == i18n.global.t('common.is')
                                                ? -1
                                                : 1
                                            : item.valueInputLeft !== '' && item.defaultValues !== '' && item.valueInputLeft != item.defaultValues
                                            ? 1
                                            : -1,
                                    marginRight: ALG_PROJECT_POWER.includes(item.code) ? '20px' : '0px'
                                }"
                                :disabled="!NO_DISABLED_LIMIT.includes(item.code) && !item.editAuth"
                                @click="restoreDefault(item)"
                                >{{ i18n.global.t('meos_control_web.restore_default_value') }}</m-button
                            >
                        </m-tips>
                    </m-form-item>
                    <div
                        v-if="
                            item.valueType !== 'MULTIPLE' &&
                            typeof item?.defaultValues === 'string' &&
                            item?.defaultValues?.split(',').length == 2 &&
                            !ALG_COLDHOT_ADD_AVERAGE.includes(item.code)
                        "
                        class="line"
                        :style="{ visibility: ALG_HIDE_JOIN_LINE.includes(item.code) ? 'hidden' : 'visible' }"
                    ></div>
                    <m-form-item
                        v-if="item.valueType !== 'MULTIPLE' && typeof item?.defaultValues === 'string' && item?.defaultValues?.split(',').length == 2"
                        class="form-item-right"
                        :prop="`item.${index}.valueInputRight`"
                        :item-model="item.valueInputRight || item.valueInputRight == '0' ? Number(item.valueInputRight) : ''"
                        require-asterisk-position="right"
                        :rules="[
                            {
                                type: 'number',
                                required: true,
                                message: i18n.global.t('meos_control_web.content_required'),
                                trigger: ['blur', 'change']
                            },
                            {
                                validator: (value, rule, callback, status) => validateInput(item, callback, 'right'),
                                trigger: ['blur', 'change']
                            }
                        ]"
                    >
                        <m-input
                            v-if="ALG_COLDHOT_ADD_AVERAGE.includes(item.code)"
                            v-model="item.valueInputRight"
                            :disabled="!item.editAuth"
                            @input="averageInput(item, 'right')"
                            @blur="averageBlur(item, 'right')"
                            @change="val => checkModify(val, item, 'right')"
                            @clear="event => checkModify(null, item, 'right')"
                        >
                            <template #prepend>{{ i18n.global.t('meos_control_web.small_unit_add_limit') }}</template>
                        </m-input>

                        <!-- 右侧固定展示0-1440分钟数 -->
                        <div v-else-if="ALG_COOL_ADD_WTDI_DURATION.includes(item.code)" class="arrow-default">
                            <m-input-number
                                v-model="item.valueInputRight"
                                class="number-default"
                                width="136"
                                text-align="left"
                                placeholder
                                controls="rightButton"
                                :precision="0"
                                :min="0"
                                :max="1440"
                                step="5"
                                :disabled="!item.editAuth"
                                @blur="numberInputRightBlur(item)"
                                @change="val => checkModify(val, item, 'right')"
                            >
                                <template #suffix>{{ 'min' }}</template>
                            </m-input-number>
                            <IconMeriComponentArrowUp
                                :color="Number(item.valueInputRight) + 4 >= 1440 ? '#E1E5EB' : '#8B949E'"
                                class="arrow-up"
                                :style="{
                                    cursor: Number(item.valueInputRight) + 4 >= 1440 || !item.editAuth ? 'not-allowed' : 'pointer'
                                }"
                                @click="changeRightArrow(item, 0)"
                            />
                            <IconMeriComponentArrowDown
                                :disabled="item.valueInputRight == 0"
                                :color="Number(item.valueInputRight) - 4 <= 0 ? '#E1E5EB' : '#8B949E'"
                                class="arrow-down"
                                :style="{
                                    cursor: Number(item.valueInputRight) - 4 <= 0 || !item.editAuth ? 'not-allowed' : 'pointer'
                                }"
                                @click="changeRightArrow(item, 1)"
                            />
                        </div>

                        <m-input-number
                            v-else
                            :key="item.code"
                            v-model="item.valueInputRight"
                            :disabled="
                                (!item.editAuth && item.defaultValues.split(',').length == 2 && DISABLED_UPPER_AND_LOWER_LIMIT.includes(item.code)) ||
                                (!item.editAuth && item.defaultValues.split(',').length == 2 && DISABLED_UPPER_LIMIT.includes(item.code))
                            "
                            class="number-default"
                            :width="props.width ? props.width : '136px'"
                            text-align="left"
                            placeholder
                            controls="rightButton"
                            :precision="ALG_TEMP_PRESS_DIFF.includes(item.code) ? 1 : 0"
                            :min="item.min"
                            :max="item.max"
                            @blur="numberInputBlur(item)"
                            @change="val => checkModify(val, item, 'right')"
                        >
                            <template #suffix>{{ item?.unit?.split(',')?.[1] || item.unit }}</template>
                        </m-input-number>

                        <div class="default-text">
                            <m-tips :content="defaultValueTips(item)" theme="darkTransparent" :disabled="!NO_DISABLED_LIMIT.includes(item.code) && !item.editAuth">
                                <m-button
                                    type="link"
                                    size="medium"
                                    :style="{
                                        zIndex: item.valueInputLeft !== item.defaultValueLeft || item.valueInputRight !== item.defaultValueRight ? 1 : -1
                                    }"
                                    :disabled="!NO_DISABLED_LIMIT.includes(item.code) && !item.editAuth"
                                    @click="restoreDefault(item)"
                                    >{{ i18n.global.t('meos_control_web.restore_default_value') }}</m-button
                                >
                            </m-tips>
                        </div>
                    </m-form-item>
                </div>
            </div>
        </div>
    </m-form>
</template>

<script setup>
import i18n from '@/localization';
import { ref } from 'vue';
import { options, weatherOptions, graphAnimationVisibleOptions, graphAnimationEffectOptions, runTimeOptions, defaultValueTips } from '../../utils/tools';
import {
    ALG_MACHINE_LARGE_SMALL,
    ALG_COOLING_SWITCH,
    ALG_COLDHOT_ADD_AVERAGE,
    ALG_HIDE_JOIN_LINE,
    ALG_COOL_OPEN_LIMIT,
    ALG_COOL_OPEN_LIMIT_INTERVAL,
    ALG_COOL_OPEN_RANGE_SELECT_FREE,
    ALG_COOL_OPEN_SHOW_HOST_NAME,
    ALG_COOL_ADD_WTDI_DURATION,
    COMPOSITE_PAIR_WITH_DURATION_INTEGER_CODES,
    ALG_TEMP_PRESS_DIFF,
    ALG_MODAL_CONFIG,
    ALG_COLDHOT_COSTS_PERCENT,
    ALG_PROJECT_POWER,
    ALG_LEFT_INPUT_PREFIX_CODES,
    ALG_LEFT_INPUT_PREFIX,
    ALG_COOLING_MATHINE_MIN_ENABLED,
    ALG_SINGLE_SELECT_CODES,
    WEATHER_WEATHER_CHANGE,
    CONTROL_COOD_AND_HOT,
    DEFAULT_EMPTY,
    DISABLED_UPPER_LIMIT,
    DISABLED_LOWER_LIMIT,
    DISABLED_UPPER_AND_LOWER_LIMIT,
    ALG_NO_UNIT,
    NO_DISABLED_LIMIT,
    ALG_NO_DEFAULT_VALUE,
    EFFICIENCY_INPUT_RANGE,
    OUTDOOR_WET_BULB_TEMP_CONFIG,
    GRAPH_ANIMATION_EFFECT,
    GRAPH_ANIMATION_VISIBLE,
    GRAPH_ANIMATION_EFFECT_DISABLE_TIPS,
    HALF_SECTION_VISIBILITY,
    VAL_SOURCE_JSON_ENUM,
    DEFAULT_AVERAGE_INPUT_RULE,
    AVERAGE_INPUT_RULES,
    IS_SHIELD_OR_NOT_CODES,
    VENT_JUDGE_MODE_CODES,
    isFlowDemandConfigItem,
    isMultipleCheckboxItem
} from '../../constants/constant';
import { IconMeriComponentDialogLinear, IconMeriComponentArrowDown, IconMeriComponentArrowUp } from 'meri-icon';
import TitleType from './titleType.vue';
import MultipleRowsFormList from './MultipleRowsFormList.vue';
import ModalConfigList from './ModalConfigList.vue';
import RangeThresholdInput from './RangeThresholdInput.vue';
import FlowDemandConfigList from './FlowDemandConfigList.vue';
import VisibilityWithDeviceSelector from './VisibilityWithDeviceSelector/VisibilityWithDeviceSelector.vue';
import useDynamicFieldVisibility from '../../hooks/useDynamicFieldVisibility';

const props = defineProps({
    row: {
        // 页面布局排列 2为双排
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: ''
    },
    title: {
        // 标题
        type: String,
        default: ''
    },
    subTitle: {
        // 副标题
        type: String,
        default: ''
    },
    dataList: {
        type: Array,
        default: () => []
    },
    labelWidth: {
        type: String,
        default: ''
    },
    xshellParams: {
        type: Object,
        default: () => ({})
    },
    isEllipsis: {
        type: Boolean,
        default: false
    },
    dynamicShowHandlerConfig: {
        type: Object,
        default: () => ({})
    }
});

const { getDynamicShowConfig } = useDynamicFieldVisibility({
    dataList: () => props.dataList,
    dynamicShowHandlerConfig: () => props.dynamicShowHandlerConfig
});

// 单选下拉（含通风「判断室外空气状态的方式」，选项由后端 mulInstance 下发）
const isSingleSelectItem = item => ALG_SINGLE_SELECT_CODES.includes(item.code) || VENT_JUDGE_MODE_CODES.includes(item.code);

// 通风「判断室外空气状态的方式」为必填项，不允许清空，不展示清空按钮；其余单选下拉保持可清空
const isSingleSelectClearable = item => !VENT_JUDGE_MODE_CODES.includes(item.code);

// 获取展示单位
const getItemUnit = (unit, defaultUnit) => {
    if (!unit) return defaultUnit;
    const parts = unit.split(',') || [];
    if (parts.length > 0) {
        return parts[0] || defaultUnit;
    }
    return unit;
};

const getType = value => {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
const stringifyVal = val => {
    const hasNumber = /\d+/g.test(val);
    return ['object', 'array'].includes(getType(val))
        ? JSON.stringify(val ?? '')
        : ['null', 'undefined'].includes(getType(val))
        ? getType(val)
        : hasNumber
        ? parseFloat(`${val ?? ''}`)
        : val;
};

const checkModify = (val, item, leftOrRight) => {
    if (!props.xshellParams?.defaultItem?.length) {
        return;
    }
    // if (!item.editAuth) return;
    const preSavedItems = props.xshellParams?.defaultItem?.flatMap(v => v?.items) || [];
    const preSavedItem = preSavedItems?.find(v => v?.code === item?.code && (v?.objectId === item?.objectId || !v?.objectId));
    // 忽略无默认值
    const isNoDefault = ALG_NO_DEFAULT_VALUE.includes(item.code);
    const cloneItem = structuredClone(item);
    if (leftOrRight === 'left') {
        const stringVal = stringifyVal(val);
        const stringDefault = stringifyVal(item.defaultValueLeft);
        const preSavedLeftVal = stringifyVal(preSavedItem?.valueInputLeft);
        const modifyItem = {
            id: cloneItem?.code + '|' + 'left' + '|' + (cloneItem?.objectId || '') + '|' + (cloneItem?.tabObjectName || ''),
            isNotDefault: isNoDefault ? false : stringVal !== stringDefault,
            isNotPreSaved: preSavedLeftVal !== stringVal,
            curValue: val,
            defaultValue: structuredClone(item.defaultValueLeft),
            preSavedValue: structuredClone(preSavedItem?.valueInputLeft),
            leftOrRight,
            cloneItem
        };
        emits('form-item-modify', modifyItem);
    } else {
        const stringVal = stringifyVal(val);
        const stringDefault = stringifyVal(item.defaultValueRight);
        const preSavedLRightVal = stringifyVal(preSavedItem?.valueInputRight);
        const modifyItem = {
            id: cloneItem?.code + '|' + 'right' + '|' + (cloneItem?.objectId || '') + '|' + (cloneItem?.tabObjectName || ''),
            isNotDefault: isNoDefault ? false : stringVal !== stringDefault,
            isNotPreSaved: preSavedLRightVal !== stringVal,
            curValue: val,
            defaultValue: structuredClone(item.defaultValueRight),
            preSavedValue: structuredClone(preSavedItem?.valueInputRight),
            leftOrRight,
            cloneItem
        };
        emits('form-item-modify', modifyItem);
    }
};
const getAverageField = name => (name === 'left' ? 'valueInputLeft' : 'valueInputRight');

const getAverageInputRule = code => {
    return AVERAGE_INPUT_RULES.find(item => item.codes.includes(code))?.rule || DEFAULT_AVERAGE_INPUT_RULE;
};

const sanitizeAverageValue = (value, code) => {
    const rule = getAverageInputRule(code);
    const sanitizerReg = rule.allowNegative ? /[^-0-9.]|(\..*\.|^\.)+/g : /[^0-9.]|(\..*\.|^\.)+/g;
    const sanitized = value?.replace(sanitizerReg, '');

    if (!rule.limitToOneDecimal) {
        return sanitized;
    }

    return sanitized?.replace(/^(\d+\.\d).*$/g, '$1');
};

const formatAverageBlurValue = (value, code) => {
    const sanitized = sanitizeAverageValue(value, code);
    return isNaN(sanitized) ? '' : Number(sanitized).toFixed(1);
};

// 加开大小机限值 输入校验 只能输入整数\小数
const averageInput = (item, name) => {
    const field = getAverageField(name);
    item[field] = sanitizeAverageValue(item[field], item.code);
    checkModify(item[field], item, name);
};

// 加开大小机限值 失焦校验 最大值 最小值
const averageBlur = (item, name) => {
    const field = getAverageField(name);
    if (!item[field]) return;

    item[field] = formatAverageBlurValue(item[field], item.code);

    if (item[field] > item.max) {
        item[field] = item.max;
    } else if (item[field] < item.min) {
        item[field] = item.min;
        // eslint-disable-next-line eqeqeq
    } else if (item[field] == '00') {
        item[field] = 0;
    } else {
        item[field] = Number(item[field]);
    }

    checkModify(item[field], item, name);
};

// 恢复默认值
const restoreDefault = item => {
    if (!NO_DISABLED_LIMIT.includes(item.code) && !item.editAuth) return;

    item.valueInputLeft = structuredClone(item.defaultValueLeft);
    checkModify(item.valueInputLeft, item, 'left');

    item.valueInputRight = structuredClone(item.defaultValueRight);
    checkModify(item.valueInputRight, item, 'right');
};

const emits = defineEmits(['form-item-modify']);

const Mform = ref(null);

// input 校验
const validateInput = (item, callback, leftOrRight) => {
    if (item.code === 'alg_cooling_unable_same_time_cool') {
        // 多选
        if (item.valueInputLeft?.length && item.valueInputLeft.length < 2) {
            callback(new Error(i18n.global.t('meos_control_web.select_at_least_two_options')));
        } else {
            callback();
        }
    } else if (ALG_PROJECT_POWER.includes(item.code)) {
        // 开机关闭时长设定
        if (item.valueInputLeft % 15 !== 0) {
            callback(new Error(item.hint));
        } else {
            callback();
        }
    } else if (ALG_COLDHOT_ADD_AVERAGE.includes(item.code)) {
        // 加开大小机限值
        callback();
    } else if (ALG_COOLING_SWITCH.includes(item.code)) {
        if (item.valueInputLeft % 5 !== 0) {
            callback(new Error(item.hint));
        } else {
            callback();
        }
    } else if (ALG_COOL_ADD_WTDI_DURATION.includes(item.code)) {
        if (leftOrRight === 'right' && item.valueInputRight % 5 !== 0) {
            // demo: 范围（0-99）;5的倍数，范围（0-1440）
            const hintParts = item.hint ? item.hint.split(/[;；]/) : [];
            if (hintParts.length > 1) {
                callback(new Error(hintParts[1]));
            } else {
                callback(new Error(item.hint));
            }
        } else {
            callback();
        }
    } else if (item.code !== 'alg_cooling_machine_change_range') {
        if ((item.valueInputRight || item.valueInputRight?.toString() === '0') && item.defaultValues?.split(',').length === 2 && item.valueInputLeft > item.valueInputRight) {
            callback(new Error(i18n.global.t('meos_control_web.upper_limit_greater_equal_lower_limit')));
        } else if (ALG_COLDHOT_COSTS_PERCENT.includes(item.code)) {
            // 差值≧20%
            if (item.valueInputLeft && item.valueInputRight && !((item.valueInputRight - item.valueInputLeft) / item.valueInputRight >= 0.2)) {
                callback(new Error(i18n.global.t('meos_control_web.delta_ge_20_percent')));
            } else {
                callback();
            }
        } else {
            callback();
        }
    } else {
        callback();
    }
};

// input中上下按钮切换
const changeArrow = (item, type) => {
    if (!item.editAuth) return;
    // eslint-disable-next-line no-self-assign
    item.valueInputLeft = item.valueInputLeft;
    if (ALG_PROJECT_POWER.includes(item.code)) {
        if (type === 0) {
            if (item.valueInputLeft > item.max - 14) return;
            item.valueInputLeft += 15;
            checkModify(item.valueInputLeft, item, 'left');
        } else {
            if (Number(item.valueInputLeft) - 14 <= 0) return;
            item.valueInputLeft -= 15;
            checkModify(item.valueInputLeft, item, 'left');
        }
    } else {
        if (type === 0) {
            if (item.valueInputLeft > item.max - 4) return;
            item.valueInputLeft += 5;
            checkModify(item.valueInputLeft, item, 'left');
        } else {
            if (Number(item.valueInputLeft) - 4 <= 0) return;
            item.valueInputLeft -= 5;
            checkModify(item.valueInputLeft, item, 'left');
        }
    }
    numberInputBlur(item);
};

// input中右侧上下按钮切换
const changeRightArrow = (item, type) => {
    if (!item.editAuth) return;
    if (type === 0) {
        if (item.valueInputRight > 1440 - 4) return;
        item.valueInputRight += 5;
        checkModify(item.valueInputRight, item, 'right');
    } else {
        if (Number(item.valueInputRight) - 4 <= 0) return;
        item.valueInputRight -= 5;
        checkModify(item.valueInputRight, item, 'right');
    }
    numberInputRightBlur(item);
};

const numberInputRightBlur = item => {
    const finalItemValue = item?.shellConfigValue ?? item?.value;
    if (finalItemValue && finalItemValue?.split(',')[1]) {
        if (item.valueInputRight > 1440) {
            item.valueInputRight = 1440;
            checkModify(item.valueInputRight, item, 'right');
        }
    }
};

const numberInputBlur = item => {
    if (item.valueInputLeft > item.max) {
        item.valueInputLeft = item.max;
        checkModify(item.valueInputLeft, item, 'left');
    }
    if (ALG_COOL_ADD_WTDI_DURATION.includes(item.code)) {
        // 这种情况 左右值没有大小关联关系
        return;
    }
    const finalItemValue = item?.shellConfigValue ?? item?.value;
    if (finalItemValue && finalItemValue?.split(',')[1]) {
        if (item.valueInputRight > item.max) {
            item.valueInputRight = item.max;
            checkModify(item.valueInputRight, item, 'right');
        }
    }
};

const checkAllItemsModify = () => {
    props.dataList.forEach(item => {
        checkModify(item.valueInputLeft, item, 'left');
        checkModify(item.valueInputRight, item, 'right');
    });
};

const multipleRangeRef = ref(null);
const scrollIntoField = async () => {
    const arrList = multipleRangeRef.value ?? [];
    for (let index = 0; index < arrList.length; index++) {
        const instance = arrList[index];
        const isValid = await instance?.validateAll?.();
        if (!isValid) {
            if (instance.scrollIntoField) {
                instance.scrollIntoField();
            }
            return;
        }
    }
};

defineExpose({
    Mform,
    checkAllItemsModify,
    multipleRangeRef,
    scrollIntoField
});
</script>
<style scoped lang="less">
@import '../../styles/xshellConfigRight.less';

.arrow-default {
    position: relative;
}

.arrow-up,
.arrow-down {
    z-index: 10;
    position: absolute;
    right: 52px;
    height: 14px;
}

.arrow-up {
    top: 4px;
}

.arrow-down {
    bottom: 4px;
}

.m-input {
    min-width: 60px;
    width: 60px;
}

/deep/.inner-input {
    padding: 0 !important;
}

.input-text-right {
    margin: 0 0 0 8px;
}

/deep/.m-input-number-icon {
    display: none;
}

/deep/ .m-input-number-box {
    border-radius: 4px;
}

.long-suffix {
    :deep(.suffix-text) {
        width: fit-content;
    }
}

.no-unit {
    :deep(.m-input-number-rightButton) {
        border-radius: 4px;
    }
}

.flex-row-layout {
    display: flex;
    flex-direction: row;
    flex: 1;
}

.flex-column-layout {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
}

.instance-title {
    display: flex;
    padding: 5px 0px 5px 12px;
    margin: 0px 18px 16px 30px;
    border-radius: 4px;
    background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0) 100%);

    color: @grey-900;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}

.vertical-layout {
    flex-direction: column;
    min-width: calc(100% - 56px);
    margin-bottom: 0px;
}

.full-width {
    width: 100%;
}

.fixed-width {
    width: 642px;
}

.label-icon-linear {
    cursor: default !important;
}

.group-name-title {
    flex-basis: 100%;
    padding-left: 30px;

    color: #2e3742;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
    margin-bottom: 12px;
}

.checkbox-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    padding-top: 5px;
}
.empty-msg {
    color: #636d79;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
</style>
