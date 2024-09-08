import { IconUser } from "@tabler/icons-react";

export enum Status {
  NEW = "NEW",
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
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

export interface NavbarLinkProps {
  icon: typeof IconUser;
  label: string;
  active?: boolean;
  navigate?: string;
  onClick?(): void;
}
