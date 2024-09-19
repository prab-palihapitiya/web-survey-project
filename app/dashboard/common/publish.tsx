import { useDisclosure } from '@mantine/hooks';
import { Button, Group, TextInput, Dialog, LoadingOverlay } from '@mantine/core';
import { IconCopy, IconExternalLink, IconHomeUp, IconShare } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { saveQuestionnaireData } from '@/app/lib/services/questionnaire-service';
import { createGuid } from '@/app/lib/utils/utils';
import { Status } from '@/app/lib/types';
import useQuestionnaireStore from '@/app/lib/state/questionnaire-store';

const PublishButton = ({ id, onPublish, published, url }: { id: string, onPublish?: (arg0: string) => void, published: boolean, url: string }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [publishing, setPublishing] = useState(false);
    const { name, questions, logic, answers } = useQuestionnaireStore();

    const inputRef = useRef<HTMLInputElement>(null);
    const placeholderUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/surveys/${id}/public?_p=`;

    const createLink = () => {
        setPublishing(true);

        if (onPublish) {
            const url = placeholderUrl + createGuid();
            saveQuestionnaireData(id, questions, logic, answers, { name: name, pubUrl: url, status: Status.PUBLISHED });
            onPublish(url);
        }

        setPublishing(false);
    };

    const copyUrl = () => {
        if (inputRef.current) { // Check if the ref is valid
            navigator.clipboard.writeText(inputRef.current.value);
            inputRef.current.select(); // Select the text in the input
        }
    };

    const openUrl = () => {
        const pubUrl = inputRef.current?.value;
        if (pubUrl) {
            window.open(url, '_blank'); // Open the URL in a new tab/window
        }
    };

    return (
        <>
            <Dialog
                opened={opened}
                withCloseButton
                onClose={close}
                size="xl"
                shadow='xl'
                zIndex={400}
                position={{ bottom: 60, right: 10 }}
                style={{
                    backdropFilter: 'blur(2px)',
                    backgroundColor: published ? 'var(--mantine-color-green-5)' : 'var(--mantine-color-grape-5)',
                }}
            >
                <LoadingOverlay visible={publishing} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Group align="flex-end" gap={5}>
                    <TextInput
                        label={published ? 'Copy link' : 'Create link'}
                        placeholder={placeholderUrl}
                        style={{ flex: 1, cursor: 'copy' }}
                        value={url || ''}
                        readOnly
                        ref={inputRef}
                    />
                    {published ? (
                        <Group gap={5}>
                            <Button size='xs' variant='gradient' onClick={copyUrl}><IconCopy size={16} /></Button>
                            <Button size='xs' color={'black'} onClick={openUrl}>
                                <IconExternalLink size={16} />
                            </Button>
                        </Group>
                    ) : (
                        <Button variant='gradient' onClick={createLink}>Create & Publish</Button>
                    )}
                </Group>
            </Dialog>

            {/* {btnType === 'Normal' ?
                (<Button size='xs' color={'grape'} onClick={open}>
                    <IconHomeUp size={16} style={{ marginInlineEnd: '0.5rem' }} />Publish
                </Button>)
                : (<Button variant='subtle' color={'grape'} onClick={open}>
                    <IconHomeUp size={16} />
                </Button>)} */}

            {published ? (
                <Button size='xs' color={'dark'} onClick={open}>
                    <IconShare size={16} style={{ marginInlineEnd: '0.5rem' }} />Public</Button>
            ) : (
                <Button size='xs' color={'grape'} onClick={open}>
                    <IconHomeUp size={16} style={{ marginInlineEnd: '0.5rem' }} />Publish</Button>
            )}
        </>
    );
}

export default PublishButton;