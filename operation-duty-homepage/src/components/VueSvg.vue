<!-- eslint-disable vue/require-default-prop -->
<script>
import { onMounted, ref, h } from 'vue';
export default {
    props: {
        path: {
            type: String,
            default: ''
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        }
    },
    setup(props) {
        const svgString = ref('');
        onMounted(async () => {
            if (props.path) {
                const svgResponse = await fetch(props.path);
                svgString.value = await svgResponse.text();
            } else {
                svgString.value = '';
            }
        });

        return () => {
            if (svgString.value) {
                const div = document.createElement('div');
                div.innerHTML = svgString.value;
                const svg = div.firstElementChild;
                const { attributes } = svg;
                const attrs = {};
                for (let i = 0; i < attributes.length; i++) {
                    const attributeName = attributes[i].name;
                    const attributeValue = attributes[i].value;
                    attrs[attributeName] = attributeValue;
                }
                if (!isNaN(props.width)) {
                    attrs.width = props.width;
                }
                if (!isNaN(props.height)) {
                    attrs.height = props.height;
                }
                const vnode = h(svg.tagName, { ...attrs, innerHTML: svg.innerHTML });
                return vnode;
            }
        };
    }
};
</script>
