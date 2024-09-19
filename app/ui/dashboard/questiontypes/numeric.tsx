import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { NumericConfig } from "@/app/lib/types";
import { Fieldset, Group, NumberInput } from "@mantine/core";

export default function Numeric(questionData: { id: string; config?: NumericConfig }) {
  const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);

  return (
    <Fieldset legend="Numeric Input Configuration" p={10}>
      <Group>
        <NumberInput
          label="Min"
          value={questionData.config?.min}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, min: value } })
          }
        />
        <NumberInput
          label="Max"
          value={questionData.config?.max}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, max: value } })
          }
        />
        <NumberInput
          label="Step"
          value={questionData.config?.step}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, step: value } })
          }
        />
        <NumberInput
          label="Decimal Places"
          value={questionData.config?.decimalPlaces}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, decimalPlaces: value } })
          }
        />
      </Group>
    </Fieldset>
  );
}
