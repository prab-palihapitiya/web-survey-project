import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { NumberInput } from "@mantine/core";

export default function NumericInput({ currentQuestion }: { currentQuestion: any }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString());

    return (
        <NumberInput
            value={answerEntry?.answer as number}
            placeholder="Type your answer here..."
            onChange={(value: string | number) =>
                setAnswer(currentQuestion.id.toString(), value, [])
            }
        />
    );
}