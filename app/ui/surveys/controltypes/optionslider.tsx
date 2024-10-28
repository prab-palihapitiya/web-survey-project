import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Group, Text, Slider, Badge } from "@mantine/core";

export default function OptionSliderControl({ currentQuestion }: { currentQuestion: any }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString());

    const values = currentQuestion.config?.values || null;
    const labels = currentQuestion.config?.labels || null;
    const sliderMarks = [];
    if (values && labels && values.length === labels.length) {
        for (let i = 0; i < values.length; i++) {
            sliderMarks.push({ value: values[i], label: labels[i] });
        }
    }

    return (
        <div>
            {/* <Group justify="space-between"> */}
            {/* {currentQuestion.config.leftLabel && (<Badge>{currentQuestion.config.leftLabel}</Badge>)} */}
            <Slider
                value={answerEntry?.answer as number || currentQuestion.config?.initialValue || 0}
                marks={sliderMarks}
                onChange={(value) => setAnswer(currentQuestion.id.toString(), value, [])}
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