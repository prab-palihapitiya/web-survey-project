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
  TextInput
} from "@mantine/core";

export default function Page() {
  const questionnaireName = useQuestionnaireStore((state) => state.name);
  const questions = useQuestionnaireStore((state) => state.questions);
  const setName = useQuestionnaireStore((state) => state.setName);
  const addQuestion = useQuestionnaireStore((state) => state.addQuestion);

  const questionnaireNameRef = useRef<HTMLInputElement>(null);

  const [nextQuestionId, setNextQuestionId] = useState(1);
  const [newlyAddedQuestionId, setNewlyAddedQuestionId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const highestId = questions.reduce(
      (maxId, question) => Math.max(maxId, question.id),
      0
    );
    setNextQuestionId(highestId + 1);
  }, [questions]);

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
    const questionnaireData = {
      name: questionnaireName,
      questions: questions
    };

    const jsonData = JSON.stringify(questionnaireData, null, 2);

    console.log(jsonData);
  };

  const cancelChanges = () => {
    // show cancel changes confirm dialog (yes/no)
  };

  const handleQuestionClose = (questionId: string | number) => {
    // Handle the closing of the Question here, e.g., remove it from an array of questions
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
            ref={questionnaireNameRef}
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <Space h="lg" />
          {questions.map((question: any) => (
            <Question
              key={question.id}
              questionData={question}
              onClose={() => handleQuestionClose(question.id)}
              highlight={question.id === newlyAddedQuestionId}
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
