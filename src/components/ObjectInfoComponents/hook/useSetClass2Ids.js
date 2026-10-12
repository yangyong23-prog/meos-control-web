// @ts-ignore
import i18n from '@/localization';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import dataDockHandling from '@/hooks/dataDockHandling';
import { iterateObjct4InstanceInfo } from '@/utils';
import { uniq } from 'lodash';
export const useSetClass2Ids = props => {
    const commonDrawerRoot = inject(commonDrawerRootContextKey);
    const { writeDataToResponsiveDock } = dataDockHandling();
    watch(
        () => props.res?.id,
        () => {
            if (props.res.id) {
                // 按需订阅时收集sse订阅参数
                if (commonDrawerRoot?.props.isSubscriptOnDemand) {
                    const { classCodeIds } = iterateObjct4InstanceInfo([props.res]);
                    for (const key in classCodeIds) {
                        if (Object.prototype.hasOwnProperty.call(classCodeIds, key)) {
                            classCodeIds[key] = uniq(classCodeIds[key]);
                        }
                    }
                    commonDrawerRoot.setClass2Ids(props.id, classCodeIds);
                    writeDataToResponsiveDock([props.res]);
                }
            }
        }
    );
};
