import { Logic, Question } from "@/app/lib/types";

class LogicService {
    static getTargetedLogic = (question: Question, logic: Logic[]) => {
        let tl: string[] = [];
        if (logic && logic.length > 0) {
            logic.forEach((item: Logic) => {
                if (item.targetQuestionId === question.id.toString()) {
                    tl.push(item.action);
                }
            });
        }
        return tl;
    }
}

export default LogicService;