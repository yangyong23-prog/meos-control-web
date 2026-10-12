import { toast } from 'sonner';

type ToastType = 'success' | 'error';

interface ShowCustomToastOptions {
    message: string;
    type?: ToastType;
}

const getToastConfig = (type: ToastType) => {
    switch (type) {
        case 'success':
            return {
                backgroundColor: 'rgb(34, 197, 94)',
                iconPath: 'M5 13l4 4L19 7'
            };
        case 'error':
            return {
                backgroundColor: 'rgb(239, 68, 68)',
                iconPath: 'M6 18L18 6M6 6l12 12'
            };
    }
};

export const showCustomToast = (options: ShowCustomToastOptions) => {
    const { message, type = 'success' } = options;
    const config = getToastConfig(type);

    toast.custom(t => (
        <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg"
            style={{
                backgroundColor: config.backgroundColor,
                color: 'white',
                transition: 'all 0.3s ease'
            }}
        >
            <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={config.iconPath} />
            </svg>
            <span>{message}</span>
        </div>
    ));
};

export const showSuccessToast = (message: string) => {
    showCustomToast({ message, type: 'success' });
};

export const showErrorToast = (message: string) => {
    showCustomToast({ message, type: 'error' });
};
