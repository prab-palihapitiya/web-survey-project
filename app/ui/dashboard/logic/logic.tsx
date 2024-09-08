import { useRef, useState } from "react";
import { Button, Flex, Group, MultiSelect, NumberInput, Paper, Select, TextInput } from "@mantine/core";
import { IconArrowNarrowRight, IconCopyPlus, IconX } from "@tabler/icons-react";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { LogicConditions, LogicActions, LogicOptions } from "@/app/lib/config/logic-config";
import { MultipleChoiceQuestionTypes, NumericQuestionTypes, QuestionTypesWithOptions, SingleChoiceQuestionTypes, TextQuestionTypes } from "@/app/lib/config/question-config";
import { Option, Question } from "@/app/lib/types";

export default function Logic({ logicData }: { logicData: any }) {
    const { name, questions } = useQuestionnaireStore();

    const selectedQuestionIdRef = useRef<HTMLInputElement>(null);
    const selectedConditionRef = useRef<HTMLInputElement>(null);
    const selectedAnswerRef = useRef<HTMLInputElement>(null);
    const selectedValueRef = useRef<HTMLInputElement>(null);
    const selectedActionRef = useRef<HTMLInputElement>(null);
    const selectedSetValueRef = useRef<HTMLInputElement>(null);
    const selectedTargetQuestionIdRef = useRef<HTMLInputElement>(null);
    const selectedSetValueMultiSelectRef = useRef<HTMLInputElement>(null);
    const selectedSetValueSingleSelectRef = useRef<HTMLInputElement>(null);

    const [selectedQuestion, setSelectedQuestion] = useState<Question | undefined>();
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>();
    const [selectedCondition, setSelectedCondition] = useState<string | null>();
    const [selectedAnswer, setSelectedAnswer] = useState<string[] | undefined>();
    const [selectedValue, setSelectedValue] = useState<string | number>();
    const [selectedAction, setSelectedAction] = useState<string | null>();
    const [selectedSetValue, setSelectedSetValue] = useState<string | number | string[] | null>();
    const [selectedTargetQuestionId, setSelectedTargetQuestionId] = useState<string | null>();
    const [selectedTargetQuestion, setSelectedTargetQuestion] = useState<Question | undefined>();

    const updateLogic = useQuestionnaireStore((state) => state.updateLogic);
    const removeLogic = useQuestionnaireStore((state) => state.removeLogic);

    const exclusiveOptions = LogicOptions.map((option) => option.value);

    const getConditionalAnswerList = (question: any) => {
        let list = question.options.map((option: Option) => ({ value: option.index.toString(), label: option.index + ' - ' + option.name }))
        return [
            { group: question.shortcut + ' Answers', items: [...list] },
            { group: 'Other', items: LogicOptions }
        ];
    }

    function handleMultiSelectChange(value: string[]): void {
        if (!value.length) {
            setSelectedAnswer(undefined);
            return;
        }

        const selectedExclusive = value.find((val) => exclusiveOptions.includes(val));
        if (selectedExclusive) {
            setSelectedAnswer([selectedExclusive]);
        } else {
            const filteredAnswers = value.filter((val) => !exclusiveOptions.includes(val));
            setSelectedAnswer(filteredAnswers);
        }
    }

    return (
        <Paper
            shadow="lg"
            p={'xs'}
        >
            <Flex
                justify={"space-between"}
                align={"center"} >
                <Group
                    justify="flex-start"
                    gap={"xs"}
                >
                </Group>
                <Group justify="flex-end" gap={'xs'}>
                    <Button
                        size="xs"
                        variant="subtle"
                    >
                        <IconCopyPlus size={16} />
                    </Button>
                    <Button
                        size="xs"
                        color="red"
                        variant="subtle"
                    // onClick={handleClose}
                    >
                        <IconX size={16} />
                    </Button>
                </Group>
            </Flex>
            <Group>
                <Select
                    data={questions.map((question) => ({ value: question.id.toString(), label: question.shortcut }))}
                    placeholder="Select a question"
                    label="IF Question"
                    value={selectedQuestionId || logicData.ifQuestionId}
                    ref={selectedQuestionIdRef}
                    onChange={(value) => {
                        const q = questions.find((question) => question.id.toString() === value);
                        console.log(q);
                        setSelectedQuestionId(value);
                        setSelectedQuestion(q);
                        updateLogic(logicData.index, { ...logicData, ifQuestionId: value });
                    }}
                    style={{ width: 175 }}

                />
                {selectedQuestion && (
                    <>
                        <IconArrowNarrowRight color="black" />
                        <Select
                            data={LogicConditions}
                            placeholder="Select a condition"
                            label="Condition"
                            value={selectedCondition}
                            ref={selectedConditionRef}
                            onChange={(value) => setSelectedCondition(value)}
                            style={{ width: 150 }}
                        />

                        {selectedCondition && (
                            <>
                                <IconArrowNarrowRight color="black" />
                                {QuestionTypesWithOptions.includes(selectedQuestion.questionType) ? (
                                    <MultiSelect
                                        data={getConditionalAnswerList(selectedQuestion)}
                                        placeholder="Select"
                                        label="Answer"
                                        // value={selectedAnswer}
                                        ref={selectedAnswerRef}
                                        onChange={handleMultiSelectChange} />
                                ) : (
                                    NumericQuestionTypes.includes(selectedQuestion.questionType) ? (
                                        <NumberInput
                                            placeholder="Type value"
                                            label="Value"
                                            ref={selectedValueRef}
                                            onChange={(value) => setSelectedValue(value)}
                                            style={{ width: 150 }}
                                        />
                                    ) : (
                                        <TextInput
                                            placeholder="Type value"
                                            label="Value"
                                            ref={selectedValueRef}
                                            onChange={(value) => setSelectedValue(value as unknown as string)}
                                            style={{ width: 150 }}

                                        />
                                    )
                                )}
                                {(selectedAnswer || selectedValue) && (
                                    <>
                                        <IconArrowNarrowRight color="black" />
                                        <Select
                                            data={LogicActions}
                                            placeholder="Select"
                                            label="Action"
                                            value={selectedAction}
                                            ref={selectedActionRef}
                                            onChange={(value) => setSelectedAction(value)}
                                            style={{ width: 150 }}
                                        />
                                        {selectedAction && (
                                            <>
                                                <IconArrowNarrowRight color="black" />
                                                <Select
                                                    data={questions
                                                        .filter((question) => question.id.toString() !== selectedQuestionId)
                                                        .map((question) => ({ value: question.id.toString(), label: question.shortcut }))}
                                                    placeholder="Select a question"
                                                    label="Target Question"
                                                    value={selectedTargetQuestionId}
                                                    ref={selectedTargetQuestionIdRef}
                                                    onChange={(value) => {
                                                        const q = questions.find((question) => question.id.toString() === value);
                                                        setSelectedTargetQuestionId(value);
                                                        setSelectedTargetQuestion(q);
                                                    }}
                                                    style={{ width: 175 }}
                                                />
                                                {selectedTargetQuestion && selectedAction === 'set value' && (
                                                    <>
                                                        <IconArrowNarrowRight color="black" />
                                                        {NumericQuestionTypes.includes(selectedTargetQuestion?.questionType) && (
                                                            <NumberInput
                                                                placeholder="Type value to set"
                                                                label={`Set '${selectedTargetQuestion.shortcut}' Value`}
                                                                ref={selectedSetValueRef}
                                                                onChange={(value) => setSelectedSetValue(value)}
                                                                style={{ width: 150 }}
                                                            />
                                                        )}
                                                        {TextQuestionTypes.includes(selectedTargetQuestion?.questionType) && (
                                                            <TextInput
                                                                placeholder="Type value to set"
                                                                label={`Set '${selectedTargetQuestion.shortcut}' Value`}
                                                                ref={selectedSetValueRef}
                                                                onChange={(value) => setSelectedSetValue(value as unknown as string)}
                                                                style={{ width: 150 }}
                                                            />
                                                        )}
                                                        {MultipleChoiceQuestionTypes.includes(selectedTargetQuestion?.questionType) && (
                                                            <MultiSelect
                                                                data={selectedTargetQuestion.options?.map((option: Option) => ({ value: option.index.toString(), label: option.index + ' - ' + option.name }))}
                                                                placeholder="Select"
                                                                label={`Set '${selectedTargetQuestion.shortcut}' Values`}
                                                                // value={selectedAnswer}
                                                                ref={selectedSetValueMultiSelectRef}
                                                                onChange={(value) => setSelectedSetValue(value)} />
                                                        )}
                                                        {SingleChoiceQuestionTypes.includes(selectedTargetQuestion?.questionType) && (
                                                            <Select
                                                                data={selectedTargetQuestion.options?.map((option: Option) => ({ value: option.index.toString(), label: option.index + ' - ' + option.name }))}
                                                                placeholder="Select"
                                                                label={`Set '${selectedTargetQuestion.shortcut}' Value`}
                                                                // value={selectedAnswer}
                                                                ref={selectedSetValueSingleSelectRef}
                                                                onChange={(value) => setSelectedSetValue(value)} />
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </Group>
        </Paper>
    )
}