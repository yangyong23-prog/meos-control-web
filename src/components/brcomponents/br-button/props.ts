import { ExtractPropTypes } from 'vue';

const props = {
    url: String
};
export type Props = ExtractPropTypes<typeof props>;
export default props;
