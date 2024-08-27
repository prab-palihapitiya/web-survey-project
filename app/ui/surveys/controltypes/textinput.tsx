import { Input } from "@mantine/core";
import { useState } from "react";

export default function TextInput({ currentQuestion }: { currentQuestion: any }) {
    const [answer, setAnswer] = useState<string>('');

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(event.target.value);
    };

    return (
        <Input
            value={answer}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
        />
    );
}