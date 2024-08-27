import { Button, Stack } from "@mantine/core";
import { useState } from 'react';

export default function SingleButtons({ currentQuestion }: { currentQuestion: any }) {
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

    const handleOptionClick = (index: number) => {
        setSelectedOptionIndex(index);
    };

    return (
        <Stack
            bg="var(--mantine-color-body)"
            align="stretch"
            justify="flex-start"
            gap="xs"
        >
            {currentQuestion.options?.map((option: any, index: number) => (
                <Button
                    key={index}
                    variant={selectedOptionIndex === index ? 'filled' : 'default'}
                    onClick={() => handleOptionClick(index)}
                >
                    {option.name}
                </Button>
            ))}
        </Stack>
    );
}