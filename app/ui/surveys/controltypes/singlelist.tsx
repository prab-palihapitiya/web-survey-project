import { Group, Radio, Stack, TextInput } from "@mantine/core";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Option, Question, SubQuestionAnswer } from "@/app/lib/types";
import RichText from "@/app/ui/common/richtext";

export default function SingleList({ currentQuestion }: { currentQuestion: Question }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString());

    const handleOptionChange = (value: string, subQuestionAnswers: SubQuestionAnswer[]) => {
        setAnswer(currentQuestion.id.toString(), value, subQuestionAnswers);
    };

    return (
        <Radio.Group
            value={answerEntry?.answer as string}
            onChange={(value) => handleOptionChange(value, [])}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="flex-start"
                gap="xs"
            >
                {currentQuestion.options?.map((option: Option) => (
                    <Group key={option.index}>
                        <Radio
                            key={option.index}
                            value={option.index.toString()}
                            label={<RichText content={option.name} />}
                            styles={{ label: { textAlign: 'left', cursor: 'pointer' } }}
                        />
                        {option.subQuestion === "Enabled" && (
                            <TextInput size="xs"
                                placeholder="Type your answer here"
                                value={answerEntry?.subQuestionAnswers?.find(a => a.index === option.index.toString())?.value || ''}
                                onChange={(event) => {
                                    const subQuestionAnswer = { index: option.index.toString(), value: event.target.value };
                                    handleOptionChange(option.index.toString(), [subQuestionAnswer]);
                                }}
                            />
                        )}
                    </Group>
                ))}
            </Stack>
        </Radio.Group>
    );
}