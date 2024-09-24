'use client';

import { Text, Button, Container, Grid, GridCol, Group, Loader, MantineProvider, Progress, Space } from "@mantine/core";
import { Inter } from "next/font/google";
import { getStyle } from "@/app/surveys/utils/theme";
import { useEffect, useState } from "react";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { fetchQuestionnaire } from "@/app/lib/services/questionnaire-service";
import { QuestionTypeMappings } from "@/app/lib/config/question-config";
import classes from "@/app/surveys/survey.module.css";
import ErrorMessage from "@/app/ui/utils/errormessage";
import RichText from "@/app/ui/utils/richtext";
import { Actions, Answer, ErrorKey, Logic, Navigate, Question } from "@/app/lib/types";
import { IconRefresh } from "@tabler/icons-react";
import ErrorService from "@/app/lib/utils/error";
import LogicService from "@/app/lib/utils/logic";

const inter = Inter({ subsets: ["latin"] });

const Page = ({ params }: { params: { surveyid: string } }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [progressValue, setProgressValue] = useState(0); // To store the progress percentage
    const [errorMessages, setErrorMessages] = useState<string[]>([]); // To store the error message

    const { questions, logic, answers } = useQuestionnaireStore();
    const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
    const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);

    useEffectAfterMount(() => {
        setErrorMessages([]); // Clear error message
        setIsLoading(true);
        fetchQuestionnaire(params.surveyid)
            .then((response) => {
                setQuestionnaireId(response.data.id);
                setQuestionnaire(response.data.obj);
            })
            .finally(() => {
                setIsLoading(false);
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
    }, [activeQuestionIndex]);

    const currentQuestion = questions[activeQuestionIndex];
    const { Control: ControlComponent } = currentQuestion && QuestionTypeMappings[currentQuestion.questionType] || {};

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
            // setAnswer(targetLogic?.targetQuestionId as string, targetLogic?.setValue as string, []);
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

    return (
        <MantineProvider theme={getStyle('red')}>
            <Container className={classes.container}>
                {isLoading ? (
                    <div className={classes.loading_wrapper}>
                        <Loader />
                    </div>
                ) : (
                    <Grid>
                        <GridCol>
                            <Progress value={progressValue} />
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
                                <>

                                    <Space h="md" />
                                    <Text><RichText content={currentQuestion.introduction}></RichText></Text>
                                    <Space h="md" />
                                    {ControlComponent && <ControlComponent currentQuestion={currentQuestion as Question} />}
                                    <Space h="md" />
                                </>
                            )}

                            <Group mt="md">
                                <Button onClick={handlePrevious} disabled={activeQuestionIndex === 0}>
                                    Previous
                                </Button>
                                {activeQuestionIndex === questions.length ? (
                                    <Button onClick={() => { }}>
                                        <IconRefresh size={20} />
                                    </Button>
                                ) : (
                                    <Button onClick={handleNext}>
                                        Next
                                    </Button>
                                )}
                            </Group>
                        </GridCol>
                    </Grid>
                )}

            </Container>
        </MantineProvider>
    );
};

export default Page;