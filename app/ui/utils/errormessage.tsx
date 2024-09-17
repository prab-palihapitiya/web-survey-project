import { translations } from '@/app/lib/translations/default';
import { ErrorKey } from '@/app/lib/types';
import { Alert } from '@mantine/core';
import { IconExclamationCircleFilled } from '@tabler/icons-react';

const ErrorMessage = ({ message }: { message: ErrorKey }) => {
    const icon = <IconExclamationCircleFilled />;
    const translatedMessage = translations.survey.error[message] || message;
    console.log(translatedMessage);

    return (
        <Alert variant={'filled'} color="red" title={translatedMessage} icon={icon} radius="xs" p={'0.5rem'} style={{ fontSize: 'var(--mantine-font-size-xs)' }} />
    );
}

export default ErrorMessage;