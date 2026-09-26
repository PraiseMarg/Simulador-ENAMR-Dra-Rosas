import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExamState {
  user: { name: string; email: string } | null;
  attemptId: string | null;
  currentBlock: 1 | 2;
  answers: Record<string, number>; // questionId -> optionIndex
  flagged: Record<string, boolean>; // questionId -> boolean
  timeLeft: number; // in seconds
  examFinished: boolean;
  setUser: (user: { name: string; email: string }) => void;
  setAttemptId: (id: string) => void;
  setAnswer: (qId: string, optIdx: number) => void;
  toggleFlag: (qId: string) => void;
  setTimeLeft: (time: number) => void;
  decrementTime: () => void;
  finishBlock: () => void;
  finishExam: () => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      user: null,
      attemptId: null,
      currentBlock: 1,
      answers: {},
      flagged: {},
      timeLeft: 180 * 60, // 3 hours
      examFinished: false,

      setUser: (user) => set({ user }),
      setAttemptId: (id) => set({ attemptId: id }),
      setAnswer: (qId, optIdx) => set((state) => ({ answers: { ...state.answers, [qId]: optIdx } })),
      toggleFlag: (qId) => set((state) => ({ flagged: { ...state.flagged, [qId]: !state.flagged[qId] } })),
      setTimeLeft: (time) => set({ timeLeft: time }),
      decrementTime: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
      finishBlock: () => {
        const { currentBlock } = get();
        if (currentBlock === 1) {
          set({ currentBlock: 2, timeLeft: 180 * 60 });
        } else {
          get().finishExam();
        }
      },
      finishExam: () => set({ examFinished: true }),
      resetExam: () => set({
        user: null,
        attemptId: null,
        currentBlock: 1,
        answers: {},
        flagged: {},
        timeLeft: 180 * 60,
        examFinished: false
      })
    }),
    {
      name: 'enarm-sim-storage',
    }
  )
);
