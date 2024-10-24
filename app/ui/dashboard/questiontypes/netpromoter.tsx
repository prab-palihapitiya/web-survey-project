import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Grid, GridCol, NumberInput, TextInput } from "@mantine/core";

export default function NetPromoterScore(questionData: { id: string; config?: any }) {
    const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);

    return (
        <Grid>
            <GridCol span={3}>
                <TextInput
                    label="Left Label Text"
                    value={questionData.config?.leftLabel}
                    onChange={(event) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, leftLabel: event.currentTarget.value } })
                    }
                />
            </GridCol>
            <GridCol span={3}>
                <TextInput
                    label="Right Label Text"
                    value={questionData.config?.rightLabel}
                    onChange={(event) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, rightLabel: event.currentTarget.value } })
                    }
                />
            </GridCol>
        </Grid>
    );
}
