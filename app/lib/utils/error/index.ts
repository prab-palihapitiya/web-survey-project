import { Answer, Question } from "../../types";

class ErrorService {
    static validateAnswer = (currentQuestion: Question, answers: Answer[]) => {
        const answer = answers.find((a: Answer) => a.questionId === currentQuestion.id?.toString());
        if (!currentQuestion.skippable && (!answer || !answer.answer)) {
            // setErrorMessages(['Please provide an answer']); // Set error message
            return false;
        }
        return true;
    }
}

export default ErrorService;
