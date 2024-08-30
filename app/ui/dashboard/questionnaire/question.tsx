"use client";

import React, { useEffect, useRef, useState } from "react";
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
  Stack,
  TextInput,
  Textarea,
  Tooltip
} from "@mantine/core";
import { IconChevronDown, IconChevronRight, IconQuestionMark } from "@tabler/icons-react";

import classes from "./questionnaire.module.css";

export default function Question({ questionData, highlight, onClose }: { questionData: any; highlight: boolean; onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedQType, setSelectedQType] = useState<string | null>();
  const [isFocused, setFocused] = useState<boolean>(false);

  const questionRef = useRef<HTMLDivElement>(null);
  const questionTypeRef = useRef<HTMLInputElement>(null);
  const skippableRef = useRef<HTMLInputElement>(null);
  const shortcutRef = useRef<HTMLInputElement>(null);
  const introductionRef = useRef<HTMLTextAreaElement>(null);

  const updateQuestionData = useQuestionnaireStore(
    (state) => state.updateQuestionData
  );
  const removeQuestion = useQuestionnaireStore((state) => state.removeQuestion);

  useEffect(() => {
    setSelectedQType(questionData.questionType);
  }, [questionData.questionType]);

  useEffect(() => {
    const updatedQuestionData = {
      questionType: questionTypeRef.current?.value || "",
      skippable: skippableRef.current?.checked || false,
      shortcut: shortcutRef.current?.value || "",
      introduction: introductionRef.current?.value || ""
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

  const { Component: QuestionComponent } = QuestionTypeMappings[selectedQType] || {};

  return (
    isOpen && (<>
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
              variant="outline"
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
                />
              </Group>
            )}
          </Group>
          <Group justify="flex-end">
            <Button
              size="xs"
              color="red"
              onClick={handleClose}
            >
              Close
            </Button>
          </Group>
        </Flex>
        <Collapse in={!isCollapsed}>
          <Space h="xs"></Space>
          <Grid>
            <GridCol span={3}>
              <Select
                label="Question Type"
                placeholder="Select"
                data={QuestionControls}
                value={questionData.questionType}
                onChange={(value) => handleTypeChange(value)}
                ref={questionTypeRef}
                style={{ paddingBottom: "0" }}
              />
            </GridCol>
            <GridCol span={5}>
              <TextInput
                label="Shortcut"
                placeholder="Give a name"
                value={questionData.shortcut}
                onChange={(event) => {
                  updateQuestionData(questionData.id, {
                    shortcut: event.currentTarget.value
                  });
                }}
                ref={shortcutRef}
                rightSection={
                  <Tooltip
                    multiline
                    w={250}
                    withArrow
                    transitionProps={{ duration: 200 }}
                    color="gray"
                    label="You will use this name when defining question logic. Use CamelCase(e.x. MyQuestion1) or use the generated question shortcut."
                  >
                    <ActionIcon variant="transparent">
                      <IconQuestionMark size={16} />
                    </ActionIcon>
                  </Tooltip>
                }
              />
            </GridCol>
            <GridCol span={3} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Checkbox
                label="Respondent can skip the question"
                checked={questionData.skippable}
                onChange={(event) => {
                  updateQuestionData(questionData.id, {
                    skippable: event.currentTarget.checked
                  });
                }}
                ref={skippableRef}
              />
            </GridCol>

            <GridCol>
              <Textarea
                label="Introduction"
                placeholder="Type question here.."
                autosize
                minRows={2}
                value={questionData.introduction}
                onChange={(event) => {
                  updateQuestionData(questionData.id, {
                    introduction: event.currentTarget.value
                  });
                }}
                ref={introductionRef}
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
