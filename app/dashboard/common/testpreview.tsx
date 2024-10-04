import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, TextInput, Dialog } from '@mantine/core';
import { IconCopy, IconExternalLink, IconHomeUp } from '@tabler/icons-react';
import { useState } from 'react';
import { createGuid } from '@/app/lib/utils/utils';

const TestButton = ({ id }: { id: string }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [created, setCreated] = useState(false);
    const [testUrl, setTestUrl] = useState('');

    const placeholderUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/surveys/${id}/test?_t=`;

    const createLink = () => {
        const url = placeholderUrl + createGuid();
        setTestUrl(url);
        setCreated(true);
    };

    const copyUrlToClipboard = () => {
        navigator.clipboard.writeText(testUrl);
    };

    return (
        <div>
            <Dialog
                opened={opened}
                withCloseButton={true}
                onClose={close}
                size="lg"
                position={{ bottom: 70, right: 20 }}
            >
                <Group align="flex-end">
                    <TextInput
                        label='Create a test link'
                        placeholder={placeholderUrl}
                        style={{ flex: 1, cursor: 'copy' }}
                        value={testUrl}
                        disabled
                    />
                    {created ? <Button size='xs' color='green' onClick={copyUrlToClipboard}><IconCopy size={16} /></Button> : (
                        <Button variant='gradient' onClick={createLink}>Create</Button>
                    )}
                </Group>
            </Dialog>

            <Button size='xs' color={'black'} onClick={open}>
                Test Preview<IconExternalLink size={16} style={{ marginInlineStart: '0.5rem' }} />
            </Button>
        </div>
    );
}

export default TestButton;