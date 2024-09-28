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
  Text
} from "@mantine/core";
import { createEmptyQuestionnaire, fetchQuestionnaire, saveQuestionnaireData } from "@/app/lib/services/questionnaire-service";
import { useRouter } from "next/navigation";
import DateTime from "@/app/ui/utils/datetime";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { IconCopyPlus, IconHomeDown, IconPlus, IconQuestionMark } from "@tabler/icons-react";
import { useDisclosure } from '@mantine/hooks';
import PublishButton from "../common/publish";
import { Status } from "@/app/lib/types";

export default function Page({
  searchParams
}: {
  searchParams?: {
    id?: string;
  };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(true);
  const [nextQuestionId, setNextQuestionId] = useState(1);
  const [newlyAddedQuestionId, setNewlyAddedQuestionId] = useState<
    number | null
  >(null);
  const [published, setPublished] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');

  const questionnaireId = useQuestionnaireStore((state) => state.id);
  const questionnaireName = useQuestionnaireStore((state) => state.name);
  const { name, questions, logic, answers } = useQuestionnaireStore();
  const setName = useQuestionnaireStore((state) => state.setName);
  const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
  const addQuestion = useQuestionnaireStore((state) => state.addQuestion);
  const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);

  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();
  const paramId = searchParams?.id;

  const questionnaireNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const highestId = questions.reduce(
      (maxId, question) => Math.max(maxId, question.id as unknown as number), 0
    );
    setNextQuestionId(highestId + 1);
  }, [questions]);

  useEffectAfterMount(() => {
    if (!paramId) {
      createEmptyQuestionnaire().then((newQuestionnaireId) => {
        setQuestionnaireId(newQuestionnaireId);
        setQuestionnaire({ name: questionnaireName, questions: [] });
        router.push(`/dashboard/questionnaire?id=${newQuestionnaireId}`);
      });
    }
  }, []);

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
    setNewlyAddedQuestionId(nextQuestionId);
    setNextQuestionId(nextQuestionId + 1);

    setTimeout(() => {
      setNewlyAddedQuestionId(null);
    }, 5000);
  };

  const saveChanges = () => {
    if (published) {
      open(); // Open the dialog if published
      return; // Prevent further execution until confirmed
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

  return (
    <Container
      mt="md"
      className={classes.container}
    >
      {isLoading ? (
        <div className={classes.loading_wrapper}>
          <Loader />
        </div>
      ) : (
        <>
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

          <Grid className={classes.top_bar}>
            <GridCol>
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
                    size="lg"
                    radius={0}
                    style={{ backgroundColor: 'var(--mantine-color-green-6)', fontSize: 'var(--mantine-font-size-xs)', padding: '0.8rem' }}
                  >
                    {getSavedStatus()}
                  </Badge>
                </Group>
              </Flex>
            </GridCol>
          </Grid>
          <Space h="xs" />
          <Grid>
            <GridCol>
              <Space h="lg" />
              {questions.map((question: any, index: number) => (
                <div key={`question-${question.id}`}>
                  <Flex justify="center">
                    <ActionIcon
                      title="Add Question Here"
                      className={classes.plus_icon}
                      variant="transparent"
                      onClick={() => handleCreateQuestion(index)}
                    >
                      <IconPlus size={16} />
                    </ActionIcon>
                  </Flex>
                  <Space h="xs" />
                  <Question
                    key={question.id}
                    questionData={question}
                    highlight={question.id === newlyAddedQuestionId}
                    onClose={() => handleDeleteQuestion(question.id)}
                  />
                </div>
              ))}
              <Flex justify="center">
                <ActionIcon
                  title="Add Question Here"
                  className={classes.plus_icon}
                  variant="transparent"
                  onClick={() => handleCreateQuestion(questions.length)}
                >
                  <IconPlus size={16} />
                </ActionIcon>
              </Flex>
            </GridCol>
          </Grid>
        </>
      )}
      <Grid className={classes.bottom_bar}>
        <GridCol>
          <Group gap={"xs"}>
            <Button size='xs' variant="gradient" onClick={saveChanges}>Save Changes</Button>
            <Button size='xs' color="dark" onClick={cancelChanges}>Close</Button>
          </Group>
        </GridCol>
      </Grid>
    </Container>
  );
}
