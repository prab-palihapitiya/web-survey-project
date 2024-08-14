// store.js (or any suitable name)
import {create} from 'zustand';

interface QuestionnaireState {
  name: string;
  questions: any[]; // Adjust the type based on your question data structure
}

interface QuestionnaireActions {
  setName: (name: string) => void;
  addQuestion: (question: any) => void;
  removeQuestion: (questionId: number | string) => void;
  updateQuestionData: (questionId: number | string, updatedData: any) => void;
  // Add more actions as needed
}

const useQuestionnaireStore = create<QuestionnaireState & QuestionnaireActions>()((set) => ({
  name: '',
  questions: [],
  setName: (name) => set({ name }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  removeQuestion: (questionId) => set((state) => ({ questions: state.questions.filter(q => q.id !== questionId) })),
  updateQuestionData: (questionId, updatedData) => set((state) => ({
    questions: state.questions.map(q => 
      q.id === questionId ? { ...q, ...updatedData } : q
    )
  })),
}));

export default useQuestionnaireStore;
