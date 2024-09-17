import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Question } from "@/app/lib/types";
import { Textarea, TextInput } from "@mantine/core";

export default function TextInputControl({ currentQuestion }: { currentQuestion: Question }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString());

    return (
        currentQuestion.questionType === "Text Input" ? (
            <TextInput
                value={answerEntry?.answer as string}
                placeholder="Type your answer here..."
                onChange={
                    (event) => setAnswer(currentQuestion.id.toString(), event.target.value, [])
                }
            />
        ) : (
            <Textarea
                value={answerEntry?.answer as string}
                placeholder="Type your answer here..."
                onChange={
                    (event) => setAnswer(currentQuestion.id.toString(), event.target.value, [])
                }
            ></Textarea>
        ))
};