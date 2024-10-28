import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Rating } from "@mantine/core";

export default function StarRatingControl({ currentQuestion }: { currentQuestion: any }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString());

    return (
        <Rating
            size={'xl'}
            count={currentQuestion.config?.starsCount || 5}
            value={answerEntry?.answer as number || currentQuestion.config?.initialValue || 1}
            onChange={(value) => setAnswer(currentQuestion.id.toString(), value, [])}
            fractions={currentQuestion.config?.fractions || 1}
        />
    );
}