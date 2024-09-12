import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Question, SubQuestionAnswer } from "@/app/lib/types";
import { Checkbox, Stack, CheckboxGroup, Radio, TextInput, Group } from "@mantine/core";

export default function MultipleList({ currentQuestion }: { currentQuestion: Question }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString()) || { answer: [], subQuestionAnswers: [] };

    const handleOptionChange = (answer: string | string[], subQuestionAnswers: SubQuestionAnswer[], isExclusive?: boolean) => {
        let updatedAnswers = Array.isArray(answer) ? [...answer] : [answer];

        // If non-exclusive options are selected, remove any exclusive radio option
        if (!isExclusive) {
            updatedAnswers = updatedAnswers.filter((answer) => {
                const options = currentQuestion.options || [];
                return options[parseInt(answer)]?.exclusive !== "Yes"; // Remove exclusive option if a non-exclusive one is selected
            });
        } else {
            // If exclusive option is selected, clear other selected checkboxes
            updatedAnswers = [answer as string];
        }

        setAnswer(currentQuestion.id.toString(), updatedAnswers, subQuestionAnswers);
    };

    const handleSubQuestionChange = (index: number, subQuestionAnswer: SubQuestionAnswer, isExclusive?: boolean) => {
        const updatedSubQuestionAnswers = [...answerEntry?.subQuestionAnswers || []];
        const existingSubQuestionAnswer = updatedSubQuestionAnswers.find(a => a.index === index.toString());

        if (existingSubQuestionAnswer) {
            existingSubQuestionAnswer.value = subQuestionAnswer.value;
        } else {
            updatedSubQuestionAnswers.push(subQuestionAnswer);
        }

        // If non-exclusive options are selected, remove any exclusive radio option
        if (!isExclusive) {
            updatedSubQuestionAnswers.forEach((subQuestionAnswer) => {
                const options = currentQuestion.options || [];
                if (options[parseInt(subQuestionAnswer.index)]?.exclusive === "Yes") {
                    updatedSubQuestionAnswers.splice(updatedSubQuestionAnswers.indexOf(subQuestionAnswer), 1);
                }
            });
        }

        setAnswer(currentQuestion.id.toString(), answerEntry?.answer as string[], updatedSubQuestionAnswers);
    };

    return (
        <CheckboxGroup
            value={answerEntry?.answer as string[]}
            onChange={
                (value) => {
                    handleOptionChange(value, answerEntry?.subQuestionAnswers as SubQuestionAnswer[], false);
                }
            }
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
                                label={option.name}
                                value={index.toString()}
                                checked={(answerEntry?.answer as string[]).includes(index.toString())}
                                onChange={() => {
                                    handleOptionChange(index.toString(), [], true);
                                }}
                                styles={{ label: { textAlign: 'left', cursor: 'pointer' } }}
                            />
                        ) : (
                            <Checkbox
                                key={index}
                                value={index.toString()}
                                label={option.name}
                                styles={{ label: { textAlign: 'left', cursor: 'pointer' } }} />
                        )}
                        {option.subQuestion === "Enabled" && (
                            <TextInput size="xs"
                                placeholder="Type your answer here"
                                value={answerEntry?.subQuestionAnswers?.find(a => a.index === index.toString())?.value || ''}
                                onChange={(event) => {
                                    const subQuestionAnswer: SubQuestionAnswer = { index: index.toString(), value: event.target.value };
                                    handleSubQuestionChange(index, subQuestionAnswer, option.exclusive === "Yes");
                                }}
                            />
                        )}
                    </Group>
                ))}
            </Stack>
        </CheckboxGroup>
    );
}
