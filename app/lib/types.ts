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

export interface NavbarLinkProps {
  icon: typeof IconUser;
  label: string;
  active?: boolean;
  navigate?: string;
  onClick?(): void;
}
