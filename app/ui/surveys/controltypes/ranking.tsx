import { useState, useEffect } from "react";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Question } from "@/app/lib/types";
import { Box, Stack, Text, Group, rem, Badge, Flex, Divider, Center } from "@mantine/core";
// import RichText from "@/app/ui/common/richtext";

export default function RankingControl({ currentQuestion }: { currentQuestion: Question }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString()) || { answer: [], subQuestionAnswers: [] };

    // State to manage the ranked indices
    const [rankedIndices, setRankedIndices] = useState<string[]>([]);

    useEffect(() => {
        // Initialize rankedIndices from the answerEntry if it exists
        if (answerEntry && (answerEntry.answer as string[]).length > 0) {
            setRankedIndices(answerEntry.answer as string[]);
        }
    }, [answerEntry]);

    const handleOptionClick = (option: string) => {
        let updatedRankedIndices = [...rankedIndices];

        if (updatedRankedIndices.includes(option)) {
            // Remove the option from the ranked list
            updatedRankedIndices = updatedRankedIndices.filter(o => o !== option);
        } else {
            // Add the selected option to the end of the ranked list
            updatedRankedIndices.push(option);
        }

        // Update the ranked indices and store the answer
        setRankedIndices(updatedRankedIndices);
        setAnswer(currentQuestion.id.toString(), updatedRankedIndices, []);
    };

    const RankingOption = ({ index, option, isSelected, rankedIndex }: { index: number, option: any, isSelected: boolean, rankedIndex: number }) => {
        return (
            <Box
                key={index}
                style={(theme) => ({
                    cursor: 'pointer',
                    backgroundColor: `${isSelected ? theme.colors.blue[6] : theme.colors.gray[5]}`,
                    color: 'white',
                    paddingInline: theme.spacing.sm,
                    paddingInlineEnd: theme.spacing.xs,
                    paddingBlock: rem(8),
                    borderRadius: theme.radius.sm,
                    transition: 'background-color 100ms ease'
                })}
                onClick={() => handleOptionClick(index.toString())}>
                <Flex justify="space-between" gap={'xs'}>
                    <Text size="sm">{option.name}</Text>
                    {rankedIndex && (
                        <Center>
                            <div
                                style={{
                                    height: rem(20),
                                    width: rem(20),
                                    backgroundColor: 'var(--mantine-color-blue-0)',
                                    color: 'var(--mantine-color-blue-7)',
                                    borderRadius: rem(10),
                                    paddingInline: rem(8),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                <Text size="xs" fw={600}>{rankedIndex}</Text>
                            </div>
                        </Center>
                    )}
                </Flex>
            </Box>
        );
    }

    return (
        <div>
            <Stack>
                {currentQuestion.options?.map((option, index) => {
                    const isSelected = rankedIndices.includes(index.toString());
                    const rank = isSelected ? rankedIndices.indexOf(index.toString()) + 1 : null;
                    return (<RankingOption
                        key={index}
                        index={index}
                        option={option}
                        isSelected={isSelected}
                        rankedIndex={rank}
                    />);
                })}
            </Stack>
        </div>
    );
}