import { create } from "zustand";

interface TemplateActions {
    setTemplate: (template: any) => void;
    setTemplates: (templates: any) => void;
    setTemplateForm: (templateForm: FormData) => void;
    // removeTemplate: (templateId: string) => void;
    // updateTemplate: (templateId: string, updatedTemplate: any) => void;
}

interface TemplateState {
    template: any;
    templates: any[];
    templateForm: FormData;
}

export const useTemplateStore = create<TemplateState & TemplateActions>((set) => ({
    template: {},
    templates: [],
    templateForm: new FormData(),
    setTemplate: (template) => set({ template }),
    setTemplates: (templates) => set({ templates }),
    setTemplateForm: (templateForm) => set({ templateForm })
    // removeTemplate: (templateId) => {
    //     // Remove the template
    // },
    // updateTemplate: (templateId, updatedTemplate) => {
    //     // Update the template
    // }
}));

export default useTemplateStore;

