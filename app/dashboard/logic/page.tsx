'use client';

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Container, Text, Button, Group, Badge, Select, Space, Grid, GridCol, Flex, ActionIcon, Loader } from "@mantine/core";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { fetchQuestionnaire, fetchQuestionnairesByUser, saveQuestionnaireData } from "@/app/lib/services/questionnaire-service";
import Logic from "@/app/ui/dashboard/logic/logic";
import { IconPlus } from "@tabler/icons-react";
import classes from "@/app/ui/dashboard/logic/logic.module.css";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import DateTime from "@/app/ui/common/datetime";
import useDashboardStore from "@/app/lib/state/dashboard-store";
import { Status } from "@/app/lib/types";

export default function Page() {
    const setNavLinkIndex = useDashboardStore((state) => state.setNavLinkIndex);
    setNavLinkIndex(2);

    const { name, questions, logic } = useQuestionnaireStore();
    const [isLoading, setIsLoading] = useState(false);
    const [questionnaires, setQuestionnaires] = useState([]); // To store the list of questionnaires
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<string | null>(''); // To store the selected questionnaire ID
    const [firstLoaded, setFirstLoaded] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastModified, setLastModified] = useState(new Date());
    const [nextLogicIndex, setNextLogicIndex] = useState(0);
    const [published, setPublished] = useState(false);
    const [newlyCreated, setNewlyCreated] = useState(false);

    const questionnaireId = useQuestionnaireStore((state) => state.id);
    const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
    const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);
    const addLogic = useQuestionnaireStore((state) => state.addLogic);

    const router = useRouter();
    const params = useSearchParams();
    const paramId = params.get('id');

    useEffect(() => {
        const highestIndex = logic.reduce(
            (maxIndex, l) => Math.max(maxIndex, l.index as unknown as number), 0
        );
        setNextLogicIndex(highestIndex + 1);
    }, [logic]);

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
        if (paramId) {
            setIsLoading(true);
            fetchQuestionnaire(paramId)
                .then((response) => {
                    setLastModified(response.data.modifiedAt);
                    setQuestionnaireId(response.data.id);
                    setQuestionnaire(response.data.obj);
                    setSelectedQuestionnaireId(response.data.id);
                    setPublished(response.data.status === Status.PUBLISHED);
                    setNewlyCreated(response.data.status === Status.NEW);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [paramId]);

    const handleQuestionnaireSelect = (value: string | null) => {
        if (!value) {
            return;
        }
        setSelectedQuestionnaireId(value);
        router.push(`/dashboard/logic?id=${value}`);
    };

    function handleCreateLogic(): void {
        addLogic({
            index: nextLogicIndex,
            ifQuestionId: '',
            condition: '',
            answer: '',
            action: '',
            targetQuestionId: '',
            setValue: ''
        });
    }

    function cancelChanges(): void {
        throw new Error("Function not implemented.");
    }

    const saveChanges = async () => {
        setFirstLoaded(false);
        setIsSaving(true);
        setQuestionnaire({ name: name, questions: questions, logic: logic });
        try {
            await saveQuestionnaireData(questionnaireId, questions, logic, [], { name: name });
            setLastModified(new Date());
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    function getSavedStatus() {
        if (firstLoaded) {
            return <DateTime datetime={lastModified} prefix="Saved" />;
        }
        if (isSaving) {
            return 'Saving...';
        }
        return <DateTime datetime={lastModified} prefix="Saved" />;
    }

    const handleLogicClose = (index: number) => {
        console.log(`Logic with index: ${index} is closed!`);
    }

    return (
        <Container className={classes.container}>
            <Grid className={classes.top_bar}>
                <GridCol>
                    <Flex justify={"space-between"}>
                        <Group justify="flex-start">
                            <Select
                                variant="filled"
                                placeholder="Select a Questionnaire"
                                data={questionnaires.map((q: { id: string, name: string }) => ({ value: q.id, label: q.name }))}
                                value={selectedQuestionnaireId || questionnaireId === paramId ? questionnaireId : ''}
                                onChange={(value) => handleQuestionnaireSelect(value)}
                            />
                        </Group>
                        <Group justify="flex-end">
                            {paramId &&
                                <Badge
                                    size="lg"
                                    color={published ? 'green' : (newlyCreated ? 'gray' : 'red')}
                                    style={{ border: 'none', paddingInlineEnd: '0.3rem' }}
                                    styles={{
                                        label: {
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            fontWeight: 600
                                        }
                                    }}
                                >
                                    {getSavedStatus()}
                                </Badge>
                            }
                        </Group>
                    </Flex>
                </GridCol>
            </Grid>
            <Space h="md" />
            {isLoading ? (
                <div className={classes.loading_wrapper}>
                    <Loader size={30} />
                </div>
            ) : (
                <Grid>
                    <GridCol>
                        {questions.length > 0 && (
                            <>
                                {/* <Group>
                                    <Text size="xs" pl={0}>Filter by</Text>
                                    <Select
                                        placeholder="Start Question"
                                        data={["Q1", "Q2"]}
                                    />
                                    <Select
                                        placeholder="Condition"
                                        data={["Has", "Equals"]}
                                    />
                                    <Select
                                        placeholder="Action"
                                        data={["Set Value", "Show", "Hide"]}
                                    />
                                    <Select
                                        placeholder="Target Question"
                                        data={["Q1", "Q2"]}
                                    />
                                </Group> */}

                                <Space h="xs" />
                                {logic.map((l, index) => (
                                    <div key={index}>
                                        <Logic
                                            logicData={l}
                                            onClose={() => handleLogicClose(l.index)}
                                        />
                                        <Space h="lg" />
                                    </div>
                                ))}

                                <Flex justify="center">
                                    <ActionIcon
                                        title="Add Logic"
                                        color="green"
                                        variant="light"
                                        className={classes.plus_icon}
                                        onClick={handleCreateLogic}
                                    >
                                        <IconPlus size={16} />
                                    </ActionIcon>
                                </Flex>
                            </>
                        )}
                    </GridCol>
                </Grid>
            )}
            <Grid className={classes.bottom_bar}>
                <GridCol>
                    <Group gap={"xs"}>
                        <Button size='xs' variant="gradient" onClick={saveChanges}>Save Changes</Button>
                        <Button size='xs' variant="gradient" onClick={cancelChanges}>Cancel</Button>
                    </Group>
                </GridCol>
            </Grid>
        </Container>
    );
}