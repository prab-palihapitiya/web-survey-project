import { PromptTopics } from "@/app/lib/config/prompt-config";
import { generateQuestionnaire } from "@/app/lib/services/questionnaire-service";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import QuestionnaireService from "@/app/lib/utils/questionnaire";
import { Autocomplete, Button, Center, Collapse, Divider, Flex, Grid, GridCol, Group, Modal, rem, Space, Stack, Switch, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight, IconCircleCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import classes from "@/app/ui/dashboard/dashboard.module.css";

export const AIGenerateModal = ({ show, onClose }: { show: boolean, onClose: () => void }) => {
    const [opened, { toggle }] = useDisclosure(false);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [showReview, setShowReview] = useState(false);

    const topicInputRef = useRef<HTMLInputElement>(null);
    const promptInputRef = useRef<HTMLTextAreaElement>(null);

    const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);
    const router = useRouter();

    const GenerateSuccessDiv = () => {
        return (
            <GridCol>
                <Space h={'md'} />
                <Stack gap="xs">
                    <Center>
                        <IconCircleCheck size={rem(72)} color="green" />
                    </Center>
                    <Text align="center" size="xs" fw={500}>AI Generated Successfully</Text>
                    <Group justify="center">
                        <Button variant="gradient" onClick={() => {
                            router.push(`/dashboard/questionnaire`);
                            // setShowGenModal(false);
                            // setShowReview(false);
                        }}>Review Questionnaire</Button>
                    </Group>
                </Stack>
                <Space h={'md'} />
                <Divider variant="dashed" labelPosition="center" />
            </GridCol>
        )
    }

    const ViewGeneratedQButton = () => {
        return (
            <Button variant="light" onClick={() => {
                router.push(`/dashboard/questionnaire`);
                // setShowGenModal(false);
                setShowReview(false);
            }}>Review Generated Questionnaire</Button>
        )
    }

    const TopicGenerateDiv = () => {
        return (<GridCol>
            <Space h={'sm'} />
            <Text size="xs" fw={400}>Let the AI know which type of questionnaire you would like to create.</Text>
            <Space h={'xs'} />
            <Flex gap={'sm'}>
                <Autocomplete
                    size="xs"
                    data={PromptTopics}
                    placeholder="Type or select a topic"
                    ref={topicInputRef}
                    classNames={{
                        dropdown: classes.select_dropdown,
                        groupLabel: classes.select_group_label,
                    }}
                    w={'50%'}
                />
                <Switch size="xs" label="Let me decide the steps" onChange={() => {

                }} mt={6} />
            </Flex>
        </GridCol>
        )
    };

    const PromptGenerateDiv = () => {
        return (
            <GridCol>
                <Space h={'sm'} />
                <Textarea
                    label="Advanced Prompt"
                    description={
                        <Text size="xs">
                            {"Provide specific instructions for AI. For example:"}
                            <Text c={'blue'}>{`Write 10 survey questions about usage of web survey tools, 
                including multiple-choice, single-choice, open-ended, numerical, ranking and grid question types.`}</Text>
                        </Text>
                    }
                    placeholder="Enter your detailed instructions here"
                    rows={5}
                    ref={promptInputRef}
                    data-autofocus
                />
            </GridCol>
        )
    };

    const handleGenerate = (prompt: string, type: string, steps?: string[]) => {
        setGenerating(true);
        generateQuestionnaire(prompt, type, steps?.toString()).then((response) => {
            const generatedData = JSON.parse(response?.data);
            const questionnaire = QuestionnaireService.ConvertToQuestionnaire(generatedData);
            setQuestionnaire(questionnaire);
        }).catch((error: Error) => {
            console.error("Error generating questionnaire:", error);
        }).finally(() => {
            setGenerating(false);
            setGenerated(true);
            setShowReview(true);
        });
    }

    return (
        <Modal opened={show}
            onClose={onClose}
            title="Generate with AI"
            centered
            closeOnClickOutside={false}
            size={'xl'}
            transitionProps={{ transition: 'fade', duration: 200 }}
            classNames={{
                header: classes.modal_header
            }}
        >
            <Grid styles={{
                inner: {
                    display: 'block',
                }
            }}>
                {!opened && (
                    <>
                        {showReview && <GenerateSuccessDiv />}
                        {!showReview && <TopicGenerateDiv />}
                        <GridCol>
                            <Group justify="space-between">
                                <Group gap={'sm'}>
                                    {!showReview &&
                                        <Button
                                            loading={generating}
                                            loaderProps={{ type: 'dots' }}
                                            onClick={() => handleGenerate(topicInputRef.current?.value || '', 'topic')}
                                            variant={'gradient'}>Generate</Button>
                                    }
                                    {showReview &&
                                        <Button
                                            color="dark"
                                            onClick={() => { setShowReview(false) }}
                                            pl={6}>
                                            <IconChevronLeft size={16} style={{ paddingTop: '1px' }} />Back</Button>
                                    }
                                    {!showReview && generated && <ViewGeneratedQButton />}
                                </Group>
                                <Button color="dark" onClick={() => {
                                    toggle();
                                    setShowReview(false);
                                }} pr={6}>
                                    Advanced Options <IconChevronRight size={16} style={{ paddingTop: '2px' }} />
                                </Button>
                            </Group>
                        </GridCol>
                    </>
                )}
                <Collapse in={opened}>
                    {showReview ? <GenerateSuccessDiv /> : <PromptGenerateDiv />}
                    <GridCol>
                        <Group justify="space-between">
                            <Group gap={'sm'}>
                                <Button color="dark" onClick={() => {
                                    toggle();
                                    setShowReview(false);
                                }} pl={6}><IconChevronLeft size={16} style={{ paddingTop: '1px' }} />Back</Button>
                                {!showReview && generated && <ViewGeneratedQButton />}
                            </Group>
                            {!showReview && <Button
                                loading={generating}
                                loaderProps={{ type: 'dots' }}
                                onClick={() => handleGenerate(promptInputRef.current?.value || '', 'text')}
                                variant={'gradient'}>Generate</Button>}
                        </Group>
                    </GridCol>
                </Collapse>
            </Grid>
        </Modal>
    )
}
