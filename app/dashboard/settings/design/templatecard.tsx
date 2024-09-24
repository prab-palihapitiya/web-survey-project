import { Button, Card, Center, Group, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import classes from "@/app/ui/dashboard/settings/settings.module.css";

const TemplateCard = ({ templateName, primaryColor, secondaryColor }: { templateName: string, primaryColor: string, secondaryColor: string }) => {
    return (
        <Card shadow="xl" style={{
            background: `linear-gradient(to left, ${primaryColor}, ${secondaryColor})`
        }} className={classes.template}>
            <Center h={'5rem'}>
                <Text size="xs" fw={500} className={classes.template_text}>{templateName}</Text>
                <Group gap={4} className={classes.hidden_buttons}>
                    <Button size="xs" variant="outline" color="white">Preview<IconExternalLink size={16} style={{ marginInlineStart: '0.3rem' }} /></Button>
                    <Button size="xs" variant="outline" color="white">Select</Button>
                </Group>
            </Center>
        </Card>
    );
}

export default TemplateCard;