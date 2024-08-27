import Text from "@/app/ui/dashboard/questiontypes/text";
import Numeric from "@/app/ui/dashboard/questiontypes/numeric";
import Single from "@/app/ui/dashboard/questiontypes/single";
import SingleList from "@/app/ui/surveys/controltypes/singlelist";
import Multiple from "@/app/ui/surveys/controltypes/multiple";
import TextInput from "@/app/ui/surveys/controltypes/textinput";
import NumericInput from "@/app/ui/surveys/controltypes/numericinput";

export const QuestionControls = [
  { group: 'Text', items: ["Text Input"] },
  { group: 'Numeric', items: ["Numeric Input"] },
  { group: 'Single Choice', items: ["Single Choice List"] },
  { group: 'Multiple Choice', items: ["Multiple Choice List"] }
];

export const QuestionTypeMappings: Record<string, { Component: React.ComponentType, Control: React.ComponentType }> = {
  "Text Input": {
    Component: Text,
    Control: TextInput
  },
  "Numeric Input": {
    Component: Numeric,
    Control: NumericInput
  },
  "Single Choice List": {
    Component: Single,
    Control: SingleList
  },
  "Multiple Choice List": {
    Component: Text,
    Control: Multiple
  }
};