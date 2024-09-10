import { Radio, Stack } from "@mantine/core";
import { useEffect, useState } from 'react';
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Question } from "@/app/lib/types";

export default function SingleList({ currentQuestion }: { currentQuestion: Question }) {
    const [selectedOptionValue, setSelectedOptionValue] = useState<string | null>(null);

    const getAnswerForQuestion = (questionId: string) => {
        const answers = useQuestionnaireStore(state => state.answers);
        const answerEntry = answers.find(a => a.questionId === questionId);
        return answerEntry ? answerEntry.answer : null;
    };

    const answer = getAnswerForQuestion(currentQuestion.id.toString());

    useEffect(() => {
        setSelectedOptionValue(null);

        if (answer) {
            setSelectedOptionValue(answer.toString());
        }
    }, [currentQuestion]);

    useEffect(() => {
        useQuestionnaireStore.getState().setAnswer(currentQuestion.id.toString(), selectedOptionValue);
    }, [selectedOptionValue]);

    const handleOptionChange = (value: string) => {
        setSelectedOptionValue(value);
    };

    return (
        <Radio.Group
            value={selectedOptionValue}
            onChange={handleOptionChange}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="flex-start"
                gap="xs"
            >
                {currentQuestion.options?.map((option: any, index: number) => (
                    <Radio
                        key={index}
                        value={index.toString()}
                        label={option.name}
                        styles={{ label: { textAlign: 'left', cursor: 'pointer' } }}
                    />
                ))}
            </Stack>
        </Radio.Group>
    );
}