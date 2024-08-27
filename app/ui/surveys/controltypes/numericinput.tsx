import { NumberInput } from "@mantine/core";
import { useState } from "react";

export default function NumericInput({ currentQuestion }: { currentQuestion: any }) {
    const [answer, setAnswer] = useState<string | number>('');

    // const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setAnswer(event.target.value);
    // };

    return (
        <NumberInput
            value={answer}
            onChange={setAnswer}
            placeholder="Type your answer here..."
        />
    );
}