import { ActionIcon, Button, Card, Center, Group, Text } from "@mantine/core";
import { IconExternalLink, IconTrash, IconX } from "@tabler/icons-react";
import classes from "@/app/ui/dashboard/settings/settings.module.css";
import { deleteTemplate } from "@/app/lib/services/template-service";

const TemplateCard = ({ tempId, template, onOpen, onDelete }: { tempId?: string, template: any, onOpen?: () => void, onDelete?: () => void }) => {

    const defaultColor = 'var(--mantine-color-dark-5)';
    const defaultTemplateName = 'Untitled Template';

    return (
        <Card shadow="xl" style={{
            background: `linear-gradient(to left, ${template.primaryColor || defaultColor}, ${template.secondaryColor || defaultColor})`,
            position: 'relative' // Add position relative for absolute positioning of trash button
        }} className={classes.template}>
            <Center h={'5rem'}>
                <Text size="xs" fw={500} className={classes.template_text}>{template.templateName || defaultTemplateName}</Text>
                <Group gap={4} className={classes.hidden_buttons}>
                    <Button size="xs" variant="outline" color="white" onClick={() => {
                        console.log('preview the built in survey with the selected template as a model');
                    }}>Preview<IconExternalLink size={16} style={{ marginInlineStart: '0.3rem' }} /></Button>
                    <Button size="xs" variant="outline" color="white" onClick={onOpen}>Open</Button>
                </Group>
            </Center>
            {onDelete && <ActionIcon
                size="md"
                variant="subtle"
                color="white"
                onClick={() => {
                    onDelete();
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0
                }}
                className={classes.hidden_buttons} // Add the hidden_buttons class
            >
                <IconX size={16} />
            </ActionIcon>}
        </Card>
    );
}

export default TemplateCard;