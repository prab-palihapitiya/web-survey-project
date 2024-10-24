import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { NumericConfig } from "@/app/lib/types";
import { Fieldset, Grid, GridCol, Group, NumberInput } from "@mantine/core";

export default function Numeric(questionData: { id: string; config?: NumericConfig }) {
  const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);

  return (
    <Grid>
      <GridCol span={3}>
        <NumberInput
          label="Min Value"
          value={questionData.config?.min}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, min: value } })
          }
        />
      </GridCol>
      <GridCol span={3}>
        <NumberInput
          label="Max Value"
          value={questionData.config?.max}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, max: value } })
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
      </GridCol>
      <GridCol span={3}>
        <NumberInput
          label="Decimal Places"
          value={questionData.config?.decimalPlaces}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, decimalPlaces: value } })
          }
        />
      </GridCol>
    </Grid>
  );
}
