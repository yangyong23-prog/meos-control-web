// import dmpFile from 'dmp-file';
import { INTERFACE_PREFIX_BDTP_FILE } from '@/config'; // https://qa.ysbdtp.com/dtp-file-server
import { ApmFile } from 'yushu-js-utils';

const fackpProjectId = 'MEOI_RELATION_CHART';
const fileBucket = 'meoi-relation-chart-images';

ApmFile.setConfig({
    bdtpServer: INTERFACE_PREFIX_BDTP_FILE,
    fileBucket: fileBucket,
    projectId: fackpProjectId
});

export const uploadFile = file => {
    return ApmFile.upload(file);
};
