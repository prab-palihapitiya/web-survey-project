import { CloseButton, ColorInput, Container, Flex, Grid, GridCol, Group, Select, Space, Text, TextInput } from "@mantine/core";
import classes from "@/app/ui/dashboard/settings/settings.module.css";

const TemplateForm = ({ onClose }: { onClose?: () => void }) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    }
    return (
        <Container className={classes.container}>
            <Grid>
                <GridCol>
                    <Flex justify={'space-between'}>
                        <Group justify="flex-start">
                            <TextInput
                                placeholder="Enter a name"
                                label="Template Name"
                                required
                                miw={'15rem'}
                            />
                        </Group>
                        <Group justify="flex-end">
                            <CloseButton onClick={handleClose} />
                        </Group>
                    </Flex>
                </GridCol>
                <GridCol>
                    <ColorInput
                        label="Logo Color"
                        placeholder="Select"
                    />
                    <Space h="xs" />
                    <Select
                        label="Logo Size"
                        placeholder="Pick value"
                        data={[
                            'xs', 'sm', 'md', 'lg', 'xl'
                        ]}
                    />
                    <Space h="xs" />
                    <ColorInput
                        label="Primary Color"
                        placeholder="Select"
                    />
                    <Space h="xs" />
                    <ColorInput
                        label="Background Color"
                        placeholder="Select"
                    />
                    <Space h="xs" />
                    <Select
                        label="Default Font Size"
                        placeholder="Pick value"
                        data={[
                            'xs', 'sm', 'md', 'lg', 'xl'
                        ]}
                    />
                </GridCol>
            </Grid>
        </Container>);

}

export default TemplateForm;