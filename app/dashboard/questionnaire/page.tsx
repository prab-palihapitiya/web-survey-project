'use client';

import { Container, Button, Group, TextInput, Space, Grid, GridCol } from '@mantine/core';
import Question from '@/app/ui/dashboard/questionnaire/question';
import { useState } from 'react';
import classes from '@/app/ui/dashboard/questionnaire/questionnaire.module.css'

export default function Page() {
    const [questions, setQuestions] = useState<any[]>([]);

    const handleCreateQuestion = () => {
      // Create a new question object (replace with your actual question structure)
      const newQuestion = { 
        // ... your question data properties
      };
  
      setQuestions([...questions, newQuestion]); // Add the new question to the array
    };

    const saveChanges = () => {
        // create a json obj
        // save json obj to db.
    }

    const cancelChanges = () => {
        // show cancel changes confirm dialog (yes/no)
    }

    return (
        <Container mt="md" className={classes.container}>
            <Grid>
                <GridCol span={9}>
                    <TextInput
                        label="Questionnaire Name"
                        description="Name of your questionnaire (e.x. My simple survey). You'll refer this name everywhere, so try to put an identifiable/unique name."
                        placeholder="Type here..."
                        />                                
                    <Space h="lg" />                    
                    {questions.map((question: any, index: number) => (
                        <Question key={index} questionData={question} /> 
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