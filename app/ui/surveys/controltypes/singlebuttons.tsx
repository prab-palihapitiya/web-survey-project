import { Option } from "@/app/lib/types";
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
            {currentQuestion.options?.map((option: Option) => (
                <Button
                    key={option.index}
                    variant={selectedOptionIndex === parseInt(option.index) ? 'filled' : 'default'}
                    onClick={() => handleOptionClick(parseInt(option.index))}
                >
                    {option.name}
                </Button>
            ))}
        </Stack>
    );
}