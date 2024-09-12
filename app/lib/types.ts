import { IconUser } from "@tabler/icons-react";

export enum Navigate {
  Next = 'Next',
  Previous = 'Previous'
}

export enum Status {
  NEW = "NEW",
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}
export enum Actions {
  Show = "Show",
  Hide = "Hide",
  HideOptions = "Hide Options",
  SetValue = "Set Value",
  End = "End",
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
