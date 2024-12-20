"use client";

import { useEffect, useRef, useState } from "react";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import Question from "@/app/ui/dashboard/questionnaire/question";
import classes from "@/app/ui/dashboard/questionnaire/questionnaire.module.css";
import {
  Button,
  Container,
  Grid,
  GridCol,
  Group,
  Space,
  TextInput,
  Badge,
  Loader,
  Flex,
  ActionIcon,
  Tooltip,
  Modal,
  Text,
  Stack,
  Center,
  UnstyledButton,
  rem,
  Menu
} from "@mantine/core";
import { fetchQuestionnaire, saveQuestionnaireData } from "@/app/lib/services/questionnaire-service";
import { useRouter } from "next/navigation";
import DateTime from "@/app/ui/common/datetime";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { IconArrowBarDown, IconArrowBarUp, IconCopyPlus, IconDotsVertical, IconHomeDown, IconListCheck, IconQuestionMark, IconRowInsertBottom, IconRowInsertTop, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from '@mantine/hooks';
import PublishButton from "../common/publish";
import { Status } from "@/app/lib/types";
import useDashboardStore from "@/app/lib/state/dashboard-store";
import clsx from "clsx";

export default function Page({
  searchParams
}: {
  searchParams?: {
    id?: string;
  };
}) {
  const setNavLinkIndex = useDashboardStore((state) => state.setNavLinkIndex);
  setNavLinkIndex(1);

  const [isLoading, setIsLoading] = useState(false);
  const [lastModified, setLastModified] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(true);
  const [nextQuestionId, setNextQuestionId] = useState(1);
  const [published, setPublished] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<number>();
  const [opened, { open, close }] = useDisclosure(false);

  const questionnaireId = useQuestionnaireStore((state) => state.id);
  const questionnaireName = useQuestionnaireStore((state) => state.name);
  const { questions, logic, answers } = useQuestionnaireStore();
  const setName = useQuestionnaireStore((state) => state.setName);
  const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
  const addQuestion = useQuestionnaireStore((state) => state.addQuestion);
  const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);
  const removeQuestion = useQuestionnaireStore((state) => state.removeQuestion);

  const router = useRouter();
  const paramId = searchParams?.id;

  const questionnaireNameRef = useRef<HTMLInputElement>(null);

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return; // Prevent moving up the first question
    if (direction === 'down' && index === questions.length - 1) return; // Prevent moving down the last question

    const items = Array.from(questions);
    const [movedItem] = items.splice(index, 1);
    items.splice(index + (direction === 'up' ? -1 : 1), 0, movedItem);

    setQuestionnaire({ name: questionnaireName, questions: items, logic: logic });
  };

  const QuestionMenu = ({ index }: { index: number }) => {
    const iconStyle = { width: rem(14), height: rem(14) };
    return (
      <Menu withArrow arrowPosition="side" position="right" arrowSize={10}
        styles={{
          itemLabel: { fontSize: 'var(--mantine-font-size-xs)' }
        }}
      >
        <Menu.Target>
          <ActionIcon
            variant="light">
            <IconDotsVertical size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconRowInsertTop style={iconStyle} />}
            onClick={() => handleCreateQuestion(index)}
          >
            Add Question Before
          </Menu.Item>
          <Menu.Item
            leftSection={<IconRowInsertBottom style={iconStyle} />}
            onClick={() => handleCreateQuestion(index + 1)}
          >
            Add Question After
          </Menu.Item>
          <Menu.Item
            leftSection={<IconListCheck style={iconStyle} />}
          >
            Add Question Block
          </Menu.Item>
          {/* <Menu.Item
            leftSection={<IconPageBreak style={{ width: rem(14), height: rem(14) }} />}
          >
            Start Group By
          </Menu.Item> */}
          <Menu.Item
            leftSection={<IconArrowBarUp style={iconStyle} />}
            onClick={() => handleMoveQuestion(index, 'up')}
          >
            Move Up
          </Menu.Item>
          <Menu.Item
            leftSection={<IconArrowBarDown style={iconStyle} />}
            onClick={() => handleMoveQuestion(index, 'down')}
          >
            Move Down
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            color="red"
            leftSection={<IconTrash style={iconStyle} />}
            onClick={() => {
              removeQuestion(questions[index].id);
            }}>
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
  }

  useEffect(() => {
    const highestId = questions.reduce(
      (maxId, question) => Math.max(maxId, question.id as unknown as number), 0
    );
    setNextQuestionId(highestId + 1);
  }, [questions]);

  useEffectAfterMount(() => {
    if (paramId) {
      setIsLoading(true);
      fetchQuestionnaire(paramId)
        .then((response) => {
          setLastModified(response.data.modifiedAt);
          setQuestionnaireId(response.data.id);
          setQuestionnaire(response.data.obj);
          setPublished(response.data.status === Status.PUBLISHED);
          setPublicUrl(response.data.pubUrl);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [paramId, setQuestionnaire, setQuestionnaireId]);

  const handleCreateQuestion = (questionIndex: number) => {
    const newQuestion = {
      id: nextQuestionId,
      shortcut: "Q" + nextQuestionId
    };

    addQuestion(newQuestion, questionIndex);
    setNextQuestionId(nextQuestionId + 1);
    setSelectedQuestion(newQuestion.id as number);
  };

  const saveChanges = () => {
    if (published) {
      open();
      return;
    }
    saveQuestionnaire();
  };

  const saveQuestionnaire = () => {
    setPublicUrl('');
    setPublished(false);
    setFirstLoaded(false);
    setIsSaving(true);
    setQuestionnaire({ name: questionnaireName, questions: questions, logic: logic });
    try {
      saveQuestionnaireData(questionnaireId, questions, logic, answers, { name: questionnaireName, status: Status.DRAFT, pubUrl: '' });
      setLastModified(new Date());
      close();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  const cancelChanges = () => {
    //TODO: you have unsaved data, before quit, you wanna save them?
    //TODO: show cancel changes confirm dialog (yes/no)
    router.push('/dashboard');
  };

  const handleDeleteQuestion = (questionId: string | number) => {
    //TODO: Handle the closing of the Question here, e.g., remove it from an array of questions
    console.log(`Question with id: ${questionId} is closed!`);
  };

  const handlePublish = (url: string) => {
    setPublished(true);
    setPublicUrl(url);
    setLastModified(new Date());
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

  function handleQuestionSelect(id: number): void {
    setSelectedQuestion(id);
  }

  return (
    <div className={classes.container_wrapper}>
      <Space h={'2.5rem'} />
      <Container
        className={classes.container}
      >
        {isLoading ? (
          <div className={classes.loading_wrapper}>
            <Loader type="dots" size={'lg'} />
          </div>
        ) : (
          <div>
            <Modal
              opened={opened}
              onClose={close}
              title="Unpublish Questionnaire"
              centered
            >
              <Text size="xs">This questionnaire is published. Saving changes will unpublish it. Are you sure you want to continue? Else you can <b>create a new survey</b> with the changes you made.</Text>
              <Group mt="md" justify="space-between">
                <Button onClick={() => {
                  saveQuestionnaire();
                }} variant="gradient">
                  <IconHomeDown size={16} style={{ marginInlineEnd: '0.5rem' }} /> Save & Unpublish
                </Button>
                <Button onClick={close} variant="gradient"><IconCopyPlus size={16} style={{ marginInlineEnd: '0.5rem' }} />Duplicate</Button>
                <Button onClick={close} color="dark">Cancel</Button>
              </Group>
            </Modal>
            <div className={classes.top_bar}>
              <Flex justify={"space-between"}>
                <Group justify="flex-start">
                  <TextInput
                    variant="filled"
                    w={350}
                    rightSection={
                      <Tooltip
                        multiline
                        w={350}
                        withArrow
                        transitionProps={{ duration: 200 }}
                        style={{
                          fontSize: 'var(--mantine-font-size-xs)',
                          backgroundColor: "var(--mantine-color-blue-6)"
                        }}
                        label="Write the name of your questionnaire (e.x. My simple survey). You'll refer this name everywhere, so try to put an identifiable, unique name."
                      >
                        <ActionIcon variant="light">
                          <IconQuestionMark size={14} />
                        </ActionIcon>
                      </Tooltip>
                    }
                    placeholder="Type here..."
                    value={questionnaireName}
                    ref={questionnaireNameRef}
                    onChange={(event) => setName(event.currentTarget.value)}
                  />
                  <PublishButton id={questionnaireId} onPublish={(url: string) => handlePublish(url)} published={published} url={publicUrl} />
                </Group>
                <Group justify="flex-end">
                  <Badge
                    color={published ? 'green' : 'red'}
                    variant={'dot'}
                    style={{ border: 'none', paddingInlineEnd: '0.3rem' }}
                    styles={{
                      label: {
                        color: 'var(--mantine-color-gray-6)',
                        fontSize: 'var(--mantine-font-size-xs)',
                        fontWeight: 600
                      }
                    }}>
                    {getSavedStatus()}
                  </Badge>
                </Group>
              </Flex>
            </div>
            <Grid>
              <div className={classes.question_side_panel}>
                <div className={classes.question_tile_container}>
                  <Stack gap={'xs'}>
                    {questions.map((question: any, index: number) => (
                      <div key={index}>
                        <Flex justify="space-between" gap={'xs'}>
                          <UnstyledButton
                            className={clsx(classes.question_list_item, selectedQuestion === question.id && classes.selected)}
                            onClick={() => setSelectedQuestion(question.id as number)}
                          >
                            <Center h={'100%'}>
                              <Text size="xs" fw={500}>{question.shortcut} : {question.questionType}</Text>
                            </Center>
                          </UnstyledButton>
                          <QuestionMenu index={index} />
                        </Flex>
                      </div>
                    ))}
                  </Stack>
                </div>
              </div>
              <div className={classes.question_right_panel}>
                {questions.map((question: any, index: number) => (
                  <div key={`question-${question.id}`}>
                    <Question
                      key={question.id}
                      questionData={question}
                      highlight={question.id === selectedQuestion}
                      onClose={() => handleDeleteQuestion(question.id)}
                      onSelect={() => handleQuestionSelect(question.id)}
                    />
                  </div>
                ))}
              </div>
            </Grid>
          </div>
        )}
        <Grid className={classes.bottom_bar}>
          <GridCol>
            <Flex justify="space-between">
              <Group gap={"xs"}>
                <Button size='xs' variant="gradient" onClick={saveChanges}>Save Questionnaire</Button>
                <Button size='xs' variant="gradient" onClick={() => {
                  console.log('Save Question Template');
                }}>Save As Question Template</Button>
              </Group>
              <Group>
                <Button size='xs' color="dark" onClick={cancelChanges}>Close</Button>
              </Group>
            </Flex>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
}
