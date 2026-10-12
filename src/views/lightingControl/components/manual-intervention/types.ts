export interface Inherit {
    instanceId: string;
    instanceType: string;
    instanceName: string;
}
export interface InterventionProps {
    id?: string;
    runningMonitorSecondType?: string;
    instanceType?: string;
    instanceId?: string;

    beginTime?: string;
    endTime?: string;
    status?: 'EFFECTING' | 'CANCELLED' | 'COMPLETED';
    reason?: string;
    inherit?: Inherit[];
    configId?: string;
}
