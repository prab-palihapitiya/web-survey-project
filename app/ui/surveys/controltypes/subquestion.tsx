import { TextInput } from "@mantine/core";
import { useState } from "react";

export default function SubQuestionInput() {
    const [answer, setAnswer] = useState<string>('');

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(event.target.value);
    };

    return (
        <TextInput
            value={answer}
            onChange={(event) => handleAnswerChange(event)}
            placeholder="Specify your answer here..."
        />
    )
};