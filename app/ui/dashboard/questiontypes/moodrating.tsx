import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Grid, GridCol, NumberInput } from "@mantine/core";

export default function MoodRating(questionData: { id: string; config?: any }) {
    const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);

    return (
        <Grid>
            <GridCol span={3}>
                <NumberInput
                    label="Initial Value"
                    value={questionData.config?.initialValue}
                    onChange={(value) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, initialValue: value } })
                    }
                />
            </GridCol>
        </Grid>
    );
}
