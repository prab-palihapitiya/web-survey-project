import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { TextConfig } from "@/app/lib/types";
import { Checkbox, Fieldset, Group, NumberInput, TextInput } from "@mantine/core";

export default function Text(questionData: { id: string; config?: TextConfig }) {
  const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);

  return (
    <Fieldset legend="Text Input Configuration" p={10}>
      <Group>
        <TextInput
          label="Placeholder"
          value={questionData.config?.placeholder || ''}
          onChange={(event) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, placeholder: event.target.value as string } })
          }
        />
        <NumberInput
          label="Max Character Length"
          value={questionData.config?.maxCharLength}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, maxCharLength: value } })
          }
        />
        <Checkbox
          label="Show Character Count"
          checked={questionData.config?.showCharCount}
          onChange={(event) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, showCharCount: event.target.checked } })
          }
          style={{ marginBlockEnd: '-25px' }}
        >
          Show Character Count
        </Checkbox>

        <NumberInput
          label="Max Word Length"
          value={questionData.config?.maxWordLength}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, maxWordLength: value } })
          }
        />
        <Checkbox
          label="Show Word Count"
          checked={questionData.config?.showWordCount}
          onChange={(event) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, showWordCount: event.target.checked } })
          }
          style={{ marginBlockEnd: '-25px' }}
        >
          Show Word Count
        </Checkbox>
      </Group>
    </Fieldset>
  );
}
