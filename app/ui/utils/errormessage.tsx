import { translations } from '@/app/lib/translations/default';
import { ErrorKey } from '@/app/lib/types';
import { Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

const ErrorMessage = ({ message }: { message: ErrorKey }) => {
    const icon = <IconExclamationCircle size={16} />;
    const translatedMessage = translations.survey.error[message] || message;
    return (
        <Alert variant={'filled'} color="red" icon={icon} radius={0} p={'0.3rem'} style={{ fontSize: 'var(--mantine-font-size-xs)' }}>{translatedMessage}</Alert>
    );
}

export default ErrorMessage;