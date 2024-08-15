"use client";

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { QuestionType } from "@/app/lib/types";
import Numeric from "@/app/ui/dashboard/questiontypes/numeric";
import Single from "@/app/ui/dashboard/questiontypes/single";
import Text from "@/app/ui/dashboard/questiontypes/text";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import {
  ActionIcon,
  Button,
  Checkbox,
  Collapse,
  Flex,
  Grid,
  GridCol,
  Group,
  Mark,
  Paper,
  Select,
  Space,
  Stack,
  TextInput,
  Textarea
} from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

import classes from "./questionnaire.module.css";

export default function Question({ questionData, onClose, highlight }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedQType, setSelectedQType] = useState<string | null>();
  const [isFocused, setFocused] = useState<boolean>(false);

  const questionRef = useRef<HTMLDivElement>(null);

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

    if (highlight && questionRef.current) {
      questionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      questionRef.current.focus();
    }
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
        ref={questionRef}
        className={clsx(
          isFocused ? classes.focused : highlight ? classes.highlight : "",
          classes.question_container
        )}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
      >
        <Flex
          justify={"space-between"}
          align={"center"}
        >
          <Group
            justify="flex-start"
            gap={"xs"}
          >
            <ActionIcon
              variant="subtle"
              onClick={handleCollapseToggle}
            >
              {isCollapsed ? (
                <IconChevronRight size={16} />
              ) : (
                <IconChevronDown size={16} />
              )}
            </ActionIcon>

            <TextInput
              variant="unstyled"
              defaultValue={isCollapsed ? shortcutRef.current?.value : ""}
              onChange={(e) => {
                // Update the shortcut input field when the unstyled input changes
                if (shortcutRef.current) {
                  shortcutRef.current.value = e.target.value;

                  updateQuestionData(questionData.id, {
                    shortcut: e.target.value
                  });
                }
              }}
            />
          </Group>
          <Group justify="flex-end">
            <Button
              variant="light"
              color="red"
              onClick={handleClose}
            >
              Close
            </Button>
          </Group>
        </Flex>

        <Collapse in={!isCollapsed}>
          <Grid>
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
                  ref={canSkipRef}
                />
              </Stack>
            </GridCol>
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
                ref={shortcutRef}
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
                ref={introductionRef}
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
