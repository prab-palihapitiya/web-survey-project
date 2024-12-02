import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { ActionIcon, Flex, Group, rem, Stack, Text } from "@mantine/core";

const getColor = (value: number) => {
    if (value < 3) return 'red';
    if (value < 5) return 'orange';
    if (value < 8) return 'yellow';
    if (value < 10) return 'lime';
    return 'green';
};

const scores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function NetPromoterScoreControl({ currentQuestion }: { currentQuestion: any }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString());

    return (
        <div>
            <Flex justify="space-between" style={{ width: '29.5rem' }} mb={rem(16)}>
                <Text size="sm">{currentQuestion.config?.leftLabel || '0 - Not at all likely'}</Text>
                <Text size="sm">{currentQuestion.config?.rightLabel || 'Extremely likely - 10'}</Text>
            </Flex>
            <Group gap={'xs'}>
                {
                    scores.map((value) => {
                        return (
                            <ActionIcon
                                key={value}
                                size={'lg'}
                                onClick={() => setAnswer(currentQuestion.id.toString(), value, [])}
                                color={value === answerEntry?.answer ? getColor(value) : 'var(--mantine-color-gray-4)'}
                                style={{ fontWeight: 500 }}
                            >
                                {value - 1}
                            </ActionIcon>
                        );
                    })
                }
            </Group>
        </div>
    );
}