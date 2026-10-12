import { createContext, useContext } from 'react';

export type BuildFloorItem = {
    id?: string | number;
    localName?: string;
    floors?: BuildFloorItem[];
    buildingName?: string;
    [key: string]: any;
};
interface TreeBuildFloorContextValue {
    getBuildOrFloorById: (id?: string | number) => BuildFloorItem | undefined;
    buildData: any[];
}
export const TreeBuildFloorContext = createContext<TreeBuildFloorContextValue | undefined>(undefined);

export const useTreeBuildFloor = () => {
    const context = useContext(TreeBuildFloorContext);
    if (!context) {
        throw new Error('useTreeBuildFloor must be used within TreeBuildFloorProvider');
    }
    return context;
};
