import { useEffect, useRef, useState } from "react";
import { Button, Flex, Group, MultiSelect, NumberInput, Paper, Select, TextInput } from "@mantine/core";
import { IconArrowNarrowRight, IconCopyPlus, IconX } from "@tabler/icons-react";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { LogicConditions, LogicActions, LogicOptions } from "@/app/lib/config/logic-config";
import { MultipleChoiceQuestionTypes, NumericQuestionTypes, QuestionTypesWithOptions, SingleChoiceQuestionTypes, TextQuestionTypes } from "@/app/lib/config/question-config";
import { Option, Question } from "@/app/lib/types";
import useEffectAfterMount from "@/app/lib/hooks/useEffectAfterMount";

export default function Logic({ logicData }: { logicData: any }) {
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
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(logicData?.ifQuestionId || null);
    const [selectedCondition, setSelectedCondition] = useState<string | null>(logicData?.condition || null);
    const [selectedAnswer, setSelectedAnswer] = useState<string[] | string | number | undefined>(logicData?.answer || undefined);
    const [selectedAction, setSelectedAction] = useState<string | null>(logicData?.action || null);
    const [selectedSetValue, setSelectedSetValue] = useState<string | number | string[] | null>(logicData?.setValue || null);
    const [selectedTargetQuestionId, setSelectedTargetQuestionId] = useState<string | null>(logicData?.targetQuestionId || null);
    const [selectedTargetQuestion, setSelectedTargetQuestion] = useState<Question | undefined>();

    const { questions, logic } = useQuestionnaireStore();
    const updateLogic = useQuestionnaireStore((state) => state.updateLogic);
    const removeLogic = useQuestionnaireStore((state) => state.removeLogic);

    const exclusiveOptions = LogicOptions.map((option) => option.value);

    useEffectAfterMount(() => {
        if (logicData.ifQuestionId) {
            const question = questions.find((q) => q.id.toString() === logicData.ifQuestionId);
            setSelectedQuestion(question as unknown as Question);
            setSelectedCondition(logicData.condition);
            setSelectedAnswer(logicData.answer);
            setSelectedAction(logicData.action);
            setSelectedTargetQuestionId(logicData.targetQuestionId);
            if (logicData.targetQuestionId) {
                const targetQuestion = questions.find((q) => q.id.toString() === logicData.targetQuestionId);
                setSelectedTargetQuestion(targetQuestion as unknown as Question);
                setSelectedSetValue(logicData.setValue);
            }
        }
    }, []);

    const recreateAnswerList = (question: any) => {
        let list = question.options?.map((option: Option) => ({ value: option.index.toString(), label: option.index + ' - ' + option.name }))
        return [
            { group: question.shortcut + ' Answers', items: [...list] },
            { group: 'Other', items: LogicOptions }
        ];
    }

    // TODO: implement this function to handle exclusive options(No Answer, Any Answer) in multi-select
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

    const handleAnswerChange = (value: string | number | string[]): void => {
        setSelectedAnswer(value);
        setSelectedAction(null);
        setSelectedTargetQuestionId(null);
        setSelectedTargetQuestion(undefined);
        setSelectedSetValue(null);

        updateLogic(logicData.index, { ...logicData, answer: value, action: '', targetQuestionId: '', setValue: '' });
    }

    const handleIfQuestionChange = (value: string | null): void => {
        const q = questions.find((question) => question.id.toString() === value);
        setInitialState();
        setSelectedQuestionId(value);
        setSelectedQuestion(q as unknown as Question);
        updateLogic(logicData.index, { ifQuestionId: value, condition: '', answer: '', action: '', targetQuestionId: '', setValue: '' });
    }

    const handleTargetQuestionChange = (value: string | null): void => {
        const q = questions.find((question) => question.id.toString() === value);
        if (MultipleChoiceQuestionTypes.includes(q?.questionType as string)) {
            setSelectedSetValue([]);
        } else {
            setSelectedSetValue(null);
        }
        setSelectedTargetQuestionId(value);
        setSelectedTargetQuestion(q as unknown as Question);
        updateLogic(logicData.index, { ...logicData, targetQuestionId: value, setValue: '' });
    }

    function setInitialState() {
        setSelectedCondition(null);
        setSelectedAnswer(undefined);
        setSelectedAction(null);
        setSelectedTargetQuestionId(null);
        setSelectedTargetQuestion(undefined);
        setSelectedSetValue(null);
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
                    value={selectedQuestionId}
                    ref={selectedQuestionIdRef}
                    onChange={(value) => { handleIfQuestionChange(value) }}
                    style={{ width: 150 }}
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
                            onChange={(value) => {
                                setSelectedAnswer(undefined);
                                setSelectedAction(null);
                                setSelectedTargetQuestionId(null);
                                setSelectedTargetQuestion(undefined);
                                setSelectedSetValue(null);
                                setSelectedCondition(value);

                                updateLogic(logicData.index, { ...logicData, condition: value, answer: '', action: '', targetQuestionId: '', setValue: '' });
                            }}
                            style={{ width: 150 }}
                        />

                        {selectedCondition && (
                            <>
                                <IconArrowNarrowRight color="black" />
                                {QuestionTypesWithOptions.includes(selectedQuestion.questionType) ? (
                                    <MultiSelect
                                        data={recreateAnswerList(selectedQuestion)}
                                        placeholder="Select"
                                        label="Answer"
                                        value={selectedAnswer as string[]}
                                        ref={selectedAnswerRef}
                                        onChange={(value) => handleAnswerChange(value)} />
                                ) : (
                                    NumericQuestionTypes.includes(selectedQuestion.questionType) ? (
                                        <NumberInput
                                            placeholder="Type value"
                                            label="Value"
                                            value={selectedAnswer as number}
                                            ref={selectedAnswerRef}
                                            onChange={() => {
                                                handleAnswerChange(selectedAnswerRef.current?.value as unknown as number);
                                            }}
                                            style={{ width: 150 }}
                                        />
                                    ) : (
                                        <TextInput
                                            placeholder="Type value"
                                            label="Value"
                                            value={selectedAnswer as string}
                                            ref={selectedAnswerRef}
                                            onChange={() => {
                                                handleAnswerChange(selectedAnswerRef.current?.value as unknown as string);
                                            }}
                                            style={{ width: 150 }}
                                        />
                                    )
                                )}
                                {selectedAnswer && (
                                    <>
                                        <IconArrowNarrowRight color="black" />
                                        <Select
                                            data={LogicActions}
                                            placeholder="Select"
                                            label="Action"
                                            value={selectedAction}
                                            ref={selectedActionRef}
                                            onChange={(value) => {
                                                setSelectedTargetQuestionId(null);
                                                setSelectedTargetQuestion(undefined);
                                                setSelectedSetValue(null);
                                                setSelectedAction(value);
                                                updateLogic(logicData.index, { ...logicData, action: value, targetQuestionId: '', setValue: '' });
                                            }}
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
                                                    onChange={(value) => { handleTargetQuestionChange(value) }}
                                                    style={{ width: 150 }}
                                                />
                                                {selectedTargetQuestion && selectedAction === 'set value' && (
                                                    <>
                                                        <IconArrowNarrowRight color="black" />
                                                        {NumericQuestionTypes.includes(selectedTargetQuestion?.questionType) && (
                                                            <NumberInput
                                                                placeholder="Type value to set"
                                                                label={`Set '${selectedTargetQuestion.shortcut}' Value`}
                                                                value={selectedSetValue as number}
                                                                ref={selectedSetValueRef}
                                                                onChange={() => {
                                                                    const value = selectedSetValueRef.current?.value;
                                                                    setSelectedSetValue(value as unknown as number);
                                                                    updateLogic(logicData.index, { ...logicData, setValue: value });
                                                                }}
                                                                style={{ width: 150 }}
                                                            />
                                                        )}
                                                        {TextQuestionTypes.includes(selectedTargetQuestion?.questionType) && (
                                                            <TextInput
                                                                placeholder="Type value to set"
                                                                label={`Set '${selectedTargetQuestion.shortcut}' Value`}
                                                                value={selectedSetValue as string}
                                                                ref={selectedSetValueRef}
                                                                onChange={() => {
                                                                    const value = selectedSetValueRef.current?.value;
                                                                    setSelectedSetValue(value as unknown as string);
                                                                    updateLogic(logicData.index, { ...logicData, setValue: value });
                                                                }} style={{ width: 150 }}
                                                            />
                                                        )}
                                                        {MultipleChoiceQuestionTypes.includes(selectedTargetQuestion?.questionType) && (
                                                            <MultiSelect
                                                                data={selectedTargetQuestion.options?.map((option: Option) => ({ value: option.index.toString(), label: option.index + ' - ' + option.name }))}
                                                                placeholder="Select"
                                                                label={`Set '${selectedTargetQuestion.shortcut}' Values`}
                                                                value={selectedSetValue as string[]}
                                                                ref={selectedSetValueMultiSelectRef}
                                                                onChange={(value) => {
                                                                    setSelectedSetValue(value);
                                                                    updateLogic(logicData.index, { ...logicData, setValue: value });
                                                                }} />
                                                        )}
                                                        {SingleChoiceQuestionTypes.includes(selectedTargetQuestion?.questionType) && (
                                                            <Select
                                                                data={selectedTargetQuestion.options?.map((option: Option) => ({ value: option.index.toString(), label: option.index + ' - ' + option.name }))}
                                                                placeholder="Select"
                                                                label={`Set '${selectedTargetQuestion.shortcut}' Value`}
                                                                value={selectedSetValue as string}
                                                                ref={selectedSetValueSingleSelectRef}
                                                                onChange={(value) => {
                                                                    setSelectedSetValue(value)
                                                                    updateLogic(logicData.index, { ...logicData, setValue: value });
                                                                }} />
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
