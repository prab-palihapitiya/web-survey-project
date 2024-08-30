import { log } from "console";
import { create } from "zustand";

interface Question {
  id: string;
  options?: { name: string; index: number; resource: any; exclusive: string; subQuestion: string }[];
  shortcut: string;
  skippable: boolean;
  introduction: string;
  questionType: string;
}

interface QuestionnaireState {
  id: string;
  name: string;
  questions: Question[];
  logic: any[]; //TODO: Adjust the type based on logic data structure
  answers: any[]; //TODO: Adjust the type based on question data structure
}

interface QuestionnaireActions {
  setId: (id: string) => void;
  setName: (name: string) => void;
  addQuestion: (question: any) => void;
  removeQuestion: (questionId: number | string) => void;
  updateQuestionData: (questionId: number | string, updatedData: any) => void;
  setQuestionnaire: (questionnaire: any) => void;
  setAnswer: (questionId: string, answer: any) => void;
}

const useQuestionnaireStore = create<
  QuestionnaireState & QuestionnaireActions
>()((set) => ({
  id: "",
  name: "",
  questions: [],
  logic: [],
  answers: [],
  questionnaire: {},
  setId: (id) => set({ id }),
  setName: (name) => set({ name }),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  removeQuestion: (questionId) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== questionId)
    })),
  updateQuestionData: (questionId, updatedData) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, ...updatedData } : q
      )
    })),
  setQuestionnaire: (questionnaire) =>
    set(() => ({
      name: questionnaire.name || "",
      questions: questionnaire.questions || [],
      logic: questionnaire.logic || [],
      answers: questionnaire.answers || []
    })),
  setAnswer: (questionId, answer) => {
    set((state) => {
      const existingAnswerIndex = state.answers.findIndex(a => a.questionId === questionId);
      if (existingAnswerIndex !== -1) {
        // Answer exists, update it
        const updatedAnswers = [...state.answers];
        updatedAnswers[existingAnswerIndex] = { questionId, answer };
        return { answers: updatedAnswers };
      } else {
        // Answer doesn't exist, add a new one
        return { answers: [...state.answers, { questionId, answer }] };
      }
    });
  },
  setLogic: (logic: any) => set({ logic })
}));

export default useQuestionnaireStore;
