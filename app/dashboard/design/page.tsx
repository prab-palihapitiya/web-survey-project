'use client';
import { Button, Card, Center, Container, Divider, Grid, GridCol, Group, rem, Select, Text } from "@mantine/core";
import classes from "@/app/ui/dashboard/design/design.module.css";
import { useDisclosure } from "@mantine/hooks";
import TemplateCard from "@/app/ui/dashboard/design/template/templatecard";
import TemplateForm from "@/app/ui/dashboard/design/template/templateform";
import { useState } from "react";
import BuiltTemplates from "@/app/lib/predefinedtemplates";
import { createTemplate, deleteTemplate, fetchTemplatesByUser, saveTemplate } from "@/app/lib/services/template-service";
import useTemplateStore from "@/app/lib/state/template-store";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { useRouter } from "next/navigation";
import { DefaultTemplate } from "@/app/lib/config/template-config";

export default function Page({
    searchParams
}: {
    searchParams?: {
        id?: string;
    };
}) {
    const [selectedTemplate, setSelectedTemplate] = useState<DefaultTemplate | null>();
    const [opened, { open, close }] = useDisclosure(false);
    const [templates, setTemplates] = useState([]);
    const [isPredefined, setIsPredefined] = useState(false);
    const template = useTemplateStore((state) => state.template);

    const router = useRouter();

    useEffectAfterMount(() => {
        doFetchTemplates();
    }, [opened]);

    const doFetchTemplates = async () => {
        try {
            const response = await fetchTemplatesByUser();
            if (response && response.data) {
                setTemplates(response.data);
            } else {
                console.error("No data received from the API.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteTemplate = (id: string) => async () => {
        try {
            // TODO - Add a confirmation dialog before deleting the template
            await deleteTemplate(id);
            doFetchTemplates();
        } catch (error) {
            console.error("Error deleting template:", error);
        }
    }

    return (
        <Container className={classes.container}>
            <div className={classes.top_bar}>
                <Group justify="flex-start">
                    <Select
                        variant="filled"
                        placeholder="Select a Questionnaire"
                    // data={questionnaires.map((q: { id: string, name: string }) => ({ value: q.id, label: q.name }))}
                    // value={selectedQuestionnaireId || questionnaireId === paramId ? questionnaireId : ''}
                    // onChange={handleQuestionnaireSelect}
                    />
                </Group>
                <Group justify="flex-end">
                </Group>
            </div>
            <div>
                {opened ? <TemplateForm template={selectedTemplate as DefaultTemplate} onClose={() => {
                    close();
                    setSelectedTemplate(null);
                    setIsPredefined(false);
                }} /> : (
                    <div>
                        <Group>
                            <Card
                                shadow="xl"
                                className={classes.new_template}
                                onClick={() => {
                                    setSelectedTemplate(null);
                                    open();
                                }}>
                                <Center h={'5rem'}>
                                    <Text size="xs" fw={500}>+ New Design Template</Text>
                                </Center>
                            </Card>
                            {templates.map((t: any) => (
                                <TemplateCard
                                    key={t.id}
                                    // tempId={t.id}
                                    template={t.obj}
                                    onOpen={() => {
                                        setSelectedTemplate({ ...t.obj, id: t.id });
                                        open();
                                    }}
                                    onDelete={handleDeleteTemplate(t.id)}
                                />
                            ))}
                        </Group>
                        <Divider
                            label="Built-in Templates"
                            labelPosition="left"
                            style={{
                                margin: '1rem 0'
                            }}
                        />
                        <Group>
                            {BuiltTemplates.map((t: any, index) => (
                                <TemplateCard
                                    key={index}
                                    // tempId={t.templateId}
                                    template={t}
                                    onOpen={() => {
                                        setIsPredefined(true);
                                        setSelectedTemplate(t);
                                        open();
                                    }}
                                />
                            ))}
                        </Group>
                    </div>
                )}
            </div>
            <Grid className={classes.bottom_bar}>
                <GridCol>
                    <Group gap={"xs"}>
                        {(opened) && <Button size='xs' variant="gradient" onClick={() => {
                            if (selectedTemplate) {
                                if (isPredefined) {
                                    createTemplate(template);
                                    setIsPredefined(false);
                                    return;
                                }
                                saveTemplate(selectedTemplate.id, template);
                            } else {
                                createTemplate(template);
                            }
                        }}>{isPredefined ? 'Save As New Template' : 'Save Design Template'}</Button>}
                        <Button size='xs' color="dark" onClick={
                            () => {
                                if (opened) {
                                    setSelectedTemplate(null);
                                    setIsPredefined(false);
                                    close();
                                } else {
                                    router.push('/dashboard');
                                }
                            }
                        }>{opened ? 'Close Style' : 'Close Settings'}</Button>
                    </Group>
                </GridCol>
            </Grid>
        </Container >
    );
}
