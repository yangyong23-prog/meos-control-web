import { Crypto, System, SystemStorage, json_string_server_names as jssn } from 'persagy-tools';

const conf = {
    key: '1234123412ABCDEF',
    iv: 'ABCDEF1234123412'
};

export const cryptoInstance = new Crypto(conf);

export const systemInstance = new System(conf);

export const storageInstance = new SystemStorage(conf);

export const jsonStringServerNames = jssn;

export default { cryptoInstance, systemInstance, storageInstance, jsonStringServerNames };
