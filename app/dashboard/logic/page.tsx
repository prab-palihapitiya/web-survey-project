'use client';

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Container, Text, Button, Group, Badge, Select, Space, Grid, GridCol } from "@mantine/core";
import { useEffect, useState } from 'react';
import classes from "@/app/ui/dashboard/dashboard.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchQuestionnaire, fetchQuestionnairesByUser } from "@/app/lib/services/questionnaire-service";
import { QuestionTypeMappings } from "@/app/lib/config/question-config";

export default function Page() {
    const { name, questions } = useQuestionnaireStore();
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
                router.push(`/dashboard/logic?id=${value}`); // Navigate to the selected questionnaire preview
            })
            .finally(() => {
                // setIsLoading(false);
            });
    };

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
                    <GridCol span={2}>
                        <Select
                            data={questions.map((question) => ({ value: question.id.toString(), label: question.shortcut }))}
                            placeholder="Select a question"
                        />
                    </GridCol>
                )}
                {questionnaireId && questions.length === 0 && (
                    <GridCol>
                        <Text>Empty Questionnaire.</Text>
                    </GridCol>
                )}
            </Grid>
        </Container >
    );
}