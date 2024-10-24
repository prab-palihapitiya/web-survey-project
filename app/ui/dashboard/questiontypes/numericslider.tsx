import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Checkbox, Grid, GridCol, NumberInput, Space, TextInput } from "@mantine/core";

export default function NumericSlider(questionData: { id: string; config?: any }) {
    const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);

    return (
        <Grid>
            <GridCol span={3}>
                <NumberInput
                    label='Min Value'
                    value={questionData.config?.min}
                    onChange={(value) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, min: value } })
                    }
                />
                <NumberInput
                    label='Max Value'
                    value={questionData.config?.max}
                    onChange={(value) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, max: value } })
                    }
                />
            </GridCol>
            <GridCol span={3}>
                <TextInput
                    label='Label Prefix'
                    value={questionData.config?.prefix}
                    onChange={(event) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, prefix: event.target.value } })
                    }
                />
                <TextInput
                    label='Label Suffix'
                    value={questionData.config?.suffix}
                    onChange={(event) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, suffix: event.target.value } })
                    }
                />
            </GridCol>
            <GridCol span={3}>
                <NumberInput
                    label="Step"
                    value={questionData.config?.step}
                    onChange={(value) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, step: value } })
                    }
                />
                <NumberInput label='Initial Value'
                    value={questionData.config?.initialValue}
                    onChange={(value) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, initialValue: value } })
                    }
                />
            </GridCol>
            <GridCol span={3}>
                <TextInput
                    label='Left Label Text'
                    value={questionData.config?.leftLabel}
                    onChange={(event) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, leftLabel: event.target.value } })
                    }
                />
                <TextInput
                    label='Right Label Text'
                    value={questionData.config?.rightLabel}
                    onChange={(event) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, rightLabel: event.target.value } })
                    }
                />
            </GridCol>
            <GridCol>
                <Checkbox
                    label='Slider Inverted'
                    checked={questionData.config?.inverted}
                    onChange={(event) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, inverted: event.currentTarget.checked } })
                    } />
                <Space h="xs" />
                <Checkbox
                    label='Label Always Visible'
                    checked={questionData.config?.labelAlwaysOn}
                    onChange={(event) =>
                        updateQuestionData(questionData.id, { config: { ...questionData.config, labelAlwaysOn: event.currentTarget.checked } })
                    } />
            </GridCol>
        </Grid>
    );
}