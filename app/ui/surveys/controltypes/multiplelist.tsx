import { Checkbox, Stack, CheckboxGroup } from "@mantine/core";
import { useState } from 'react';

export default function MultipleList({ currentQuestion }: { currentQuestion: any }) {
    const [selectedOptionValues, setSelectedOptionValues] = useState<string[]>([]);

    const handleOptionChange = (value: string[]) => {
        setSelectedOptionValues(value);
    };

    return (
        <CheckboxGroup
            value={selectedOptionValues}
            onChange={handleOptionChange}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="flex-start"
                gap="xs"
            >
                {currentQuestion.options?.map((option: any, index: number) => (
                    <Checkbox
                        key={index}
                        value={index.toString()}
                        label={option.name}
                        styles={{ label: { textAlign: 'left', cursor: 'pointer' } }}
                    />
                ))}
            </Stack>
        </CheckboxGroup>
    );
}