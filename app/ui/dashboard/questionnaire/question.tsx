"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { QuestionControls, QuestionTypeMappings } from "@/app/lib/config/question-config";
import clsx from "clsx";
import {
  ActionIcon,
  Button,
  Checkbox,
  Collapse,
  Flex,
  Grid,
  GridCol,
  Group,
  Paper,
  Select,
  Space,
  TextInput,
  Tooltip
} from "@mantine/core";
import { IconChevronDown, IconChevronRight, IconClipboard, IconCopy, IconQuestionMark, IconTrash, IconX } from "@tabler/icons-react";
import classes from "./questionnaire.module.css";
import TextEditor from "./texteditor";

export default function Question({ questionData, highlight, onClose }: { questionData: any; highlight: boolean; onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedQType, setSelectedQType] = useState<string | null>();
  const [isFocused, setFocused] = useState<boolean>(false);

  const questionRef = useRef<HTMLDivElement>(null);
  const questionTypeRef = useRef<HTMLInputElement>(null);
  const skippableRef = useRef<HTMLInputElement>(null);
  const shortcutRef = useRef<HTMLInputElement>(null);

  const updateQuestionData = useQuestionnaireStore((state) => state.updateQuestionData);
  const removeQuestion = useQuestionnaireStore((state) => state.removeQuestion);

  const formControlValues = useMemo(() => ({
    questionType: questionData.questionType,
    skippable: questionData.skippable,
    shortcut: questionData.shortcut,
  }), [questionData]);

  useEffect(() => {
    setSelectedQType(formControlValues.questionType);
  }, [formControlValues.questionType]);

  useEffect(() => {
    const updatedQuestionData = {
      questionType: questionTypeRef.current?.value || "",
      skippable: skippableRef.current?.checked || false,
      shortcut: shortcutRef.current?.value || "",
    };

    updateQuestionData(questionData.id, updatedQuestionData);

    if (highlight && questionRef.current) {
      questionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      questionRef.current.focus();
    }
  }, [highlight, questionData.id, updateQuestionData]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
      removeQuestion(questionData.id);
    }
  };

  const handleTypeChange = (value: string | null) => {
    setSelectedQType(value);
    updateQuestionData(questionData.id, { questionType: value });
  };

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const { Component: QuestionComponent } = selectedQType && QuestionTypeMappings[selectedQType] || {};

  function copyToClipboard(questionData: any) {
    const copyText = JSON.stringify(questionData, null, 2);
    navigator.clipboard.writeText(copyText).then(
      function () {
        console.log("Copied to clipboard", copyText);
      },
      function (err) {
        console.error("Failed to copy to clipboard", err);
      });
  }

  return (
    isOpen && (
      <>
        <Paper
          shadow="lg"
          p={0}
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
            className={classes.question_header}
          >
            <Group
              justify="flex-start"
              gap={0}
            >
              <ActionIcon
                color="white"
                variant="subtle"
                onClick={handleCollapseToggle}

              >
                {isCollapsed ? (
                  <IconChevronRight size={16} />
                ) : (
                  <IconChevronDown size={16} />
                )}
              </ActionIcon>

              {isCollapsed && (
                <Group>
                  <TextInput
                    variant="unstyled"
                    defaultValue={shortcutRef.current?.value}
                    onChange={(e) => {
                      if (shortcutRef.current) {
                        shortcutRef.current.value = e.target.value;

                        updateQuestionData(questionData.id, {
                          shortcut: e.target.value
                        });
                      }
                    }}
                    styles={{
                      input: {
                        color: 'white',
                        fontWeight: 'bold',
                      },
                    }}
                  />
                </Group>
              )}
            </Group>
            <Group justify="flex-end" gap={0}>
              <Button
                size="xs"
                color="white"
                variant="subtle"
                onClick={() => {
                  copyToClipboard(questionData);
                }}
              >
                <IconCopy size={16} />
              </Button>
              <Button
                size="xs"
                color="white"
                variant="subtle"
                onClick={() => {
                  navigator.clipboard.readText().then(
                    (text) => {
                      const pastedData = JSON.parse(text);
                      pastedData.id = questionData.id;
                      pastedData.shortcut = questionData.shortcut;
                      updateQuestionData(questionData.id, pastedData);
                    },
                    (err) => {
                      console.error("Failed to read from clipboard", err);
                    }
                  );
                }}
              >
                <IconClipboard size={16} />
              </Button>
              <Button
                size="xs"
                color="white"
                variant="subtle"
                onClick={handleClose}
              >
                <IconTrash size={16} />
              </Button>
            </Group>
          </Flex>
          <Collapse in={!isCollapsed}>
            <Space h="xs"></Space>
            <Grid p={'xs'}>
              <GridCol span={3}>
                <Select
                  label="Question Type"
                  placeholder="Select"
                  data={QuestionControls}
                  value={formControlValues.questionType}
                  onChange={(value) => handleTypeChange(value)}
                  ref={questionTypeRef}
                />
              </GridCol>
              <GridCol span={5}>
                <TextInput
                  label="Shortcut"
                  placeholder="Give a name"
                  value={formControlValues.shortcut}
                  onChange={(event) => {
                    updateQuestionData(questionData.id, {
                      shortcut: event.currentTarget.value
                    });
                  }}
                  ref={shortcutRef}
                  rightSection={
                    <Tooltip
                      multiline
                      w={350}
                      withArrow
                      transitionProps={{ duration: 200 }}
                      style={{ fontSize: 12, backgroundColor: "#228be6" }}
                      label="You will use this name when defining question logic. Use CamelCase(e.x. MyQuestion1) or use the generated question shortcut."
                    >
                      <ActionIcon variant="light">
                        <IconQuestionMark size={14} />
                      </ActionIcon>
                    </Tooltip>
                  }
                />
              </GridCol>
              <GridCol span={3}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <Checkbox
                  label="Respondent can skip the question"
                  checked={formControlValues.skippable}
                  onChange={(event) => {
                    updateQuestionData(questionData.id, {
                      skippable: event.currentTarget.checked
                    });
                  }}
                  ref={skippableRef}
                  style={{ marginBlockEnd: '-25px' }}
                />
              </GridCol>
              <GridCol>
                <TextEditor
                  qid={questionData.id}
                  intro={questionData.introduction}
                  placeholderText="Your question intro here"
                />
              </GridCol>
              <GridCol>
                {selectedQType && <QuestionComponent {...questionData} />}
              </GridCol>
            </Grid>
          </Collapse>
        </Paper>
        <Space h="xs"></Space>
      </>)
  );
}
