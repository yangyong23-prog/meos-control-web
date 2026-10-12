import View from './View/View';

export default class Controller {
    constructor(model, renderContext) {
        this.view = new View(this, model, renderContext);
        this.view.initialize();

        this.oldMouseMoveModel = null;

        this.hoverTimer = null;
    }

    viewOnClick(props = {}) {
        if (this.view.domElement.style.pointerEvents === 'none') return;
        const { model = null } = props;
        if (model) {
            if (this.delegate && typeof this.delegate.viewOnClickTarget === 'function') {
                this.delegate.viewOnClickTarget(props);
            }
        } else {
            if (this.delegate && typeof this.delegate.viewOnClickEmpty === 'function') {
                this.delegate.viewOnClickEmpty(props);
            }
        }
    }

    viewOnDoubleClick(props = {}) {
        if (this.view.domElement.style.pointerEvents === 'none') return;
        if (this.delegate && typeof this.delegate.viewOnDoubleClick === 'function') {
            this.delegate.viewOnDoubleClick(props);
        }
    }

    viewOnMouseMove(props = {}) {
        if (this.view.domElement.style.pointerEvents === 'none') return;
        const { event, model = null, point } = props;
        if (this.oldMouseMoveModel !== model) {
            if (this.delegate && typeof this.delegate.viewOnHoverTargetChanged === 'function') {
                this.delegate.viewOnHoverTargetChanged({
                    event,
                    controller: this,
                    newModel: model,
                    point
                });
            }
            this.oldMouseMoveModel = model;

            clearTimeout(this.hoverTimer);
            if (model) {
                this.hoverTimer = setTimeout(() => {
                    if (this.delegate && typeof this.delegate.viewOnLongHoverTargetChanged === 'function') {
                        this.delegate.viewOnLongHoverTargetChanged({
                            event,
                            controller: this,
                            newModel: model,
                            point
                        });
                    }
                }, 300);
            }
        }
        if (this.delegate && typeof this.delegate.viewOnMouseMove === 'function') {
            this.delegate.viewOnMouseMove(props);
        }
    }

    viewOnMouseleave(props = {}) {
        if (this.delegate && typeof this.delegate.viewOnMouseleave === 'function') {
            this.delegate.viewOnMouseleave(props);
        }
    }

    viewOnGeneral(props = {}) {
        if (this.delegate && typeof this.delegate.viewOnGeneral === 'function') {
            this.delegate.viewOnGeneral(props);
        }
    }

    dispose() {
        this.view.dispose();
        this.view = null;
        this.delegate = null;
    }
}
