"use client";

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import Question from "@/app/ui/dashboard/questionnaire/question";
import classes from "@/app/ui/dashboard/questionnaire/questionnaire.module.css";
import { use, useEffect, useRef, useState } from "react";

import {
  Button,
  Container,
  Grid,
  GridCol,
  Group,
  Space,
  TextInput
} from "@mantine/core";
import { createEmptyQuestionnaire, fetchQuestionnaire, saveQuestionnaire } from "@/app/services/questionnaire-service";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const [nextQuestionId, setNextQuestionId] = useState(1);
  const [newlyAddedQuestionId, setNewlyAddedQuestionId] = useState<
    number | null
  >(null);

  // const [questionnaire, setQuestionnaire] = useState(null); // State to store the fetched questionnaire

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

  useEffect(() => {
    if (!paramId) {
      createEmptyQuestionnaire().then((newQuestionnaireId) => {
        setQuestionnaireId(newQuestionnaireId);
        setQuestionnaire({ name: questionnaireName, questions: [] });
        router.push(`/dashboard/questionnaire?id=${newQuestionnaireId}`);
      });
    }
  }, [paramId, questionnaireName, router, setQuestionnaire, setQuestionnaireId]);

  useEffect(() => {
    if (paramId) {
      fetchQuestionnaire(paramId).then((response) => {
        setQuestionnaireId(response.data.id);
        setQuestionnaire(response.data.obj);
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

  const saveChanges = () => {
    setQuestionnaire({ name: questionnaireName, questions: questions });
    saveQuestionnaire(questionnaireId, questions, [], { name: questionnaireName });
    // TODO: Show a 'saved successfully' message with the time saved, on the top of the page
  };


  const cancelChanges = () => {
    //TODO: you have unsaved data, before quit, you wanna save them?
    //TODO: show cancel changes confirm dialog (yes/no)
  };

  const handleQuestionClose = (questionId: string | number) => {
    //TODO: Handle the closing of the Question here, e.g., remove it from an array of questions
    console.log(`Question with id: ${questionId} is closed!`);
  };

  return (
    <Container
      mt="md"
      className={classes.container}
    >
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
    </Container>
  );
}
