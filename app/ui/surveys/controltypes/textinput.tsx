import { Textarea, TextInput } from "@mantine/core";
import { useState } from "react";

export default function TextInputControl({ currentQuestion }: { currentQuestion: any }) {
    const [answer, setAnswer] = useState<string>('');

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(event.target.value);
    };

    return (
        currentQuestion.questionType === "Text Input" ? (
            <TextInput
                value={answer}
                onChange={(event) => handleAnswerChange(event)}
                placeholder="Type your answer here..."
            />
        ) : (
            <Textarea
                value={answer}
                onChange={(event) => handleAnswerChange(event)}
                placeholder="Type your answer here..."
            ></Textarea>
        ))
};