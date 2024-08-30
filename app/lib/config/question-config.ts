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

export const QuestionControls = [
    { group: 'Text', items: [{ value: "Text Input", disabled: false }, { value: "Text Area", disabled: false }, { value: "Text Page", disabled: true }] },
    { group: 'Numeric', items: [{ value: "Numeric Input", disabled: false }] },
    { group: 'Single Choice', items: [{ value: "Single Choice List", disabled: false }, { value: "Single Choice Buttons", disabled: false }, { value: "Dropdown Menu", disabled: false }] },
    { group: 'Multiple Choice', items: [{ value: "Multiple Choice List", disabled: false }] }
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
    }
};