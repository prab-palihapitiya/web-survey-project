'use client';
import { Button, Card, Center, Container, Divider, Grid, GridCol, Group, rem, Select, Text } from "@mantine/core";
import classes from "@/app/ui/dashboard/design/design.module.css";
import { useDisclosure } from "@mantine/hooks";
import TemplateCard from "@/app/ui/dashboard/design/template/templatecard";
import TemplateForm from "@/app/ui/dashboard/design/template/templateform";
import { useEffect, useState } from "react";
import BuiltTemplates from "@/app/lib/predefinedtemplates";
import { createTemplate, deleteTemplate, fetchTemplatesByUser, saveTemplate } from "@/app/lib/services/template-service";
import useTemplateStore from "@/app/lib/state/template-store";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { useRouter } from "next/navigation";
import { DefaultTemplate, DefaultTemplateData } from "@/app/lib/config/template-config";
import { fetchQuestionnaire, fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import useDashboardStore from "@/app/lib/state/dashboard-store";

export default function Page({
    searchParams
}: {
    searchParams?: {
        id?: string;
    };
}) {
    const setNavLinkIndex = useDashboardStore((state) => state.setNavLinkIndex);
    setNavLinkIndex(3);

    const [questionnaires, setQuestionnaires] = useState([]); // To store the list of questionnaires
    const [selectedTemplate, setSelectedTemplate] = useState<DefaultTemplate | null>();
    const [opened, { open, close }] = useDisclosure(false);
    const [templates, setTemplates] = useState([]);
    const [isPredefined, setIsPredefined] = useState(false);
    const [saveDisabled, setSaveDisabled] = useState(true);
    const template = useTemplateStore((state) => state.template);
    const questionnaireId = useQuestionnaireStore((state) => state.id);
    const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
    const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string>('');

    const router = useRouter();
    const paramId = searchParams?.id;

    useEffect(() => {
        const userId = "clzyfzfg300002y2l8a7du5lf"; // TODO: Replace with how you get the actual user ID

        fetchQuestionnairesByUser(userId)
            .then((response) => {
                setQuestionnaires(response.data);
            })
            .catch((error) => {
                console.error("Error fetching questionnaires:", error);
            });
    }, []);

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

    const handleQuestionnaireSelect = (value: string | null) => {
        if (!value) {
            return;
        }
        setSelectedQuestionnaireId(value);
        setQuestionnaireId(value);

        // setIsLoading(true);
        fetchQuestionnaire(value)
            .then((response) => {
                setQuestionnaireId(response.data.id);
                setQuestionnaire(response.data.obj);
                // router.push(`/dashboard/preview?id=${value}`); // Navigate to the selected questionnaire preview
            })
            .finally(() => {
                // setIsLoading(false);
            });
    };

    const handleCreateNewTemplate = async () => {
        // TODO - Add a confirmation dialog before create the template
        setSelectedTemplate(null);
        try {
            const newtempId = await createTemplate(DefaultTemplateData);
            const newTemplate = { ...DefaultTemplateData, id: newtempId };
            setSelectedTemplate(newTemplate);
            open();
        } catch (error) {
            console.error("Error creating template:", error);
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

    const handleTemplateChange = () => {
        setSaveDisabled(false);
    }

    const saveChanges = async () => {
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
        setSaveDisabled(true);
    }

    return (
        <Container className={classes.container}>
            <div className={classes.top_bar}>
                <Group justify="flex-start">
                    <Select
                        variant="filled"
                        placeholder="Select a Questionnaire"
                        data={questionnaires.map((q: { id: string, name: string }) => ({ value: q.id, label: q.name }))}
                        value={selectedQuestionnaireId || questionnaireId === paramId ? questionnaireId : ''}
                        onChange={handleQuestionnaireSelect}
                    />
                </Group>
                <Group justify="flex-end">
                </Group>
            </div>
            <div>
                {opened ? <TemplateForm template={selectedTemplate as DefaultTemplate} onChange={handleTemplateChange} /> : (
                    <div>
                        <Group>
                            <Card
                                shadow="xl"
                                className={classes.new_template}
                                onClick={handleCreateNewTemplate}>
                                <Center h={'5rem'}>
                                    <Text size="xs" fw={500}>+ New Design Template</Text>
                                </Center>
                            </Card>
                            {templates.map((t: any) => (
                                <TemplateCard
                                    key={t.id}
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
                    <Group justify="space-between" gap={"xs"}>
                        {(opened) && <Button size='xs' variant="gradient" className={classes.button} disabled={saveDisabled && !isPredefined} onClick={saveChanges}>{isPredefined ? 'Save As New Template' : 'Save Design Template'}</Button>}
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
