"use client";

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import Question from "@/app/ui/dashboard/questionnaire/question";
import classes from "@/app/ui/dashboard/questionnaire/questionnaire.module.css";
import { useEffect, useRef, useState } from "react";

import {
  Button,
  Container,
  Grid,
  GridCol,
  Group,
  Space,
  TextInput,
  Badge,
  Loader
} from "@mantine/core";
import { createEmptyQuestionnaire, fetchQuestionnaire, saveQuestionnaireData } from "@/app/lib/services/questionnaire-service";
import { useRouter, useSearchParams } from "next/navigation";
import DateTime from "@/app/ui/utils/datetime";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";

export default function Page() {
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
  const questions = useQuestionnaireStore((state) => state.questions);
  const setName = useQuestionnaireStore((state) => state.setName);
  const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
  const addQuestion = useQuestionnaireStore((state) => state.addQuestion);
  const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);

  const router = useRouter();
  const params = useSearchParams();
  const paramId = params.get('id');

  const questionnaireNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const highestId = questions.reduce(
      (maxId, question) => Math.max(maxId, question.id),
      0
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
  }, [paramId, questionnaireName, router, setQuestionnaire, setQuestionnaireId]);

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

  const handleCreateQuestion = () => {
    const newQuestion = {
      id: nextQuestionId,
      shortcut: "Q" + nextQuestionId
    };

    addQuestion(newQuestion);
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
    try {
      await saveQuestionnaireData(questionnaireId, questions, [], { name: questionnaireName });
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
          <Badge
            size="lg"
            radius={'xs'}
            color="green"
            style={{
              position: 'fixed',
              top: 10,
              right: 25,
              zIndex: 1000
            }}
          >
            {getSavedStatus()}
          </Badge>
          <Grid>
            <GridCol>
              <TextInput
                label="Questionnaire Name"
                description="Name of your questionnaire (e.x. My simple survey). You'll refer this name everywhere, so try to put an identifiable/unique name."
                placeholder="Type here..."
                value={questionnaireName}
                ref={questionnaireNameRef}
                onChange={(event) => setName(event.currentTarget.value)}
              />
              <Space h="lg" />
              {questions.map((question: any) => (
                <Question
                  key={question.id}
                  questionData={question}
                  highlight={question.id === newlyAddedQuestionId}
                  onClose={() => handleQuestionClose(question.id)}
                />
              ))}
            </GridCol>
            <GridCol>
              <Group
                mb="md"
                gap={"xs"}
              >
                <Button onClick={handleCreateQuestion}>+ New Question</Button>
                <Button onClick={saveChanges}>Save Changes</Button>
                <Button onClick={cancelChanges}>Cancel</Button>
              </Group>
            </GridCol>
          </Grid>
        </>
      )}
    </Container>
  );
}
