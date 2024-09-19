import { Answer, Question } from "@/app/lib/types";

class ErrorService {
    static validateAnswer = (currentQuestion: Question, answers: Answer[]) => {
        if (currentQuestion.skippable) {
            return []; // Skip validation if the question is skippable
        }

        const answer = answers.find((a: Answer) => a.questionId === currentQuestion.id?.toString());
        if (!answer || !answer.answer) {
            return ['no_answer'];
        }
    }
}

export default ErrorService;
