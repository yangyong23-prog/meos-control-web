import { genMediaInstance } from '../Graph';
import ObjectPicker from './ObjectPicker';
import BaseMedia from './BaseMedia';

export default class View {
    constructor(controller, model, renderContext) {
        this.controller = controller;
        this.model = model;
        this.renderContext = renderContext;
        this.domElement = renderContext.css3dRender.domElement;
        this.media = this.makeRootMedia();
        this.objectPicker = new ObjectPicker(this.media, this.renderContext);
    }

    makeRootMedia() {
        let media = genMediaInstance(this.model.name, [this.model, null]);
        if (!media) {
            media = new BaseMedia(this.model);
        }
        media.renderContext = this.renderContext;
        media.init();
        return media;
    }

    initialize() {
        // 外部已创建根节点
        const { scene } = this.renderContext;
        scene.add(this.media.object3D);

        this.objectPicker.initialize();
        this.objectPicker.addObserver('doubleclick', props => this.controller.viewOnDoubleClick(props));
        this.objectPicker.addObserver('click', props => this.controller.viewOnClick(props));
        this.objectPicker.addObserver('mousemove', props => this.controller.viewOnMouseMove(props));
        this.objectPicker.addObserver('general', props => this.controller.viewOnGeneral(props));
        this.objectPicker.addObserver('mouseleave', props => this.controller.viewOnMouseleave(props));

        this.renderContext.setFrameAnimationLoop(() => {
            this.media.onFrameRenderered();
        });
    }

    dispose() {
        this.model.dispose();
        this.media.dispose();
        this.objectPicker.dispose();
        this.renderContext.dispose();
        this.renderContext.materialManager.dispose();
        this.media = null;
        this.model = null;
    }
}
