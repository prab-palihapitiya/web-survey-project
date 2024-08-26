'use client';

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Container, Text, Button, Group, Badge, Divider, Stack } from "@mantine/core";
import { useState } from 'react';
import classes from "@/app/ui/dashboard/dashboard.module.css";


export default function Page() {
    const { name, questions } = useQuestionnaireStore();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    const handleNext = () => {
        setActiveQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
    };

    const handlePrevious = () => {
        setActiveQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const currentQuestion = questions[activeQuestionIndex];

    return (
        <Container className={classes.container}>

            <Badge
                size="lg"
                radius={'xs'}
            >{name}</Badge>

            {currentQuestion && (
                <>
                    <Badge
                        size="lg"
                        radius={'xs'}
                        color="green"
                        style={{ marginLeft: 5 }}
                    >
                        {currentQuestion.shortcut}
                    </Badge>
                    <div>
                        <br />
                        <Text weight={500}>{currentQuestion.introduction}</Text>
                        <br />

                        <Stack
                            h={300}
                            bg="var(--mantine-color-body)"
                            align="stretch"
                            justify="flex-start"
                            gap="md"
                        >
                            {currentQuestion.options?.map((option: any[], index: number) => (
                                <Button key={index} variant="default" style={{ textAlign: 'left' }}>{option.name}</Button>
                            ))}
                        </Stack>
                        <Divider />

                        {/* Render options or other question details */}
                    </div>
                </>


            )
            }

            <Group mt="md">
                <Button onClick={handlePrevious} disabled={activeQuestionIndex === 0}>
                    Previous
                </Button>
                <Button onClick={handleNext} disabled={activeQuestionIndex === questions.length - 1}>
                    Next
                </Button>
            </Group>
        </Container >
    );
}