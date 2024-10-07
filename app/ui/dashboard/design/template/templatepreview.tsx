import { QuestionTypeMappings } from "@/app/lib/config/question-config";
import { ProgressProps, TemplateObject } from "@/app/lib/config/template-config";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { Avatar, Box, Button, Center, Container, Flex, Grid, GridCol, Group, MantineProvider, Space, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import DefaultQuestionnaire from "@/app/lib/defaultquestionnaire";
import { getErrorStyle, getProgressProps, getStyle } from "@/app/surveys/utils/theme";
import classes from "@/app/ui/dashboard/design/viewer.module.css";
import { IconArrowLeft, IconArrowRight, IconRefresh } from "@tabler/icons-react";
import { Answer, ErrorKey, Question } from "@/app/lib/types";
import RichText from "@/app/ui/common/richtext";
import ErrorMessage from "@/app/ui/common/errormessage";
import ErrorService from "@/app/lib/utils/error";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import Link from "next/link";
import ProgressBar from "@/app/ui/common/progressbar";

const TemplatePreview = ({ template }: { template: TemplateObject }) => {
    const style = template;
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [progressValue, setProgressValue] = useState(0);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);

    const { answers } = useQuestionnaireStore();
    const { questions } = DefaultQuestionnaire;

    useEffect(() => {
        setQuestionnaire(DefaultQuestionnaire);
    }, [setQuestionnaire]);

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

    const progressProps: ProgressProps = getProgressProps(style);
    const errorProps = getErrorStyle(style);

    const handleNext = () => {
        const err = ErrorService.validateAnswer(currentQuestion as Question, answers as Answer[]);
        if (err && err.length > 0) {
            setErrorMessages(err);
            return;
        }

        setErrorMessages([]);
        setActiveQuestionIndex(activeQuestionIndex + 1);
    };

    const handlePrevious = () => {
        setActiveQuestionIndex(activeQuestionIndex - 1);
        setErrorMessages([]);
    };

    return (
        <div className={classes.desktop_container}>
            <div className={classes.desktop_header}>
                <div className={classes.webcam}>
                    <div className={classes.webcam_lens}></div>
                </div>
                <div className={classes.webcam_light}></div>
            </div>
            <div className={classes.desktop_screen}>
                <MantineProvider theme={getStyle()}>
                    <Container className={classes.scr_container}>
                        <div className={classes.scr_banner}
                            style={{
                                background: style.bannerShowGradient ?
                                    `linear-gradient(${style.bannerGradientDirection}, ${style.bannerPrimaryColor}, ${style.bannerSecondaryColor})` : style.bannerPrimaryColor
                            }}>
                            <Flex justify="space-between">
                                <Group justify="flext-start">
                                    <Center>
                                        {(style.logoSrc || style.logoFilePath) ?
                                            <Link href={style.logoUrl || ''}>
                                                <Avatar
                                                    src={style.logoSrc || style.logoFilePath}
                                                    size={style.logoSize}
                                                    radius={style.logoRadius}
                                                />
                                            </Link> : <div className={classes.empty_logo}>
                                                <Text size={'12px'} c={'dark'}>LOGO</Text>
                                            </div>}
                                    </Center>
                                </Group>
                                <Group justify="flex-end">
                                    {progressProps.type && <ProgressBar props={progressProps} value={progressValue} />}
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
                                        <Text><RichText content={currentQuestion.introduction} /></Text>
                                        <Space h="md" />
                                        {ControlComponent && <ControlComponent currentQuestion={currentQuestion as Question} style={null} />}
                                        <Space h="md" />
                                    </div>
                                )}

                                <div className={style.navBottomFixed ? classes.scr_footer : ''}>
                                    <Group justify={style.navFlexDirection}>
                                        {style.prevButtonShow && ((activeQuestionIndex !== 0) && <Button
                                            variant={style.prevButtonVariant}
                                            color={style.prevButtonColor}
                                            size={style.prevButtonSize}
                                            radius={style.prevButtonRadius}
                                            onClick={handlePrevious}
                                        >
                                            {style.navArrows ? <IconArrowLeft size={16} /> : (style.prevButtonText || 'Previous')}
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
                    </Container>
                </MantineProvider>
            </div>
        </div>
    );
}

export default TemplatePreview;