import BrButton from './br-button';
import BrBable from './br-table';

export default {
    install(app: any) {
        app.component(BrButton.name, BrButton);
        app.component(BrBable.name, BrBable);
    }
};
