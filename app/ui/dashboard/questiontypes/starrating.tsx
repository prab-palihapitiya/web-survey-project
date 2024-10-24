import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Checkbox, Grid, GridCol, NumberInput, Space, TagsInput, TextInput } from "@mantine/core";

export default function StarRating(questionData: { id: string; config?: any }) {
    const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);

    return (
        <Grid>
            <GridCol span={3}>
                <NumberInput
                    label="Stars Count"
                    value={questionData.config?.starsCount}
                    onChange={(value) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, starsCount: value } })
                    }
                />
            </GridCol>
            <GridCol span={3}>
                <NumberInput
                    label="Initial Value"
                    value={questionData.config?.initialValue}
                    onChange={(value) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, initialValue: value } })
                    }
                />
            </GridCol>
            <GridCol span={3}>
                <NumberInput
                    label="Fractions"
                    value={questionData.config?.fractions}
                    onChange={(value) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, fractions: value } })
                    }
                />
            </GridCol>
        </Grid>
    );
}
