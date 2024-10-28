import { IconUser } from "@tabler/icons-react";
import { translations } from "@/app/lib/translations/default";

export enum Navigate {
  Next = 'Next',
  Previous = 'Previous'
}
export enum Status {
  NEW = "NEW",
  DRAFT = "DRAFT",
  PUBLISHED = "ACTIVE",
  EXPIRED = "INACTIVE",
}
export enum Actions {
  Show = "Show",
  Hide = "Hide",
  HideOptions = "Hide options",
  SetValue = "Set value",
  Goto = "Goto",
}
export enum Conditions {
  Has = "Has",
  Contains = "Contains"
}
export interface Questionnaire {
  id: string;
  name: string;
  status: Status;
  createdAt: Date;
  modifiedAt: Date;
}
export enum exclusive {
  Yes = "Yes",
  No = "No",
}
export interface TextConfig {
  placeholder?: string;
  maxCharLength?: number;
  showCharCount?: boolean;
  maxWordLength?: number;
  showWordCount?: boolean;
}
export interface NumericConfig {
  min: number;
  max: number;
  step: number;
  decimalPlaces: number;
}
export interface MultipleConfig {
  min: number;
  max: number;
}
export interface Option {
  index: string;
  name: string;
  resource?: string;
  exclusive?: exclusive;
  subQuestion?: string;
}
export interface Question {
  id: number;
  shortcut: string;
  introduction: string;
  questionType: string;
  options?: Option[];
  skippable: boolean;
  config?: any;
}
export interface SubQuestionAnswer {
  index: string;
  value: string;
}
export interface Answer {
  questionId: string;
  answer: string | string[] | number;
  subQuestionAnswers?: SubQuestionAnswer[];
}
export interface Logic {
  index: number;
  ifQuestionId: string;
  condition: string;
  answer: string;
  action: string;
  targetQuestionId: string;
  setValue: string;
}
export interface NavbarLinkProps {
  icon: typeof IconUser;
  label: string;
  active?: boolean;
  navigate?: string;
  onClick?(): void;
}

export type ErrorKey = keyof typeof translations.survey.error;

