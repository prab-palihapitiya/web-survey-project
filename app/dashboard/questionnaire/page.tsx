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
  Tooltip
} from "@mantine/core";
import { createEmptyQuestionnaire, fetchQuestionnaire, saveQuestionnaireData } from "@/app/lib/services/questionnaire-service";
import { useRouter, useSearchParams } from "next/navigation";
import DateTime from "@/app/ui/utils/datetime";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import { IconPlus, IconQuestionMark } from "@tabler/icons-react";

export default function Page({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [lastModified, setLastModified] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(true);
  const [nextQuestionId, setNextQuestionId] = useState(1);
  const [newlyAddedQuestionId, setNewlyAddedQuestionId] = useState<
    number | null
  >(null);

  const questionnaireId = useQuestionnaireStore((state) => state.id);
  const questionnaireName = useQuestionnaireStore((state) => state.name);
  const { name, questions, logic } = useQuestionnaireStore();
  const setName = useQuestionnaireStore((state) => state.setName);
  const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
  const addQuestion = useQuestionnaireStore((state) => state.addQuestion);
  const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);

  const router = useRouter();
  const pm = useSearchParams();
  const paramId = pm.get("id");

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
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [paramId, setQuestionnaire, setQuestionnaireId]);

  const handleCreateQuestion = (questionIndex: number) => {
    console.log(`Create question before question with id: ${questionIndex}`);

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

  const saveChanges = async () => {
    setFirstLoaded(false);
    setIsSaving(true);
    setQuestionnaire({ name: questionnaireName, questions: questions });
    console.log(questions);
    try {
      await saveQuestionnaireData(questionnaireId, questions, logic, [], { name: questionnaireName });
      setLastModified(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelChanges = () => {
    //TODO: you have unsaved data, before quit, you wanna save them?
    //TODO: show cancel changes confirm dialog (yes/no)
  };

  const handleQuestionClose = (questionId: string | number) => {
    //TODO: Handle the closing of the Question here, e.g., remove it from an array of questions
    console.log(`Question with id: ${questionId} is closed!`);
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
          <Loader size={30} />
        </div>
      ) : (
        <>
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
                    onClose={() => handleQuestionClose(question.id)}
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
            <Button size='xs' onClick={saveChanges}>Save Changes</Button>
            <Button size='xs' onClick={cancelChanges}>Cancel</Button>
          </Group>
        </GridCol>
      </Grid>
    </Container>
  );
}
