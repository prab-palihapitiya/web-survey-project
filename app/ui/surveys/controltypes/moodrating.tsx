import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Rating, rem } from "@mantine/core";
import {
    IconMoodSadFilled,
    IconMoodEmptyFilled,
    IconMoodNeutralFilled,
    IconMoodSmileFilled,
    IconMoodHappyFilled
} from '@tabler/icons-react';

const getIconStyle = (color?: string) => ({
    width: rem(40),
    height: rem(40),
    color: color ? `var(--mantine-color-${color}-7)` : 'var(--mantine-color-gray-4)',
});

const getEmptyIcon = (value: number) => {
    const iconStyle = getIconStyle();

    switch (value) {
        case 1:
            return <IconMoodSadFilled style={iconStyle} />;
        case 2:
            return <IconMoodEmptyFilled style={iconStyle} />;
        case 3:
            return <IconMoodNeutralFilled style={iconStyle} />;
        case 4:
            return <IconMoodSmileFilled style={iconStyle} />;
        case 5:
            return <IconMoodHappyFilled style={iconStyle} />;
        default:
            return null;
    }
};

const getFullIcon = (value: number) => {
    switch (value) {
        case 1:
            return <IconMoodSadFilled style={getIconStyle('red')} />;
        case 2:
            return <IconMoodEmptyFilled style={getIconStyle('orange')} />;
        case 3:
            return <IconMoodNeutralFilled style={getIconStyle('yellow')} />;
        case 4:
            return <IconMoodSmileFilled style={getIconStyle('lime')} />;
        case 5:
            return <IconMoodHappyFilled style={getIconStyle('green')} />;
        default:
            return null;
    }
};

export default function MoodRatingControl({ currentQuestion }: { currentQuestion: any }) {
    const setAnswer = useQuestionnaireStore(state => state.setAnswer);
    const answers = useQuestionnaireStore(state => state.answers);

    const getCurrentQuestionAnswerEntry = (questionId: string) => {
        const entry = answers.find(a => a.questionId === questionId);
        return entry || null;
    };

    const answerEntry = getCurrentQuestionAnswerEntry(currentQuestion.id.toString());

    return (
        <Rating
            emptySymbol={getEmptyIcon}
            fullSymbol={getFullIcon}
            highlightSelectedOnly
            value={answerEntry?.answer as number || currentQuestion.config?.initialValue || 0}
            onChange={(value) => setAnswer(currentQuestion.id.toString(), value, [])}
        />
    );
}