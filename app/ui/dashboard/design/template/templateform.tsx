import { Accordion, ColorInput, Container, FileInput, Grid, GridCol, NumberInput, Select, Space, Switch, Text, TextInput } from "@mantine/core";
import classes from "@/app/ui/dashboard/design/design.module.css";
import { DefaultTemplate, DefaultTemplateData } from "@/app/lib/config/template-config";
import { useState } from "react";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import useTemplateStore from "@/app/lib/state/template-store";
import { ButtonVariants, ErrorVariants, FlexPositions, FontFamily, FontSizes, FontWeight, GradientDirections, ProgressStyles, Radius, Sizes } from "@/app/surveys/utils/types";
import TemplatePreview from "./templatepreview";
import axios from "axios";

const TemplateForm = ({ template }: { template?: DefaultTemplate, onClose?: () => void }) => {
    const [templateData, setTemplateData] = useState(template || DefaultTemplateData);
    const setTemplate = useTemplateStore((state) => state.setTemplate);
    const [logo, setLogo] = useState<File | null>(null);
    const [bannerLogoFilePath, setBannerLogoFilePath] = useState<string>();

    useEffectAfterMount(() => {
        setTemplate(templateData);
    }, [templateData]);

    useEffectAfterMount(() => {
        if (logo) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target?.result as string;
                setTemplateData({ ...templateData, obj: { ...templateData.obj, logoSrc: base64Image } });
            }
            reader.readAsDataURL(logo);
        }
    }, [bannerLogoFilePath]);

    const handleLogoChange = async (file: File | null) => {
        if (file) {
            setLogo(file);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('customname', `tmp_b_lg_${template?.id}`);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await axios.post(`${apiUrl}/upload`, formData);
                setBannerLogoFilePath(response.data.path);

                setTemplateData({
                    ...templateData,
                    obj: {
                        ...templateData.obj,
                        logoFilePath: response.data.path
                    }
                });

            } catch (error) {
                console.error('Upload error:', error);
                // Handle error (e.g., display an error message to the user)
            }
        }
    };

    return (
        <Container className={classes.container}>
            <Grid>
                <GridCol span={4} style={{ overflowY: 'auto', height: '84vh' }}>
                    <TextInput
                        placeholder="Enter a name"
                        label="Template Name"
                        variant='filled'
                        defaultValue={templateData?.templateName || 'Untitled Template'}
                        required
                        onChange={
                            (event) => {
                                setTemplateData({ ...templateData, templateName: event.currentTarget.value });
                            }
                        }
                    />
                    <Space h="md" />
                    <Accordion variant="separated" radius={0}>
                        <Accordion.Item value="default">
                            <Accordion.Control style={{
                                fontSize: '12px',
                            }}>
                                Default Styles
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Select
                                    label="Default Font Family"
                                    placeholder="Pick value"
                                    data={FontFamily}
                                    value={templateData?.obj?.fontFamily || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, fontFamily: value as string } });
                                        }
                                    }
                                />
                                <Space h="xs" />
                                <Select
                                    label="Default Font Size"
                                    placeholder="Pick value"
                                    data={FontSizes}
                                    value={templateData?.obj?.fontSize || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, fontSize: value as string } });
                                        }
                                    }
                                />
                                <Space h="xs" />
                                <Select
                                    label="Default Font Weight"
                                    placeholder="Pick value"
                                    data={FontWeight}
                                    defaultValue={templateData?.obj?.fontWeight || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, fontWeight: value as string } });
                                        }
                                    }
                                />
                                <Space h="xs" />
                                <ColorInput
                                    label="Primary Color"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.primaryColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, primaryColor: value } });
                                        }
                                    }
                                />
                                <Space h="xs" />
                                <ColorInput
                                    label="Secondary Color"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.secondaryColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, secondaryColor: value } });
                                        }
                                    }
                                />
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="error">
                            <Accordion.Control style={{
                                fontSize: '12px'
                            }}>
                                Error Message
                            </Accordion.Control>
                            <Accordion.Panel>
                                <ColorInput
                                    label="Error Color"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.errorColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, errorColor: value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Error Variant"
                                    placeholder="Pick value"
                                    data={ErrorVariants}
                                    defaultValue={templateData?.obj?.errorVariant || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, errorVariant: value as string } });
                                        }
                                    }
                                />
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="banner">
                            <Accordion.Control style={{
                                fontSize: '12px'
                            }}>
                                Top Banner
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Switch
                                    size="xs"
                                    label="Banner Gradient"
                                    defaultChecked={templateData?.obj?.bannerShowGradient || false}
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, bannerShowGradient: event.currentTarget.checked } });
                                        }
                                    }
                                />
                                <Space h="lg" />
                                <ColorInput
                                    label="Banner Background Color (Primary)"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.bannerPrimaryColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, bannerPrimaryColor: value } });
                                        }
                                    }
                                />
                                <Space h="xs" />
                                <ColorInput
                                    label="Banner Background Color (Secondary)"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.bannerSecondaryColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, bannerSecondaryColor: value } });
                                        }
                                    }
                                />
                                <Space h="xs" />
                                <Select
                                    label="Gradient Direction"
                                    placeholder="Pick value"
                                    data={GradientDirections}
                                    defaultValue={templateData?.obj?.bannerGradientDirection || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, bannerGradientDirection: value as string } });
                                        }
                                    }
                                />
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="logo">
                            <Accordion.Control style={{
                                fontSize: '12px'
                            }}>
                                Branding
                            </Accordion.Control>
                            <Accordion.Panel>
                                <FileInput
                                    label="Upload Logo"
                                    placeholder="Select file"
                                    accept="image/*"
                                    value={logo}
                                    onChange={handleLogoChange}
                                />

                                <Space h="xs" />
                                <TextInput
                                    label="Logo Alt Text"
                                    placeholder="Enter text"
                                    defaultValue={templateData?.obj?.logoAltText || ''}
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, logoAltText: event.currentTarget.value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <TextInput
                                    label="Logo Title"
                                    placeholder="Enter title"
                                    defaultValue={templateData?.obj?.logoTitle || ''}
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, logoTitle: event.currentTarget.value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <TextInput label="Logo URL" placeholder="Enter url"
                                    defaultValue={templateData?.obj?.logoUrl || ''}
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, logoUrl: event.currentTarget.value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Logo Size"
                                    placeholder="Pick value"
                                    data={Sizes}
                                    defaultValue={templateData?.obj?.logoSize || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, logoSize: value as string } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Logo Radius"
                                    placeholder="Pick value"
                                    data={Radius}
                                    defaultValue={templateData?.obj?.logoRadius || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, logoRadius: value as string } });
                                        }
                                    }
                                />
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="progress">
                            <Accordion.Control style={{
                                fontSize: '12px'
                            }}>
                                Progress Bar
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Select
                                    label="Progress Style"
                                    placeholder="Pick value"
                                    data={ProgressStyles}
                                    defaultValue={templateData?.obj?.progressStyle || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressStyle: value as string } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <ColorInput
                                    label="Progress Color"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.progressColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressColor: value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <ColorInput
                                    label="Progress Label Color"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.progressLabelColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressLabelColor: value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Progress Radius"
                                    placeholder="Pick value"
                                    data={Radius}
                                    defaultValue={templateData?.obj?.progressRadius || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressRadius: value as string } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Progress Size"
                                    placeholder="Pick value"
                                    data={Sizes}
                                    defaultValue={templateData?.obj?.progressSize || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressSize: value as string } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <NumberInput
                                    label="Bar Length"
                                    placeholder="Enter value"
                                    rightSection={<Text size="xs" pr={3}>px</Text>}
                                    defaultValue={templateData?.obj?.progressBarLength || 0}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressBarLength: value as number } });
                                        }
                                    }
                                />

                                <Space h="md" />
                                <Switch
                                    defaultChecked={templateData?.obj?.progressAnimated || false}
                                    size="xs"
                                    label="Animated"
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressAnimated: event.currentTarget.checked } });
                                        }
                                    }
                                />

                                <Space h="sm" />
                                <NumberInput
                                    label="Circle Size"
                                    placeholder="Enter value"
                                    rightSection={<Text size="xs" pr={3}>px</Text>}
                                    defaultValue={templateData?.obj?.progressCircleSize || 0}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressCircleSize: value as number } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <NumberInput
                                    label="Circle Thickness"
                                    placeholder="Enter value"
                                    rightSection={<Text size="xs" pr={3}>px</Text>}
                                    defaultValue={templateData?.obj?.progressCircleThickness || 0}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressCircleThickness: value as number } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <ColorInput
                                    label="Empty Segment Color"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.progressEmptySegmentColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, progressEmptySegmentColor: value } });
                                        }
                                    }
                                />
                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="navigation">
                            <Accordion.Control style={{
                                fontSize: '12px'
                            }}>
                                Navigation Buttons
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Select
                                    label="Navigation Style"
                                    placeholder="Pick value"
                                    data={FlexPositions}
                                    defaultValue={templateData?.obj?.navFlexDirection || 'center'}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, navFlexDirection: value as string } });
                                        }
                                    }
                                />

                                <Space h="md" />
                                <Switch
                                    size="xs"
                                    label="Show Only Arrows"
                                    defaultChecked={templateData?.obj?.navArrows || false}
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, navArrows: event.currentTarget.checked } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Switch
                                    size="xs"
                                    label="Bottom Fixed"
                                    defaultChecked={templateData?.obj?.navBottomFixed || false}
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, navBottomFixed: event.currentTarget.checked } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Switch
                                    defaultChecked={templateData?.obj?.prevButtonShow || true}
                                    size="xs"
                                    label="Show Previous Button"
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, prevButtonShow: event.currentTarget.checked } });
                                        }
                                    }
                                />

                                <Space h="md" />
                                <TextInput
                                    label="Previous Button Text"
                                    placeholder="Enter text"
                                    defaultValue={templateData?.obj?.prevButtonText || 'Previous'}
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, prevButtonText: event.currentTarget.value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Previous Button Variant"
                                    placeholder="Pick value"
                                    data={ButtonVariants}
                                    defaultValue={templateData?.obj?.prevButtonVariant || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, prevButtonVariant: value as string } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <ColorInput
                                    label="Previous Button Color"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.prevButtonColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, prevButtonColor: value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Previous Button Size"
                                    placeholder="Pick value"
                                    data={Sizes}
                                    defaultValue={templateData?.obj?.prevButtonSize || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, prevButtonSize: value as string } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Previous Button Radius"
                                    placeholder="Pick value"
                                    data={Radius}
                                    defaultValue={templateData?.obj?.prevButtonRadius || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, prevButtonRadius: value as string } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <TextInput
                                    label="Next Button Text"
                                    placeholder="Enter text"
                                    defaultValue={'Next'}
                                    onChange={
                                        (event) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, nextButtonText: event.currentTarget.value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Next Button Variant"
                                    placeholder="Pick value"
                                    data={ButtonVariants}
                                    defaultValue={templateData?.obj?.nextButtonVariant || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, nextButtonVariant: value as string } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <ColorInput
                                    label="Next Button Color"
                                    placeholder="Select"
                                    defaultValue={templateData?.obj?.nextButtonColor || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, nextButtonColor: value } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Next Button Size"
                                    placeholder="Pick value"
                                    data={Sizes}
                                    defaultValue={templateData?.obj?.nextButtonSize || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, nextButtonSize: value as string } });
                                        }
                                    }
                                />

                                <Space h="xs" />
                                <Select
                                    label="Next Button Radius"
                                    placeholder="Pick value"
                                    data={Radius}
                                    defaultValue={templateData?.obj?.nextButtonRadius || ''}
                                    onChange={
                                        (value) => {
                                            setTemplateData({ ...templateData, obj: { ...templateData.obj, nextButtonRadius: value as string } });
                                        }
                                    }
                                />

                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </GridCol>
                <GridCol span={8} style={{
                    position: 'fixed',
                    right: 10,
                    width: '100%',
                    paddingInlineStart: '5rem'
                }}>
                    <TemplatePreview template={templateData?.obj} />
                </GridCol>
            </Grid>
        </Container>);
}

export default TemplateForm;