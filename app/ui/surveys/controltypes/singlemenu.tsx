import { Button, Menu, MenuItem, Stack } from "@mantine/core";

export default function SingleMenu({ currentQuestion, onOptionSelect }: { currentQuestion: any, onOptionSelect: (option: any) => void }) {
    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Button variant="default">Select an option</Button>
            </Menu.Target>

            <Menu.Dropdown>
                {currentQuestion.options?.map((option: any[], index: number) => (
                    <MenuItem key={index} onClick={() => onOptionSelect(option)}>{option.name}</MenuItem>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}