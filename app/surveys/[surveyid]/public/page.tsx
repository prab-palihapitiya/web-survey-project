'use client';

import { Text, Button, Container, Grid, GridCol, Group, Loader, MantineProvider, Progress, Space, Flex, Avatar, Center, SemiCircleProgress, RingProgress } from "@mantine/core";
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
import { IconArrowBack, IconArrowLeft, IconArrowRight, IconRefresh } from "@tabler/icons-react";
import ErrorService from "@/app/lib/utils/error";
import LogicService from "@/app/lib/utils/logic";
import Link from "next/link";

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

    const primaryColor = 'var(--mantine-color-blue-5)';
    const secondaryColor = 'var(--mantine-color-green-5)';

    const bColor1 = 'var(--mantine-color-blue-6)';
    const bColor2 = 'var(--mantine-color-green-5)';
    const bGradientDirection = 'to right';
    const bLogoSrc = '/assets/sr-logo.png';
    const bLogoUrl = '#';
    const bLogoSize = 'lg';
    const bLogoRadius = 'sm';

    const progressStyle = 'bar'; // bar, ring, semi-circle
    const progressColor = 'var(--mantine-color-blue-6)';
    const progressLabelColor = 'dark';
    const progressRadius = 'xl';
    const progressSize = 'xl';

    const progressBarLength = '12rem';
    const progressBarAnimated = true;

    const progressCircleSize = 75;
    const progressCircleThickness = 5;
    const progressEmptySegmentColor = 'white';

    const navButtonPosition = 'flex-end'; // space-between, space-around, flex-start, flex-end, center
    const navButtonArrows = false;
    const navButtonBarFixed = false;

    const nButtonText = 'Next';
    const nButtonVariant = 'gradient';
    const nButtonColor = 'var(--mantine-color-blue-6)';
    const nButtonSize = 'sm';
    const nButtonRadius = 'sm';

    const pButtonShow = true;
    const pButtonText = 'Previous';
    const pButtonVariant = 'filled';
    const pButtonColor = 'var(--mantine-color-dark-6)';
    const pButtonSize = 'sm';
    const pButtonRadius = 'sm';

    const getProgress = (type: string) => {
        switch (type) {
            case 'bar':
                return <Progress value={progressValue} w={progressBarLength}
                    radius={progressRadius} size={progressSize}
                    animated={progressValue < 100 ? progressBarAnimated : false}
                    mt={0} mr={8} />;
            case 'ring':
                return <RingProgress
                    sections={[{ value: progressValue, color: progressColor }]}
                    label={
                        <Text c={progressLabelColor} fw={500} ta="center" size="sm">
                            {progressValue}%
                        </Text>
                    }
                    thickness={progressCircleThickness}
                    size={progressCircleSize} mt={0} mr={8} />;
            case 'semi-circle':
                return <SemiCircleProgress
                    value={progressValue}
                    label={
                        <Text c={progressLabelColor} fw={500} ta="center" size="sm">
                            {progressValue}%
                        </Text>
                    }
                    labelPosition="center"
                    size={progressCircleSize}
                    thickness={progressCircleThickness}
                    emptySegmentColor={progressEmptySegmentColor}
                />;
            default:
                return <Progress value={progressValue} w={progressBarLength}
                    radius={progressRadius} size={progressSize}
                    mt={0} mr={8} />;
        }
    };

    return (
        <MantineProvider theme={getStyle('blue')}>
            <Container className={classes.container}>
                {isLoading ? (
                    <div className={classes.loading_wrapper}>
                        <Loader size="xl" />
                    </div>
                ) : (
                    <>
                        <div className={classes.banner} style={{
                            background: `linear-gradient(${bGradientDirection}, ${bColor1}, ${bColor2})`
                        }}>
                            <Flex justify="space-between">
                                <Group justify="flext-start">
                                    <Center><Link href={bLogoUrl}><Avatar src={bLogoSrc} alt="surveyranch logo" size={bLogoSize} radius={bLogoRadius} /></Link></Center>
                                </Group>
                                <Group justify="flex-end">
                                    {getProgress(progressStyle)}
                                </Group>
                            </Flex>
                        </div>

                        <Grid>
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
                                        <Space h="md" />
                                        <Text><RichText content={currentQuestion.introduction}></RichText></Text>
                                        <Space h="md" />
                                        {ControlComponent && <ControlComponent currentQuestion={currentQuestion as Question} style={null} />}
                                        <Space h="md" />
                                    </div>
                                )}

                                <div className={navButtonBarFixed ? classes.bottom_bar : ''}>
                                    <Group justify={navButtonPosition}>
                                        {pButtonShow && ((activeQuestionIndex !== 0) && <Button
                                            variant={pButtonVariant}
                                            color={pButtonColor}
                                            size={pButtonSize}
                                            radius={pButtonRadius}
                                            onClick={handlePrevious}
                                        >
                                            {navButtonArrows ? <IconArrowLeft size={16} /> : pButtonText}
                                        </Button>)}
                                        {activeQuestionIndex === questions.length ? (
                                            <Button onClick={() => { }}>
                                                <IconRefresh size={20} />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={nButtonVariant}
                                                color={nButtonColor}
                                                size={nButtonSize}
                                                radius={nButtonRadius}
                                                onClick={handleNext}
                                            >
                                                {navButtonArrows ? <IconArrowRight size={16} /> : nButtonText}
                                            </Button>
                                        )}
                                    </Group>
                                </div>
                            </GridCol>
                        </Grid>
                    </>
                )}

            </Container>
        </MantineProvider>
    );
};

export default Page;