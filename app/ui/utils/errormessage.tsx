import { translations } from '@/app/lib/translations/default';
import { ErrorKey } from '@/app/lib/types';
import { Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

const ErrorMessage = ({ message }: { message: ErrorKey }) => {
    const icon = <IconExclamationCircle />;
    const translatedMessage = translations.survey.error[message] || message;
    return (
        <Alert icon={icon}>{translatedMessage}</Alert>
    );
}

export default ErrorMessage;