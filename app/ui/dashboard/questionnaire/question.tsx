"use client";

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { QuestionType } from "@/app/lib/types";
import Numeric from "@/app/ui/dashboard/questiontypes/numeric";
import Single from "@/app/ui/dashboard/questiontypes/single";
import Text from "@/app/ui/dashboard/questiontypes/text";
import { useEffect, useRef, useState } from "react";

import {
  Button,
  Checkbox,
  CloseButton,
  Collapse,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  Select,
  Space,
  Stack,
  TextInput,
  Textarea
} from "@mantine/core";

import classes from "./questionnaire.module.css";

export default function Question({ questionData, onClose }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedQType, setSelectedQType] = useState<string | null>();

  const questionTypeRef = useRef<HTMLSelectElement>(null);
  const canSkipRef = useRef<HTMLInputElement>(null);
  const shortcutRef = useRef<HTMLInputElement>(null);
  const introductionRef = useRef<HTMLTextAreaElement>(null);

  const updateQuestionData = useQuestionnaireStore(
    (state) => state.updateQuestionData
  );
  const removeQuestion = useQuestionnaireStore((state) => state.removeQuestion);

  useEffect(() => {
    const modifiedData = {
      questionType: questionTypeRef.current?.value || "",
      canSkip: canSkipRef.current?.checked || false,
      shortcut: shortcutRef.current?.value || "",
      introduction: introductionRef.current?.value || ""
    };
    updateQuestionData(questionData.id, modifiedData);
  }, []);

  if (!isOpen) {
    return null; // Don't render anything if closed
  }

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
      removeQuestion(questionData.id);
    }
  };

  const handleTypeChange = (value: QuestionType | null) => {
    setSelectedQType(value);
    updateQuestionData(questionData.id, { questionType: value });
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const typeToComponent: { [key in QuestionType]?: React.ComponentType } = {
    "Text": Text,
    "Numeric": Numeric,
    "Single Choice": Single,
    "Multiple Choice": Text,
    "Date Time": Text,
    "Ranking": Text
  };

  const QuestionComponent = selectedQType
    ? typeToComponent[selectedQType]
    : null;

  return (
    <>
      <Paper
        shadow="sm"
        p="sm"
        withBorder={true}
      >
        <Group justify="flex-end">
          <Button onClick={handleCollapseToggle}>
            {isCollapsed ? "Expand" : "Collapse"}
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={handleClose}
          >
            Close
          </Button>
        </Group>

        <Collapse in={!isCollapsed}>
          <Grid className={classes.question_container}>
            <GridCol span={6}>
              <Stack>
                <Select
                  label="Question Type"
                  placeholder="Select"
                  data={[
                    "Text",
                    "Numeric",
                    "Single Choice",
                    "Multiple Choice",
                    "Date Time",
                    "Ranking"
                  ]}
                  onChange={(_value) => handleTypeChange(_value)}
                />

                <Checkbox
                  label="Respondent can skip the question"
                  onChange={(event) => {
                    updateQuestionData(questionData.id, {
                      canSkip: event.currentTarget.checked
                    });
                  }}
                />
              </Stack>
            </GridCol>
            {/* <GridCol span={1} offset={5}>
                    </GridCol> */}
            <GridCol>
              <TextInput
                label="Shortcut"
                description="You will use this name when defining question logic. Use CamelCase(e.x. MyQuestion1) or use the generated question shortcut."
                placeholder="Give a name"
                defaultValue={questionData.shortcut}
                onChange={(event) => {
                  updateQuestionData(questionData.id, {
                    shortcut: event.currentTarget.value
                  });
                }}
              />
            </GridCol>
            <GridCol>
              <Textarea
                label="Introduction"
                placeholder="Type question here.."
                autosize
                minRows={2}
                onChange={(event) => {
                  updateQuestionData(questionData.id, {
                    introduction: event.currentTarget.value
                  });
                }}
              />
            </GridCol>
            <GridCol>{selectedQType && <QuestionComponent />}</GridCol>
          </Grid>
        </Collapse>
      </Paper>
      <Space h="xs"></Space>
    </>
  );
}
