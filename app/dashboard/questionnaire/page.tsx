'use client';

import { Container, Button, Group, TextInput, Space, Grid, GridCol } from '@mantine/core';
import Question from '@/app/ui/dashboard/questionnaire/question';
import { useRef, useState } from 'react';
import classes from '@/app/ui/dashboard/questionnaire/questionnaire.module.css'
import useQuestionnaireStore from '@/app/lib/store';

export default function Page() {
    const questionnaireName = useQuestionnaireStore(state => state.name);
    const questions = useQuestionnaireStore(state => state.questions);
    const setName = useQuestionnaireStore(state => state.setName);
    const addQuestion = useQuestionnaireStore(state => state.addQuestion);

    const questionnaireNameRef = useRef<HTMLInputElement>(null);

    const handleCreateQuestion = () => {
      const newQuestion = { 
        id: questions.length + 1,
        // ... your question data properties
      };
      addQuestion(newQuestion); 
    };

    const saveChanges = () => {
        const questionnaireData = {
            name: questionnaireName,
            questions: questions,
        };

        const jsonData = JSON.stringify(questionnaireData, null, 2); 

        console.log(jsonData);         
    }
    
    const cancelChanges = () => {
        // show cancel changes confirm dialog (yes/no)
    }

    const handleQuestionClose = () => {
        // Handle the closing of the Question here, e.g., remove it from an array of questions
        console.log('Question closed!');
    }

    return (
        <Container mt="md" className={classes.container}>
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
                    {questions.map((question: any, index: number) => (
                        <Question key={question.id} questionData={question} onClose={handleQuestionClose}/> 
                    ))}
                </GridCol>
                {/* <GridCol span={3}>
                    Questionnaire History
                </GridCol> */}
                <GridCol>
                    <Group mb="md">
                        <Button onClick={handleCreateQuestion}>+ New Question</Button>
                        <Button onClick={saveChanges}>Save Changes</Button>
                        <Button onClick={cancelChanges}>Cancel</Button>
                    </Group>                
                </GridCol>
            </Grid>
        </Container>
    )
}