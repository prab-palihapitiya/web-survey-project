'use client';

import { Text, Button, Container, Grid, GridCol, Group, Loader, MantineProvider, Progress, Space, Flex, Avatar, Center, SemiCircleProgress, RingProgress, DefaultMantineColor } from "@mantine/core";
import { Inter } from "next/font/google";
import { getErrorStyle, getProgressProps, getStyle } from "@/app/surveys/utils/theme";
import { useEffect, useState } from "react";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { fetchQuestionnaire } from "@/app/lib/services/questionnaire-service";
import { QuestionTypeMappings } from "@/app/lib/config/question-config";
import classes from "@/app/surveys/survey.module.css";
import ErrorMessage from "@/app/ui/common/errormessage";
import RichText from "@/app/ui/common/richtext";
import { Actions, Answer, ErrorKey, Logic, Navigate, Question } from "@/app/lib/types";
import { IconArrowLeft, IconArrowRight, IconRefresh } from "@tabler/icons-react";
import ErrorService from "@/app/lib/utils/error";
import LogicService from "@/app/lib/utils/logic";
import Link from "next/link";
import { ProgressProps, TemplateObject } from "@/app/lib/config/template-config";
import { ProgressType } from "../../utils/types";
import BuiltTemplates from "@/app/dashboard/settings/design/predefinedtemplates";
import ProgressBar from "@/app/ui/common/progressbar";
import { get } from "http";

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
    }, [activeQuestionIndex, questions.length]);

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

    const style: TemplateObject = BuiltTemplates[0].obj;

    const progressProps: ProgressProps = getProgressProps(style);

    const errorProps = getErrorStyle(style);

    return (
        <MantineProvider theme={getStyle()}>
            <Container className={classes.container}>
                {isLoading ? (
                    <div className={classes.loading_wrapper}>
                        <Loader size="xl" />
                    </div>
                ) : (
                    <div>
                        <div className={classes.banner}
                            style={{
                                background: style.bannerShowGradient ?
                                    `linear-gradient(${style.bannerGradientDirection}, ${style.bannerPrimaryColor}, ${style.bannerSecondaryColor})` : style.bannerPrimaryColor
                            }}>
                            <Flex justify="space-between">
                                <Group justify="flext-start">
                                    <Center>
                                        <Link href={style.logoUrl}>
                                            <Avatar
                                                src={style.logoSrc}
                                                size={style.logoSize}
                                                radius={style.logoRadius} />
                                        </Link>
                                    </Center>
                                </Group>
                                <Group justify="flex-end">
                                    <ProgressBar props={progressProps} value={progressValue} />
                                </Group>
                            </Flex>
                        </div>

                        <Grid>
                            <GridCol>
                                {errorMessages.length > 0 && (
                                    errorMessages.map((error, index) => (
                                        <ErrorMessage
                                            key={index}
                                            message={error as ErrorKey}
                                            style={errorProps} />
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

                                <div className={style.navBottomFixed ? classes.bottom_bar : ''}>
                                    <Group justify={style.navFlexDirection}>
                                        {style.prevButtonShow && ((activeQuestionIndex !== 0) && <Button
                                            variant={style.prevButtonVariant}
                                            color={style.prevButtonColor}
                                            size={style.prevButtonSize}
                                            radius={style.prevButtonRadius}
                                            onClick={handlePrevious}
                                        >
                                            {style.navArrows ? <IconArrowLeft size={16} /> : style.prevButtonText}
                                        </Button>)}
                                        {activeQuestionIndex === questions.length ? (
                                            <Button onClick={() => { }}>
                                                <IconRefresh size={20} />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={style.nextButtonVariant}
                                                color={style.nextButtonColor}
                                                size={style.nextButtonSize}
                                                radius={style.nextButtonRadius}
                                                onClick={handleNext}
                                            >
                                                {style.navArrows ? <IconArrowRight size={16} /> : style.nextButtonText}
                                            </Button>
                                        )}
                                    </Group>
                                </div>
                            </GridCol>
                        </Grid>
                    </div>
                )}
            </Container>
        </MantineProvider>
    );
};

export default Page;