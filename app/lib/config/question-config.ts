import Text from "@/app/ui/dashboard/questiontypes/text";
import Numeric from "@/app/ui/dashboard/questiontypes/numeric";
import Single from "@/app/ui/dashboard/questiontypes/single";
import Multiple from "@/app/ui/dashboard/questiontypes/multiple";

import SingleListControl from "@/app/ui/surveys/controltypes/singlelist";
import TextInputControl from "@/app/ui/surveys/controltypes/textinput";
import NumericInputControl from "@/app/ui/surveys/controltypes/numericinput";
import MultipleListControl from "@/app/ui/surveys/controltypes/multiplelist";
import SingleButtons from "@/app/ui/surveys/controltypes/singlebuttons";
import SingleMenu from "@/app/ui/surveys/controltypes/singlemenu";
import NumericSlider from "@/app/ui/dashboard/questiontypes/numericslider";
import NumericSliderControl from "@/app/ui/surveys/controltypes/numericslider";
import OptionSlider from "@/app/ui/dashboard/questiontypes/optionslider";
import OptionSliderControl from "@/app/ui/surveys/controltypes/optionslider";
import StarRating from "@/app/ui/dashboard/questiontypes/starrating";
import StarRatingControl from "@/app/ui/surveys/controltypes/starrating";
import MoodRating from "@/app/ui/dashboard/questiontypes/moodrating";
import MoodRatingControl from "@/app/ui/surveys/controltypes/moodrating";
import NetPromoterScore from "@/app/ui/dashboard/questiontypes/netpromoter";
import NetPromoterScoreControl from "@/app/ui/surveys/controltypes/netpromoter";

export const QuestionControls = [
    {
        group: 'Text', items: [
            { value: "Text Input", disabled: false },
            { value: "Text Area", disabled: false },
            { value: "Text Page", disabled: true }]
    },
    {
        group: 'Numeric', items: [
            { value: "Numeric Input", disabled: false },
            { value: "Numeric Slider", disabled: false },
            { value: "Star Rating", disabled: false },
            { value: "Mood Rating", disabled: false },
            { value: "Net Promoter Score", disabled: false }
        ]
    },
    {
        group: 'Single Choice', items: [
            { value: "Single Choice List", disabled: false },
            { value: "Single Choice Buttons", disabled: false },
            { value: "Dropdown Menu", disabled: false },
            { value: "Options Silder", disabled: false }
        ]
    },
    {
        group: 'Multiple Choice', items: [
            { value: "Multiple Choice List", disabled: false }
        ]
    }
];

export const QuestionTypeMappings: Record<string, { Component: React.ComponentType, Control: React.ComponentType }> = {
    "Text Input": {
        Component: Text,
        Control: TextInputControl
    },
    "Text Area": {
        Component: Text,
        Control: TextInputControl
    },
    "Numeric Input": {
        Component: Numeric,
        Control: NumericInputControl
    },
    "Single Choice List": {
        Component: Single,
        Control: SingleListControl
    },
    "Multiple Choice List": {
        Component: Multiple,
        Control: MultipleListControl
    },
    "Single Choice Buttons": {
        Component: Single,
        Control: SingleButtons
    },
    "Dropdown Menu": {
        Component: Single,
        Control: SingleMenu
    },
    "Numeric Slider": {
        Component: NumericSlider,
        Control: NumericSliderControl
    },
    "Options Silder": {
        Component: OptionSlider,
        Control: OptionSliderControl
    },
    "Star Rating": {
        Component: StarRating,
        Control: StarRatingControl
    },
    "Mood Rating": {
        Component: MoodRating,
        Control: MoodRatingControl
    },
    "Net Promoter Score": {
        Component: NetPromoterScore,
        Control: NetPromoterScoreControl
    }
};

export const QuestionTypesWithOptions = ["Single Choice List", "Multiple Choice List", "Single Choice Buttons", "Dropdown Menu", "Options Silder"];

export const SingleChoiceQuestionTypes = ["Single Choice List", "Single Choice Buttons", "Dropdown Menu", "Options Silder"];

export const MultipleChoiceQuestionTypes = ["Multiple Choice List"];

export const NumericQuestionTypes = ["Numeric Input", "Numeric Slider", "Star Rating", "Mood Rating", "Net Promoter Score"];

export const TextQuestionTypes = ["Text Input", "Text Area"];