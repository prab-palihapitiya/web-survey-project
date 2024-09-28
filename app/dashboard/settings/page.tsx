'use client';
import { Button, Card, Center, Container, Divider, Grid, GridCol, Group, rem, Tabs, Text } from "@mantine/core";
import { IconPhoto, IconUsersGroup } from "@tabler/icons-react";
import classes from "@/app/ui/dashboard/settings/settings.module.css";
import { useDisclosure } from "@mantine/hooks";
import TemplateCard from "./design/templatecard";
import TemplateForm from "./design/templateform";
import { useMemo, useState } from "react";
import BuiltTemplates from "./design/predefinedtemplates";
import { createTemplate, deleteTemplate, fetchTemplatesByUser, saveTemplate } from "@/app/lib/services/template-service";
import useTemplateStore from "@/app/lib/state/template-store";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { set } from "date-fns";

export default function Page({
    searchParams
}: {
    searchParams?: {
        id?: string;
    };
}) {
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const [isPredefined, setIsPredefined] = useState(false);
    const template = useTemplateStore((state) => state.template);

    const iconStyle = { width: rem(12), height: rem(12) };
    const tabStyle = { fontSize: 'var(--mantine-font-size-xs)', fontWeight: 500, defautProps: { color: 'dark' } };

    useEffectAfterMount(() => {
        doFetchTemplates();
    }, [opened]);

    const doFetchTemplates = async () => {
        try {
            const response = await fetchTemplatesByUser();
            if (response && response.data) {
                console.log('response.data:', response.data);

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
            <Tabs variant="pills" radius={0} defaultValue="design" style={{ fontSize: 'var(--mantine-font-size-xs)' }}>
                <Tabs.List className={classes.top_bar}>
                    <Tabs.Tab value="design" leftSection={<IconPhoto style={iconStyle} />} style={tabStyle}>
                        Design
                    </Tabs.Tab>
                    <Tabs.Tab value="user groups" leftSection={<IconUsersGroup style={iconStyle} />} style={tabStyle}>
                        User Groups
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="design">
                    {opened ? <TemplateForm template={selectedTemplate} onClose={() => {
                        close();
                        setSelectedTemplate(null);
                        setIsPredefined(false);
                    }} /> : (
                        <>
                            <Group>
                                <Card
                                    shadow="xl"
                                    className={classes.new_template}
                                    onClick={() => {
                                        setSelectedTemplate(null);
                                        open();
                                    }}>
                                    <Center h={'5rem'}>
                                        <Text size="xs" fw={500}>+ New Template</Text>
                                    </Center>
                                </Card>
                                {templates.map((t: any) => (
                                    <TemplateCard
                                        key={t.id}
                                        tempId={t.id}
                                        template={t.obj}
                                        onOpen={() => {
                                            setSelectedTemplate({ id: t.id, obj: t.obj });
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
                                        tempId={t.id}
                                        template={t}
                                        onOpen={() => {
                                            setIsPredefined(true);
                                            setSelectedTemplate({ id: index, obj: t });
                                            open();
                                        }}
                                    />
                                ))}
                            </Group>
                        </>
                    )}
                </Tabs.Panel>
                <Tabs.Panel value="user groups">
                    <Container style={{ paddingInline: '0px' }}>
                        <Grid>
                            <GridCol span={6}>
                                <h1>User Groups</h1>
                                <p>User Groups tab content</p>
                            </GridCol>
                        </Grid>
                    </Container>
                </Tabs.Panel>
            </Tabs>
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
                        }}>{isPredefined ? 'Save As New Template' : 'Save Changes'}</Button>}
                        <Button size='xs' color="dark" onClick={
                            () => {
                                if (opened) {
                                    setSelectedTemplate(null);
                                    setIsPredefined(false);

                                    close();
                                }
                            }
                        }>{opened ? 'Close Style' : 'Close Settings'}</Button>
                    </Group>
                </GridCol>
            </Grid>
        </Container >
    );
}
