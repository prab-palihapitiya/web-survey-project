import { Radio, Stack } from "@mantine/core";
import { useState } from 'react';

export default function SingleList({ currentQuestion }: { currentQuestion: any }) {
    const [selectedOptionValue, setSelectedOptionValue] = useState<string | null>(null);

    const handleOptionChange = (value: string) => {
        setSelectedOptionValue(value);
    };

    return (
        <Radio.Group
            value={selectedOptionValue}
            onChange={handleOptionChange}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="flex-start"
                gap="xs"
            >
                {currentQuestion.options?.map((option: any, index: number) => (
                    <Radio
                        key={index}
                        value={index.toString()}
                        label={option.name}
                        styles={{ label: { textAlign: 'left', cursor: 'pointer' } }}
                    />
                ))}
            </Stack>
        </Radio.Group>
    );
}