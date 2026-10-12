<template>
    <div class="ai-typing-container">
        <!-- 打字显示区域 -->
        <div style="background-color: aqua" class="typing-display bg-gray-50 p-6 rounded-lg border border-gray-200 min-h-[120px]">
            <p ref="textContent" style="background-color: darkgoldenrod; font-size: 16px; height: 20px; overflow: hidden" class="text-gray-800 whitespace-pre-wrap">
                {{ displayedText }}
            </p>
        </div>

        <!-- 控制按钮 -->
        <div class="controls mt-4 flex gap-3">
            <button class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors" @click="toggleTyping">
                {{ isTyping ? '暂停' : '继续' }}
            </button>

            <button class="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors" @click="restartTyping">重新开始</button>

            <div class="speed-control ml-auto">
                <label class="text-gray-600 mr-2">速度:</label>
                <input v-model="typingSpeed" type="range" min="50" max="300" class="w-32" @input="handleSpeedChange" />
                <span class="ml-2 text-gray-600">{{ typingSpeed }}ms</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

// 组件属性
const props = defineProps({
    // 要显示的完整文本
    text: {
        type: String,
        required: true
    },
    // 初始打字速度（毫秒/字符）
    initialSpeed: {
        type: Number,
        default: 100
    },
    // 是否自动开始打字
    autoStart: {
        type: Boolean,
        default: true
    }
});

// 状态管理
const displayedText = ref('');
const currentIndex = ref(0);
const isTyping = ref(false);
const typingSpeed = ref(props.initialSpeed);
const typingTimer = ref(null);
const textContent = ref(null);

// 开始打字
const startTyping = () => {
    if (currentIndex.value >= props.text.length) return;

    isTyping.value = true;

    // 清除可能存在的定时器
    if (typingTimer.value) {
        clearTimeout(typingTimer.value);
    }

    // 设置打字定时器
    typingTimer.value = setTimeout(() => {
        // 添加下一个字符
        displayedText.value += props.text[currentIndex.value];
        currentIndex.value++;

        // 如果还有字符未显示，继续打字
        if (currentIndex.value < props.text.length) {
            startTyping();
        } else {
            // 完成打字
            isTyping.value = false;
        }
    }, getRandomSpeed());
};

// 获取随机速度（模拟更自然的打字节奏）
const getRandomSpeed = () => {
    // 在设置速度的80%-120%之间随机波动
    return typingSpeed.value * (0.8 + Math.random() * 0.4);
};

// 暂停/继续打字
const toggleTyping = () => {
    if (isTyping.value) {
        // 暂停
        isTyping.value = false;
        if (typingTimer.value) {
            clearTimeout(typingTimer.value);
        }
    } else {
        // 继续
        if (currentIndex.value < props.text.length) {
            startTyping();
        }
    }
};

// 重新开始打字
const restartTyping = () => {
    // 清除定时器
    if (typingTimer.value) {
        clearTimeout(typingTimer.value);
    }

    // 重置状态
    displayedText.value = '';
    currentIndex.value = 0;

    // 开始打字
    startTyping();
};

// 处理速度变化
const handleSpeedChange = () => {
    // 如果正在打字，重新启动以应用新速度
    if (isTyping.value) {
        clearTimeout(typingTimer.value);
        startTyping();
    }
};

// 监听text prop变化，自动重启
watch(
    () => props.text,
    newText => {
        if (newText !== props.text) {
            restartTyping();
        }
    }
);

// 生命周期钩子
onMounted(() => {
    if (props.autoStart) {
        startTyping();
    }
});

onBeforeUnmount(() => {
    // 清除定时器
    if (typingTimer.value) {
        clearTimeout(typingTimer.value);
    }
});

watch(
    () => displayedText.value,
    (newVal, oldVal) => {
        if (newVal !== oldVal) {
            textContent.value.scrollTop = textContent.value.scrollHeight;
        }
    }
);
</script>

<style scoped>
/* 打字光标样式 */
.cursor {
    display: inline-block;
    width: 0.5em;
    height: 1em;
    background-color: #333;
    margin-left: 2px;
    vertical-align: text-bottom;
}

/* 光标闪烁动画 */
.blinking {
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    from,
    to {
        background-color: transparent;
    }
    50% {
        background-color: #333;
    }
}

/* 响应式设计 */
@media (max-width: 640px) {
    .controls {
        flex-direction: column;
    }

    .speed-control {
        margin-left: 0;
        margin-top: 2px;
    }
}
</style>
