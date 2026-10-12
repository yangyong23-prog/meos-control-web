import { defineStore } from 'pinia';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import baseStore from '@/store/baseStore';
import { SUCCESSCODE } from '@/utils/globalVariables';
import xplantindoorenvStore from './xplantindoorenv';

const treeBuildFloorStore = defineStore('treeBuildFloor', {
    state: () => {
        return {
            buildFloorMap: new Map(),
            treeBuildFloor: []
        };
    },
    getters: {
        getBuildOrFloor() {
            return id => this.buildFloorMap.get(id);
        }
    },
    actions: {
        async handleTreeBuildingFloorData(obj) {
            this.treeBuildFloor = [];
            this.buildFloorMap = new Map();
            const parasm = {
                projectId: baseStore().projectId,
                isQuerySpace: false
            };
            const { data, code } = await getListTreeBuildingFloorSpace(obj || parasm);
            if (code === SUCCESSCODE) {
                xplantindoorenvStore().setBuildingData(data);
                xplantindoorenvStore().setBuildingFloorData(data);
                data.forEach(element => {
                    this.buildFloorMap.set(element.id, element);
                    element.floors.forEach(floor => {
                        floor.buildingName = element.localName;
                        this.buildFloorMap.set(floor.id, floor);
                    });
                });
                this.treeBuildFloor = data;
            }
            return { data, code };
        }
    }
});

export default treeBuildFloorStore;
