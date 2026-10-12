// @ts-ignore
import i18n from '@/localization';
import baseStore from '@/store/baseStore';

export const CLASSCODE = () => (baseStore().isCoolHotSystem ? 'ACCI' : 'ACCC');

export const HASRUNSTATUS = () =>
    baseStore().isCoolHotSystem
        ? ['ACAHC', 'ACCHCH', 'ACCCAH']
        : ['ACOTU', 'ACCCOP', 'ACCCCC', 'ACCCSC', 'ACCCCP', 'ACCCPC', 'ACCCAC', 'ACCCOF', 'ACGEHE', 'ACGEFP', 'ACCCCD', 'ACGEET', 'ACCCWT', 'ACVVEJ', 'ACOTG'];
// 改为函数形式，避免模块初始化时 i18n 未完成初始化的问题
export const HOVEREQUIPMENTTIPS = () => i18n.global.t('meos_control_web.fault_offline_local_cannot_operate');
export const EQSTATUS = ['onlineStatus', 'runStatus', 'faultStatus', 'localRemoteStatus', 'manualAutoStatus', 'switchStatus', 'rcRunStatus'];
// 'ACCCCP', 'ACCCOP', 'ACGEHE', 'ACCCOF'
export const EQUIPMENTCONTROL: any = () =>
    baseStore().isCoolHotSystem
        ? {
              ACAHC: 'enableCtrl',
              ACCCAH: 'equipSwitchSet',
              ACCHCH: 'equipSwitchSet',
              ACVVEO: 'switchStatusCtrl'
          }
        : {
              ACCCCP: 'equipSwitchSet',
              ACCCOP: 'equipSwitchSet',
              ACGEHE: 'equipSwitchSet',
              ACCCOF: 'equipSwitchSet',
              // ACCCSC: 'equipSwitchSet',
              ACVVEO: 'switchStatusCtrl',
              ACGEFP: 'equipSwitchSet'
          };

export const HASCONTROL = () =>
    baseStore().isCoolHotSystem ? ['ACAHC', 'ACCHCH', 'ACCCAH', 'ACVVEO', 'ACVVEJ', 'ACGEHE'] : ['ACCCCC', 'ACCCSC', 'ACOTU', 'ACCCOP', 'ACCCCP', 'ACGEHE', 'ACVVEJ', 'ACVVEO'];
export const HASAUTO = () =>
    baseStore().isCoolHotSystem ? ['ACAHC', 'ACCHCH', 'ACVVEJ', 'ACVVEO', 'ACCCAH'] : ['ACCCCC', 'ACCCSC', 'ACOTU', 'ACCCOP', 'ACCCCP', 'ACGEHE', 'ACVVEJ', 'ACVVEO'];
// 在线和运行都有
export const HASONLIEANDRUNSTATUS = () => (baseStore().isCoolHotSystem ? ['ACAHC', 'ACCHCH'] : ['ACCCCC', 'ACCCSC', 'ACCCPC', 'ACCCAC', 'ACCCCP', 'ACCCOP', 'ACGEFP']);

export const ONLYONLIE = () => (baseStore().isCoolHotSystem ? ['ACCCCD', 'ACGEET', 'ACCCWT', 'ACVVEJ'] : ['ACCCCD', 'ACGEET', 'ACCCWT', 'ACCCOF', 'ACVVEJ', 'ACGEFP']);

export const ONLYRUNSTATUS = () => (baseStore().isCoolHotSystem ? ['ACCCAH'] : ['ACOTG', 'ACGEHE']);

export const HASRCRUNSTATUS = () => (baseStore().isCoolHotSystem ? ['ACAHC', 'ACCHCH'] : ['ACCCCC', 'ACCCSC', 'ACCCOP', 'ACCCCP', 'ACCCOF', 'ACGEFP']);

export const WATERREFILLTEXT = () => ['ACCCWT', 'ACGEET', 'ACGEST', 'ACCCOT', 'ACGEFP'];
