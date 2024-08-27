'use client';

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Container, Text, Button, Group, Badge, Select, Space, Grid, GridCol } from "@mantine/core";
import { useEffect, useState } from 'react';
import classes from "@/app/ui/dashboard/dashboard.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchQuestionnaire, fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import { QuestionTypeMappings } from "@/app/lib/types";

export default function Page() {
    const { name, questions } = useQuestionnaireStore();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [questionnaires, setQuestionnaires] = useState([]); // To store the list of questionnaires
    const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState(''); // To store the selected questionnaire ID

    const questionnaireId = useQuestionnaireStore((state) => state.id);
    const setQuestionnaireId = useQuestionnaireStore((state) => state.setId);
    const setQuestionnaire = useQuestionnaireStore((state) => state.setQuestionnaire);

    const router = useRouter();
    const params = useSearchParams();
    const paramId = params.get('id');

    useEffect(() => {
        const userId = "clzyfzfg300002y2l8a7du5lf"; // TODO: Replace with how you get the actual user ID

        fetchQuestionnairesByUser(userId)
            .then((response) => {
                setQuestionnaires(response.data);
            })
            .catch((error) => {
                console.error("Error fetching questionnaires:", error);
            });
    }, []);

    const handleQuestionnaireSelect = (value: string | null) => {
        if (!value) {
            return;
        }
        setSelectedQuestionnaireId(value);
        setQuestionnaireId(value);

        // setIsLoading(true);
        fetchQuestionnaire(value)
            .then((response) => {
                setQuestionnaireId(response.data.id);
                setQuestionnaire(response.data.obj);
                router.push(`/dashboard/preview?id=${value}`); // Navigate to the selected questionnaire preview
            })
            .finally(() => {
                // setIsLoading(false);
            });
    };

    const handleNext = () => {
        setActiveQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
    };

    const handlePrevious = () => {
        setActiveQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const currentQuestion = questions[activeQuestionIndex];

    const { Control: ControlComponent } = currentQuestion && QuestionTypeMappings[currentQuestion.questionType] || {};

    return (
        <Container className={classes.container}>
            <Grid>
                <GridCol>
                    <Select
                        placeholder="Select a Questionnaire"
                        data={questionnaires.map((q: { id: string, name: string }) => ({ value: q.id, label: q.name }))}
                        value={selectedQuestionnaireId || questionnaireId === paramId ? questionnaireId : ''}
                        onChange={handleQuestionnaireSelect}
                    />
                    <Space h="xs" />
                </GridCol>
                {questionnaireId && paramId && questionnaireId === paramId && questions.length > 0 && (
                    <GridCol>
                        <Badge
                            size="lg"
                            radius={'xs'}
                            style={{ textTransform: 'none' }}
                        >
                            {name}
                        </Badge>
                        {currentQuestion && (
                            <>
                                <Badge
                                    size="lg"
                                    radius={'xs'}
                                    color="green"
                                    style={{ marginLeft: 5, textTransform: 'none' }}
                                    autoCapitalize="false"
                                >
                                    {currentQuestion.shortcut}
                                </Badge>
                                <div>
                                    <Space h="lg" />
                                    <Text>{currentQuestion.introduction}</Text>
                                    <Space h="md" />
                                    {ControlComponent && <ControlComponent currentQuestion={currentQuestion} />}
                                    <Space h="md" />
                                </div>
                            </>
                        )}

                        <Group mt="md">
                            <Button onClick={handlePrevious} disabled={activeQuestionIndex === 0}>
                                Previous
                            </Button>
                            <Button onClick={handleNext} disabled={activeQuestionIndex === questions.length - 1}>
                                Next
                            </Button>
                        </Group>
                    </GridCol>
                )}
                {questions.length === 0 && (
                    <GridCol>
                        <Text>No questions to preview...</Text>
                    </GridCol>
                )}
            </Grid>
        </Container >
    );
}