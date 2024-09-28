import { CloseButton, ColorInput, Container, Flex, Grid, GridCol, Group, Select, Space, Text, TextInput } from "@mantine/core";
import classes from "@/app/ui/dashboard/settings/settings.module.css";
import { DefaultTemplate } from "@/app/lib/config/template-config";
import { useState } from "react";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import useTemplateStore from "@/app/lib/state/template-store";

const TemplateForm = ({ template, onClose }: { template?: any, onClose?: () => void }) => {
    const [templateData, setTemplateData] = useState<DefaultTemplate>(template?.obj || {});
    const setTemplate = useTemplateStore((state) => state.setTemplate);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    }

    useEffectAfterMount(() => {
        setTemplate(templateData);
    }, [templateData]);

    const handleSave = () => {
        // Save the template
    };

    return (
        <Container className={classes.container}>
            <Grid>
                <GridCol>
                    <Flex justify={'space-between'}>
                        <Group justify="flex-start">
                            <TextInput
                                placeholder="Enter a name"
                                label="Template Name"
                                defaultValue={templateData?.templateName || 'Untitled Template'}
                                required
                                miw={'15rem'}
                                onChange={
                                    (event) => {
                                        setTemplateData({ ...templateData, templateName: event.currentTarget.value });
                                    }
                                }
                            />
                            {/* <TextInput placeholder="Enter a description" label="Description" defaultValue={template?.description || ''} w={'30rem'} miw={'10rem'} /> */}
                        </Group>
                        <Group justify="flex-end">
                            <CloseButton onClick={handleClose} style={{
                                position: 'relative',
                                top: -15,
                                right: -6
                            }} />
                        </Group>
                    </Flex>
                </GridCol>
                <GridCol>
                    {/* <ColorInput
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
                    /> */}
                    <Space h="xs" />
                    <ColorInput
                        label="Primary Color"
                        placeholder="Select"
                        defaultValue={templateData?.primaryColor || ''}
                        onChange={
                            (value) => {
                                setTemplateData({ ...templateData, primaryColor: value });
                            }
                        }
                    />
                    <Space h="xs" />
                    <ColorInput
                        label="Secondary Color"
                        placeholder="Select"
                        defaultValue={templateData?.secondaryColor || ''}
                        onChange={
                            (value) => {
                                setTemplateData({ ...templateData, secondaryColor: value });
                            }} />
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