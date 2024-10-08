'use client';

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Container, Text, Button, Group, Badge, Select, Space, Grid, GridCol, Flex, Loader, Progress, MantineProvider } from "@mantine/core";
import { useEffect, useState } from 'react';
import classes from "@/app/ui/dashboard/dashboard.module.css";
import { useRouter } from "next/navigation";
import { fetchQuestionnaire, fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import { QuestionTypeMappings } from "@/app/lib/config/question-config";
import { Actions, Answer, ErrorKey, Logic, Navigate, Question } from "@/app/lib/types";
import LogicService from "@/app/lib/utils/logic";
import RichText from "@/app/ui/common/richtext";
import ErrorMessage from "@/app/ui/common/errormessage";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { IconRefresh } from "@tabler/icons-react";
import ErrorService from "@/app/lib/utils/error";
import TestButton from "../common/testpreview";
import { getStyle } from "@/app/surveys/utils/theme";
import useDashboardStore from "@/app/lib/state/dashboard-store";

export default function Page({
    searchParams
}: {
    searchParams?: {
        id?: string;
    };
}) {
    const setNavLinkIndex = useDashboardStore((state) => state.setNavLinkIndex);
    setNavLinkIndex(4);

    const { questions, logic, answers } = useQuestionnaireStore();
    const [isLoading, setIsLoading] = useState(false);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [questionnaires, setQuestionnaires] = useState([]); // To store the list of questionnaires
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState(''); // To store the selected questionnaire ID
    const [errorMessages, setErrorMessages] = useState<string[]>([]); // To store the error message
    const [progressValue, setProgressValue] = useState(0); // To store the progress percentage

    const questionnaireId = useQuestionnaireStore((state) => state.id);
    const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
    const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);
    const setAnswer = useQuestionnaireStore((state) => state.setAnswer);
    const resetAnswers = useQuestionnaireStore((state) => state.resetAnswers);

    const router = useRouter();
    const paramId = searchParams?.id;

    const currentQuestion = questions[activeQuestionIndex];
    const { Control: ControlComponent } = currentQuestion && QuestionTypeMappings[currentQuestion.questionType] || {};

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
        setErrorMessages([]); // Clear error message
    }, [answers]);

    useEffect(() => {
        if (questions.length > 0) {
            const progress = ((activeQuestionIndex) / questions.length) * 100;
            setProgressValue(progress);
        }
    }, [activeQuestionIndex, questions.length]);

    // TODO: Implement keyboard navigation
    // useEffect(() => {
    //     const handleKeyPress = (event: KeyboardEvent) => {
    //         if (event.key === 'Enter') {
    //             handleNext();
    //         }
    //     };

    //     window.addEventListener('keydown', handleKeyPress);

    //     return () => {
    //         window.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, []);

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
        const err = ErrorService.validateAnswer(currentQuestion as Question, answers as Answer[]);
        if (err && err.length > 0) {
            setErrorMessages(err);
            return;
        }
        setActiveQuestionIndex((prevIndex) => {
            const nextIndex = Math.min(prevIndex + 1, questions.length);
            return doAction(nextIndex, Navigate.Next); // Call doAction to skip question
        });
    };

    const handlePrevious = () => {
        setErrorMessages([]); // Clear error message
        setActiveQuestionIndex((prevIndex) => {
            const prevIndexVal = Math.max(prevIndex - 1, 0);
            if (prevIndexVal === 0) {
                return prevIndexVal; // Stop if it's the first question
            }
            return doAction(prevIndexVal, Navigate.Previous); // Call doAction to skip question
        });
    };

    const handleReset = () => {
        resetAnswers();
        setActiveQuestionIndex(0);
    };

    const style = {
        templateName: "Default Template",
        description: "Default Template",
        primaryColor: 'blue',
        secondaryColor: 'green',
        errorColor: 'red',
        backgroundColor: 'white',
        backgroundTransparent: 'transparent',
        fontFamily: 'Arial, sans-serif',
        BackgroundImage: {
            src: 'url(https://images.unsplash.com/photo-1542282081-9e0a16bb7366)',
            position: 'center', // top, bottom, center
            size: 'cover', // contain, cover
            repeat: 'no-repeat', // repeat, no-repeat
        },
        progress: {
            type: 'bar', //ring, bar, semi-circle, capsule
            color: 'blue',
            position: 'top', // top-right, top-left
            animated: true,
            radius: 'sm',
            size: 'sm',
        },
        logo: {
            position: 'top-left', // top-middle, top-right, top-left
            size: 'sm',
            src: '',
        },
        buttons: {
            default: {
                size: 'sm',
                variant: 'outline',
                color: 'blue',
                radius: 'sm',
            },
            next: {
                text: 'Next',
                size: 'sm',
                variant: 'outline',
                color: 'blue',
                radius: 'sm',
            },
            previous: {
                text: 'Previous',
                size: 'sm',
                variant: 'outline',
                color: 'gray',
                radius: 'sm',
            }
        },
        radio: {
            size: 'sm'
        },
        checkbox: {
            size: 'sm',
            radius: 'sm',
        },
        input: {
            size: 'sm',
            variant: 'default',
            radius: 'sm',
        },
        error: {
            size: 'sm',
            variant: 'filled',
            color: 'red',
            radius: 'sm',
        }
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
                                onChange={handleQuestionnaireSelect}
                            />
                            <Space h="xs" />
                        </Group>
                        <Group justify="flex-end">
                            {questionnaireId && <TestButton id={questionnaireId} />}
                        </Group>
                    </Flex>
                </GridCol>
            </Grid>
            <Space h="md" />
            <Space h="xs" />

            {isLoading ? (
                <div className={classes.loading_wrapper}>
                    <Loader />
                </div>
            ) : (
                <MantineProvider theme={getStyle()}>
                    <Grid>
                        {questionnaireId && paramId && questionnaireId === paramId && questions.length > 0 && (
                            <>
                                <GridCol>
                                    <Progress value={progressValue} animated={progressValue === 100 ? false : true} />
                                    <Space h="lg" />
                                </GridCol>
                                <GridCol>
                                    {errorMessages.length > 0 && (
                                        errorMessages.map((error, index) => (
                                            <ErrorMessage key={index} message={error as ErrorKey} />
                                        ))
                                    )}
                                </GridCol>
                                <GridCol>
                                    {currentQuestion && (
                                        <div>
                                            <Badge
                                                size="lg"
                                                radius={0}
                                                style={{
                                                    textTransform: 'none',
                                                    backgroundColor: 'var(--mantine-color-green-6)',
                                                    fontSize: 'var(--mantine-font-size-xs)',
                                                    padding: '0.8rem'
                                                }}
                                            >
                                                {currentQuestion.shortcut}
                                            </Badge>

                                            <Space h="md" />
                                            <Text><RichText content={currentQuestion.introduction}></RichText></Text>
                                            <Space h="md" />
                                            {ControlComponent && <ControlComponent currentQuestion={currentQuestion as Question} />}
                                            <Space h="md" />
                                        </div>
                                    )}

                                    <Group mt="md">
                                        <Button onClick={handlePrevious} disabled={activeQuestionIndex === 0}>
                                            Previous
                                        </Button>
                                        {activeQuestionIndex === questions.length ? (
                                            <Button variant='light' onClick={handleReset}>
                                                <IconRefresh size={20} />
                                            </Button>
                                        ) : (
                                            <Button onClick={handleNext}>
                                                Next
                                            </Button>
                                        )}
                                    </Group>
                                </GridCol>
                            </>
                        )}
                        {questionnaireId && questions.length === 0 && (
                            <GridCol>
                                <Text>Empty Questionnaire</Text>
                            </GridCol>
                        )}
                    </Grid>
                </MantineProvider>

            )}
            <Grid className={classes.bottom_bar}>
                <GridCol>
                    <Group gap={"xs"}>
                        {/* <Button size='xs'>Save Changes</Button> */}
                        <Button size='xs' variant="gradient" >Cancel</Button>
                    </Group>
                </GridCol>
            </Grid>
        </Container >
    );
}