import { translations } from '@/app/lib/translations/default';
import { ErrorKey } from '@/app/lib/types';
import { Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

const ErrorMessage = ({ message, style }: { message: ErrorKey, style?: { color: string, variant: string } }) => {
    const icon = <IconExclamationCircle />;
    const translatedMessage = translations.survey.error[message] || message;
    return (
        <Alert
            icon={icon}
            color={style?.color || 'red'}
            variant={style?.variant || 'filled'}>
            {translatedMessage}
        </Alert>
    );
}

export default ErrorMessage;