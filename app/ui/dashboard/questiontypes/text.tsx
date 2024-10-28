import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { TextConfig } from "@/app/lib/types";
import { Checkbox, Divider, Grid, GridCol, Group, NumberInput, Space, TextInput } from "@mantine/core";

export default function Text(questionData: { id: string; config?: TextConfig }) {
  const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);

  return (
    <Grid>
      <GridCol span={4}>
        <TextInput
          label="Placeholder"
          value={questionData.config?.placeholder || ''}
          onChange={(event) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, placeholder: event.target.value as string } })
          } />
        <Space h="sm" />
        <Checkbox
          label="Show as a Text Area"
        // checked={questionData.config?.showCharCount}
        // onChange={(event) =>
        //   updateQuestionData(questionData.id, { config: { ...questionData.config, showCharCount: event.target.checked } })
        // }
        />
      </GridCol>
      <GridCol span={4}>
        <NumberInput
          label="Max Character Length"
          value={questionData.config?.maxCharLength}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, maxCharLength: value } })
          } />
        <Space h="sm" />
        <Checkbox
          label="Show Character Count"
          checked={questionData.config?.showCharCount}
          onChange={(event) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, showCharCount: event.target.checked } })
          } />
      </GridCol>
      <GridCol span={4}>
        <NumberInput
          label="Max Word Length"
          value={questionData.config?.maxWordLength}
          onChange={(value) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, maxWordLength: value } })
          } />
        <Space h="sm" />
        <Checkbox
          label="Show Word Count"
          checked={questionData.config?.showWordCount}
          onChange={(event) =>
            updateQuestionData(questionData.id, { config: { ...questionData.config, showWordCount: event.target.checked } })
          } >
          Show Word Count
        </Checkbox>
      </GridCol>
    </Grid>
  );
}
