import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Question } from "@/app/lib/types";
import { Checkbox, Stack, CheckboxGroup, Radio, TextInput, Group } from "@mantine/core";
import { useState } from 'react';

export default function MultipleList({ currentQuestion }: { currentQuestion: Question }) {
    const [selectedOptionValues, setSelectedOptionValues] = useState<string[]>([]);
    const [isExclusiveSelected, setIsExclusiveSelected] = useState(false);
    const [subQuestionAnswers, setSubQuestionAnswers] = useState<{ [key: string]: string }>({}); // { 0: 'answer1', 1: 'answer2' }
    const [currentAnswer, setCurrentAnswer] = useState<string[]>([]);

    const getAnswerForQuestion = (questionId: string) => {
        const answers = useQuestionnaireStore.getState().answers;
        const answerEntry = answers.find(a => a.questionId === questionId);
        return answerEntry ? answerEntry.answer : [];
    };

    useEffectAfterMount(() => {
        setSelectedOptionValues([]);
        setIsExclusiveSelected(false);
        setSubQuestionAnswers({});

        const answer = getAnswerForQuestion(currentQuestion.id);
        if (answer) {
            setCurrentAnswer(answer);
            setSelectedOptionValues(answer);
        }
    }, [currentQuestion]);

    useEffectAfterMount(() => {
        useQuestionnaireStore.getState().setAnswer(currentQuestion.id, currentAnswer);
    }, [currentAnswer]);

    const handleOptionChange = (value: string[]) => {
        setCurrentAnswer(value);
        setSelectedOptionValues(value);
        setIsExclusiveSelected(false);
    };

    const handleExclusiveChange = (index: number) => {
        setIsExclusiveSelected(!isExclusiveSelected);
        if (!isExclusiveSelected) {
            setCurrentAnswer([index.toString()]);
            setSelectedOptionValues([]);
        }
    };

    const handleSubQuestionChange = (index: number, value: string) => {
        setSubQuestionAnswers(prevAnswers => ({
            ...prevAnswers,
            [index]: value,
        }));
    };

    return (
        <CheckboxGroup
            value={selectedOptionValues}
            onChange={handleOptionChange}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="flex-start"
                gap="xs"
            >
                {currentQuestion.options?.map((option: any, index: number) => (
                    <Group key={index}>
                        {option.exclusive === "Yes" ? (
                            <Radio
                                key={index}
                                value={index.toString()}
                                checked={currentAnswer?.includes(index.toString()) || isExclusiveSelected}
                                onChange={() => handleExclusiveChange(index)}
                                label={option.name}
                                styles={{ label: { textAlign: 'left', cursor: 'pointer' } }}
                            />
                        ) : (
                            <Checkbox
                                key={index}
                                value={index.toString()}
                                checked={currentAnswer?.includes(index.toString())}
                                label={option.name}
                                styles={{ label: { textAlign: 'left', cursor: 'pointer' } }} />
                        )}
                        {option.subQuestion === "Enabled" && (
                            <TextInput size="xs"
                                placeholder="Type your answer here"
                                value={subQuestionAnswers[index] || ''}
                                onChange={(event) => handleSubQuestionChange(index, event.target.value)} />
                        )}
                    </Group>
                ))}
            </Stack>
        </CheckboxGroup>
    );
}