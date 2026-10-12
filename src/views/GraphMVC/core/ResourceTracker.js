/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
import * as THREE from '@yushu/three-base';

export default class ResourceTracker {
    constructor() {
        this.resources = new Set();
    }

    track(resource) {
        try {
            if (!resource) {
                return resource;
            }
            if (Array.isArray(resource)) {
                resource.forEach(r => this.track(r));
                return resource;
            }

            if (resource.dispose || resource instanceof THREE.Object3D) {
                this.resources.add(resource);
            }
            if (resource instanceof THREE.Object3D) {
                this.track(resource.children);
                this.track(resource.material);
                this.track(resource.geometry);
            } else if (resource instanceof THREE.Material) {
                for (const value of Object.values(resource)) {
                    if (value instanceof THREE.Texture) {
                        this.track(value);
                    }
                }
                if (resource.uniforms) {
                    for (const value of Object.values(resource.uniforms)) {
                        if (value) {
                            const uniformValue = value.value;
                            if (uniformValue instanceof THREE.Texture || Array.isArray(uniformValue)) {
                                this.track(uniformValue);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            /*
            //TODO 升级three版本？
            LineMaterial获取不到dashOffset导致【for (const value of Object.values(resource))】报错
                 TypeError: Cannot read properties of undefined (reading 'value')
                at LineMaterial.get [as dashOffset] (LineMaterial.js?94d7:533:1)
                at values (<anonymous>)
                at ResourceTracker.track (ResourceTracker.js?cc60:29:37)
                at ResourceTracker.track (ResourceTracker.js?cc60:26:22)
                at eval (ResourceTracker.js?cc60:16:44)
                at Array.forEach (<anonymous>)
                at ResourceTracker.track (ResourceTracker.js?cc60:16:25)
                at ResourceTracker.track (ResourceTracker.js?cc60:27:22)
                at LinkLineMedia.init (BaseMedia.js?3afa:28:30)
                at new LinkLineMedia (LinkLineMedia.js?8265:13:14)
            */
        }
        return resource;
    }

    untrack(resource) {
        this.resources.delete(resource);
    }

    dispose() {
        for (const resource of this.resources) {
            this._release(resource);
        }
        this.resources.clear();
    }

    // MARK: - Private

    _release(resource) {
        if (resource.dispose) {
            resource.dispose();
        }
    }
}
