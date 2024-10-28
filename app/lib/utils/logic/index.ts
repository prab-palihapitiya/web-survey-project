import { Logic, Question, Answer, Conditions } from "@/app/lib/types";

class LogicService {
    static checkIfConditionMet(answer: Answer, logic?: Logic) {
        if (logic) {
            if (answer) {
                if (logic.condition === Conditions.Has) {
                    return this.checkHasAnswer(answer.answer as string | string[], logic.answer);
                } else if (logic.condition === Conditions.Contains) {
                    return this.checkContainsAnswer(answer.answer as string, logic.answer);
                }
            }
        }
        return false;
    }

    static checkContainsAnswer(answer: string, logicAnswer: string) {
        return answer === logicAnswer;
    }

    static checkHasAnswer(answer: string | string[], logicAnswer: string | string[]) {
        // Convert single values to arrays
        const answerArray = Array.isArray(answer) ? answer : [answer];
        const logicAnswerArray = Array.isArray(logicAnswer) ? logicAnswer : [logicAnswer];

        // Check if any element in answerArray is included in logicAnswerArray
        return answerArray.some((a: string) => logicAnswerArray.includes(a as string));
    }

    static getTargetedLogics(question: Question, logics: Logic[]) {
        let tl: Logic[] = [];
        if (logics && logics.length > 0) {
            logics.forEach((item: Logic) => {
                if (item.targetQuestionId === question.id.toString()) {
                    tl.push(item);
                }
            });
        }
        return tl;
    }
}

export default LogicService;