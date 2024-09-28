import { create } from "zustand";

interface TemplateActions {
    setTemplate: (template: any) => void;
    setTemplates: (templates: any) => void;
    // removeTemplate: (templateId: string) => void;
    // updateTemplate: (templateId: string, updatedTemplate: any) => void;
}

interface TemplateState {
    template: any;
    templates: any[];
}

export const useTemplateStore = create<TemplateState & TemplateActions>((set) => ({
    template: {},
    templates: [],
    setTemplate: (template) => set({ template }),
    setTemplates: (templates) => set({ templates }),
    // removeTemplate: (templateId) => {
    //     // Remove the template
    // },
    // updateTemplate: (templateId, updatedTemplate) => {
    //     // Update the template
    // }
}));

export default useTemplateStore;

