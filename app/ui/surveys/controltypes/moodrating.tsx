import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { Rating, rem } from "@mantine/core";
import {
    IconMoodSad,
    IconMoodEmpty,
    IconMoodNeutral,
    IconMoodSmile,
    IconMoodHappy,
    IconMoodSadFilled,
    IconMoodEmptyFilled,
    IconMoodNeutralFilled,
    IconMoodSmileFilled,
    IconMoodHappyFilled
} from '@tabler/icons-react';

const getIconStyle = (color?: string) => ({
    width: rem(36),
    height: rem(36),
    color: color ? `var(--mantine-color-${color}-7)` : undefined,
});

const getEmptyIcon = (value: number) => {
    const iconStyle = getIconStyle();

    switch (value) {
        case 1:
            return <IconMoodSad style={iconStyle} stroke={1} />;
        case 2:
            return <IconMoodEmpty style={iconStyle} stroke={1} />;
        case 3:
            return <IconMoodNeutral style={iconStyle} stroke={1} />;
        case 4:
            return <IconMoodSmile style={iconStyle} stroke={1} />;
        case 5:
            return <IconMoodHappy style={iconStyle} stroke={1} />;
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