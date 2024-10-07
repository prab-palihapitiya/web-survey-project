import { ProgressType } from "@/app/surveys/utils/types";

export interface TemplateObject {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    defaultRadius: string;
    defaultVariant: string;
    defaultSize: string;
    primaryColor: string;
    secondaryColor: string;

    errorColor: string,
    errorVariant: string,

    bannerPrimaryColor: string;
    bannerSecondaryColor: string;
    bannerShowGradient: boolean;
    bannerGradientDirection: string;

    logoFilePath: string;
    logoFileName: string;
    logoSrc: string;
    logoAltText: string;
    logoTitle: string;
    logoUrl: string;
    logoSize: string;
    logoRadius: string;

    progressStyle: string;
    progressColor: string;
    progressLabelColor: string;
    progressRadius: string;
    progressSize: string;
    progressBarLength: number;
    progressAnimated: boolean;
    progressCircleSize: number;
    progressCircleThickness: number;
    progressEmptySegmentColor: string;

    navFlexDirection: string;
    navArrows: boolean;
    navBottomFixed: boolean;
    prevButtonShow: boolean;
    prevButtonText: string;
    prevButtonVariant: string;
    prevButtonColor: string;
    prevButtonSize: string;
    prevButtonRadius: string;
    nextButtonText: string;
    nextButtonVariant: string;
    nextButtonColor: string;
    nextButtonSize: string;
    nextButtonRadius: string;
}
export interface ProgressProps {
    type: ProgressType;
    color: string;
    labelColor: string;
    radius: string;
    size: string;
    barLength: number;
    animated: boolean;
    circleSize: number;
    circleThickness: number;
    emptySegmentColor: string;
}

export type Template = {
    templateName: string,
    obj: TemplateObject
};

export type DefaultTemplate = {
    id: string,
    templateName: string,
    obj: TemplateObject,
};

export const DefaultTemplateData = {
    templateName: 'Untitled Template',
    obj: {
        fontFamily: 'Arial',
        fontSize: 'sm',
        fontWeight: 'normal',
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
        prevButtonText: 'Previous',
        nextButtonText: 'Next',
        prevButtonShow: true,
    } as TemplateObject
};