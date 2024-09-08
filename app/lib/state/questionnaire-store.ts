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
  addQuestion: (question: any, index: number) => void;
  removeQuestion: (questionId: number | string) => void;
  updateQuestionData: (questionId: number | string, updatedData: any) => void;
  setQuestionnaire: (questionnaire: any) => void;
  setAnswer: (questionId: string, answer: any) => void;
  addLogic: (logic: any) => void;
  removeLogic: (logicIndex: number) => void;
  updateLogic: (logicIndex: number, updatedLogic: any) => void;
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
  addQuestion: (question: Question, index: number) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      if (typeof index === 'number' && index >= 0 && index <= updatedQuestions.length) {
        updatedQuestions.splice(index, 0, question); // Insert before the given index
      } else {
        updatedQuestions.push(question); // Append if no valid index provided
      }
      return { questions: updatedQuestions };
    }),
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
  addLogic: (logic: any) => set((state) => ({
    logic: [...state.logic, logic]
  })),
  removeLogic: (logicIndex: number) => set((state) => ({
    logic: state.logic.filter((_, index) => index !== logicIndex)
  })),
  updateLogic: (logicIndex, updatedLogic) =>
    set((state) => ({
      logic: state.logic.map((l) =>
        l.index === logicIndex ? { ...l, ...updatedLogic } : l)
    }))
}));

export default useQuestionnaireStore;
