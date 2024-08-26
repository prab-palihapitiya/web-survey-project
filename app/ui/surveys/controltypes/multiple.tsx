import { Button, Stack } from "@mantine/core";

export default function Multiple({ currentQuestion }: { currentQuestion: any }) {
    return (
        <Stack
            bg="var(--mantine-color-body)"
            align="stretch"
            justify="flex-start"
            gap="xs"
        >
            {currentQuestion.options?.map((option: any[], index: number) => (
                <Button key={index} variant="default" styles={{ label: { textAlign: 'left' } }}>{option.name}</Button>
            ))}
        </Stack>
    );
}

