import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Group, Text, Slider, Badge } from "@mantine/core";

export default function NumericSliderControl({ currentQuestion }: { currentQuestion: any }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString());

    return (
        <div>
            {/* <Group justify="space-between"> */}
            {/* {currentQuestion.config.leftLabel && (<Badge>{currentQuestion.config.leftLabel}</Badge>)} */}
            <Slider
                value={answerEntry?.answer as number || currentQuestion.config?.initialValue || 0}
                onChange={(value) => setAnswer(currentQuestion.id.toString(), value, [])}
                min={currentQuestion.config?.min || 0}
                max={currentQuestion.config?.max || 100}
                step={currentQuestion.config?.step || 1}
                label={(value) => `${currentQuestion.config?.prefix || ''} ${value} ${currentQuestion.config?.suffix || ''}`}
                inverted={currentQuestion.config?.inverted || false}
                labelAlwaysOn={currentQuestion.config?.labelAlwaysOn || false}
            />
            {/* {currentQuestion.config.rightLabel && (<Badge>{currentQuestion.config.rightLabel}</Badge>)} */}
            {/* </Group> */}
        </div>
    );
}