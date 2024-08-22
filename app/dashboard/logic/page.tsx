'use client';

import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Container } from "@mantine/core"

export default function Page() {
    // const questionnaireId = useQuestionnaireStore((state) => state.id);
    // const questionnaireName = useQuestionnaireStore((state) => state.name);

    // useEffect(() => {
    //     console.log(questionnaireId + " " + questionnaireName);
    // }, [questionnaireId, questionnaireName]);

    return (
        <Container>
            <h1>Logic</h1>
            <p>Logic page</p>
        </Container>
    );
}