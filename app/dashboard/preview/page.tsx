'use client';

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Container, Text, Button, Group, Badge, Select, Space, Grid, GridCol, Flex, Loader } from "@mantine/core";
import { useEffect, useState } from 'react';
import classes from "@/app/ui/dashboard/dashboard.module.css";
import { useRouter } from "next/navigation";
import { fetchQuestionnaire, fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import { QuestionTypeMappings } from "@/app/lib/config/question-config";
import { Actions, Answer, Logic, Navigate, Question, SubQuestionAnswer } from "@/app/lib/types";
import LogicService from "@/app/lib/utils/logic";
import RichText from "@/app/ui/utils/richtext";

export default function Page({
    searchParams
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const { name, questions, logic, answers } = useQuestionnaireStore();
    const [isLoading, setIsLoading] = useState(false);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [questionnaires, setQuestionnaires] = useState([]); // To store the list of questionnaires
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState(''); // To store the selected questionnaire ID

    const questionnaireId = useQuestionnaireStore((state) => state.id);
    const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
    const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);
    const setAnswer = useQuestionnaireStore((state) => state.setAnswer);

    const { id } = searchParams;
    const router = useRouter();
    const paramId = id;

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

    const handleQuestionnaireSelect = (value: string | null) => {
        if (!value) {
            return;
        }
        setSelectedQuestionnaireId(value);
        setQuestionnaireId(value);

        setIsLoading(true);
        fetchQuestionnaire(value)
            .then((response) => {
                setQuestionnaireId(response.data.id);
                setQuestionnaire(response.data.obj);
                router.push(`/dashboard/preview?id=${value}`); // Navigate to the selected questionnaire preview
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const doAction = (newIndex: number, direction: Navigate): number => {
        const isNext = direction === Navigate.Next;

        // Loop through questions until a non-hidden question is found
        while (newIndex >= 0 && newIndex < questions.length) {
            const currentLogics: Logic[] = LogicService.getTargetedLogics(questions[newIndex], logic);

            const isHide: boolean = currentLogics && currentLogics.map((l: Logic) => l.action).includes(Actions.Hide);
            const isSetValue: boolean = currentLogics && currentLogics.map((l: Logic) => l.action).includes(Actions.SetValue);

            // If "Hide" is found, continue to the next or previous question based on direction
            if (isHide) {
                const targetLogic = currentLogics.find((l: Logic) => l.action === Actions.Hide);
                const answer: Answer = answers.find((a: Answer) => a.questionId === targetLogic?.ifQuestionId) as Answer;
                const hasConditionMet = LogicService.checkIfConditionMet(answer, targetLogic);
                if (hasConditionMet) {
                    newIndex = isNext ? newIndex + 1 : newIndex - 1;
                } else {
                    if (isSetValue) {
                        setValue(currentLogics, answers);
                    }
                    break;
                }
            } else {
                if (isSetValue) {
                    setValue(currentLogics, answers);
                }
                break; // Found a question that is not hidden
            }

            // Prevent going beyond the question array boundaries
            if (newIndex < 0 || newIndex >= questions.length) {
                break;
            }
        }

        return newIndex;
    };

    const setValue = (currentLogics: Logic[], answers: Answer[]) => {
        const targetLogic: Logic | undefined = currentLogics.find((l: Logic) => l.action === Actions.SetValue);
        const answer: Answer = answers.find((a: Answer) => a.questionId === targetLogic?.ifQuestionId) as Answer;
        const hasConditionMet = LogicService.checkIfConditionMet(answer, targetLogic);
        if (hasConditionMet) {
            setAnswer(targetLogic?.targetQuestionId as string, targetLogic?.setValue as string, []);
        }
    };

    const handleNext = () => {
        setActiveQuestionIndex((prevIndex) => {
            const nextIndex = Math.min(prevIndex + 1, questions.length - 1);
            return doAction(nextIndex, Navigate.Next); // Call doAction to skip question
        });
    };

    const handlePrevious = () => {
        setActiveQuestionIndex((prevIndex) => {
            const prevIndexVal = Math.max(prevIndex - 1, 0);
            if (prevIndexVal === 0) {
                return prevIndexVal; // Stop if it's the first question
            }
            return doAction(prevIndexVal, Navigate.Previous); // Call doAction to skip question
        });
    };


    const currentQuestion = questions[activeQuestionIndex];
    const { Control: ControlComponent } = currentQuestion && QuestionTypeMappings[currentQuestion.questionType] || {};

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
                                onChange={handleQuestionnaireSelect}
                            />
                            <Space h="xs" />
                        </Group>
                    </Flex>
                </GridCol>
            </Grid>
            <Space h="md" />
            <Space h="xs" />

            {isLoading ? (
                <div className={classes.loading_wrapper}>
                    <Loader size={30} />
                </div>
            ) : (
                <Grid>
                    {questionnaireId && paramId && questionnaireId === paramId && questions.length > 0 && (
                        <GridCol>
                            <Badge
                                size="lg"
                                radius={0}
                                style={{
                                    textTransform: 'none',
                                    fontSize: 'var(--mantine-font-size-xs)',
                                    padding: '0.8rem'
                                }}
                            >
                                {name}
                            </Badge>
                            {currentQuestion && (
                                <>
                                    <Badge
                                        size="lg"
                                        radius={0}
                                        style={{
                                            marginLeft: 5,
                                            textTransform: 'none',
                                            backgroundColor: 'var(--mantine-color-green-6)',
                                            fontSize: 'var(--mantine-font-size-xs)',
                                            padding: '0.8rem'
                                        }}
                                    >
                                        {currentQuestion.shortcut}
                                    </Badge>
                                    <div>
                                        <Space h="lg" />
                                        <Text size="sm"><RichText content={currentQuestion.introduction}></RichText></Text>
                                        <Space h="md" />
                                        {ControlComponent && <ControlComponent currentQuestion={currentQuestion} />}
                                        <Space h="md" />
                                    </div>
                                </>
                            )}

                            <Group mt="md">
                                <Button onClick={handlePrevious} disabled={activeQuestionIndex === 0}>
                                    Previous
                                </Button>
                                <Button onClick={handleNext} disabled={activeQuestionIndex === questions.length - 1}>
                                    Next
                                </Button>
                            </Group>
                        </GridCol>
                    )}
                    {questionnaireId && questions.length === 0 && (
                        <GridCol>
                            <Text>Empty Questionnaire</Text>
                        </GridCol>
                    )}
                </Grid>
            )}
            <Grid className={classes.bottom_bar}>
                <GridCol>
                    <Group gap={"xs"}>
                        {/* <Button size='xs'>Save Changes</Button> */}
                        <Button size='xs'>Cancel</Button>
                    </Group>
                </GridCol>
            </Grid>
        </Container >
    );
}