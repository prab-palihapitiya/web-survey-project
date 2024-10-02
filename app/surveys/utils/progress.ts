export const getProgressBar = (props: any, value: number): any => {
    switch (props?.style || 'bar') {
        case 'bar':
            return 'progress-bar';
        default:
            return 'progress-bar';
    }
}