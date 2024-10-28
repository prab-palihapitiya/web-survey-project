import { useState, useEffect } from "react";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Question } from "@/app/lib/types";
import { Box, Stack, Text, Group, rem } from "@mantine/core";
// import RichText from "@/app/ui/common/richtext";

export default function RankingControl({ currentQuestion }: { currentQuestion: Question }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString()) || { answer: [], subQuestionAnswers: [] };

    // State to manage the ranked options
    const [rankedOptions, setRankedOptions] = useState<string[]>([]);

    useEffect(() => {
        // Initialize rankedOptions from the answerEntry if it exists
        if (answerEntry && (answerEntry.answer as string[]).length > 0) {
            setRankedOptions(answerEntry.answer as string[]);
        }
    }, [answerEntry]);

    const handleOptionClick = (option: string) => {
        let updatedRankedOptions = [...rankedOptions];

        if (updatedRankedOptions.includes(option)) {
            // Remove the option from the ranked list
            updatedRankedOptions = updatedRankedOptions.filter(o => o !== option);
        } else {
            // Add the selected option to the end of the ranked list
            updatedRankedOptions.push(option);
        }

        // Update the ranked options and store the answer
        setRankedOptions(updatedRankedOptions);
        setAnswer(currentQuestion.id.toString(), updatedRankedOptions, []);
    };

    return (
        <div>
            {/* Render the options as boxes with ranking indicators */}
            <Stack>
                {currentQuestion.options?.map((option, index) => {
                    const isSelected = rankedOptions.includes(index.toString());
                    const rank = isSelected ? rankedOptions.indexOf(index.toString()) + 1 : null;

                    return (
                        <Box
                            key={index}
                            style={(theme) => ({
                                cursor: 'pointer',
                                backgroundColor: `${isSelected ? theme.colors.blue[6] : theme.colors.gray[4]}`,
                                color: isSelected ? 'white' : 'black',
                                paddingInline: theme.spacing.sm,
                                paddingBlock: rem(8),
                                borderRadius: theme.radius.sm,
                                transition: 'background-color 100ms ease'
                            })}
                            onClick={() => handleOptionClick(index.toString())}
                        >
                            <Group justify="space-between">
                                <Text size="sm">{option.name}</Text>
                                {rank && <Text size="xs" fw={600}>{rank}</Text>}
                            </Group>
                        </Box>
                    );
                })}
            </Stack>
        </div>
    );
}