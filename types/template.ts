export type TemplateType =
  | 'blank'
  | 'event'
  | 'application'
  | 'survey';

export interface EmailTemplate {
  type: TemplateType;
  name: string;
  icon: string;
  subjectTemplate: string;
  bodyTemplate: string;
}