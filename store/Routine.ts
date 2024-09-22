import { create } from 'zustand';

export interface Routine {
    _id: string; // 아이디 - 고유값
    indexDB: number; // 순서 DB에서 사용할 인덴스로 데이터를 가져올 때 순서를 정렬해서 가져오기 위함
    title: string; //
    discription: string; // 설명
    completed: boolean;
}
export interface Routines {
    _id: string; //아이디 - 고유값
    indexDB: number; // 순서
    title: string; // 시간 - 이게 제목임
    discription: string; // 설명
    type: string[]; // 아침, 점심, 저녁 중복 가능 - 기본값 아침
    routine?: Routine[]; // 할일
}

interface RoutineStore {
    mockData: Routines[];
    setMockData: (data: Routines[]) => void;
    handleCompleted: (routineId: string) => void;
    handleEdit: (routineId: string, title: string, discription: string) => void;
    handleEdit2: (mockId: string, title: string, discription: string) => void;
    handleDelet: (routineId: string) => void;
    handleDelet2: (mockId: string) => void;
    handleAddRoutine: (DataId: string, title: string, discription: string) => void;
    handleAddRoutine2: (title: string, discription: string) => void;
}

const useRoutineStore = create<RoutineStore>((set) => ({
    mockData: [],
    setMockData: (data) => set({ mockData: data }),

    handleCompleted: (routineId) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        for (let i = 0; i < newMockData.length; i++) {
            const routine = newMockData[i].routine?.find((r: Routine) => r._id === routineId);
            if (routine) {
                routine.completed = !routine.completed;
                return { mockData: newMockData };
            }
        }
        return state;
    }),

    handleEdit: (routineId, title, discription) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        for (let i = 0; i < newMockData.length; i++) {
            const routine = newMockData[i].routine?.find((r: Routine) => r._id === routineId);
            if (routine) {
                routine.title = title;
                routine.discription = discription;
                return { mockData: newMockData };
            }
        }
        return state;
    }),

    handleEdit2: (mockId, title, discription) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        const routineToEdit = newMockData.find((r: Routines) => r._id === mockId);
        if (routineToEdit) {
            routineToEdit.title = title;
            routineToEdit.discription = discription;
            return { mockData: newMockData };
        }
        return state;
    }),

    handleDelet: (routineId) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        for (let i = 0; i < newMockData.length; i++) {
            if (newMockData[i].routine) {
                newMockData[i].routine = newMockData[i].routine.filter((r: Routine) => r._id !== routineId);
                return { mockData: newMockData };
            }
        }
        return state;
    }),

    handleDelet2: (mockId) => set((state) => {
        const newMockData = state.mockData.filter((r: Routines) => r._id !== mockId);
        return { mockData: newMockData };
    }),

    handleAddRoutine: (DataId, title, discription) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        const routineToAddTo = newMockData.find((r: Routines) => r._id === DataId);
        if (routineToAddTo) {
            routineToAddTo.routine = routineToAddTo.routine || [];
            routineToAddTo.routine.push({
                _id: `routine-${DataId}-${routineToAddTo.routine.length}`,
                indexDB: routineToAddTo.routine.length,
                title,
                discription,
                completed: false
            });
            return { mockData: newMockData };
        }
        return state;
    }),

    handleAddRoutine2: (title, discription) => set((state) => {
        const newMockData = [...state.mockData];
        newMockData.push({
            _id: `mock-${newMockData.length}`,
            indexDB: newMockData.length,
            title,
            discription,
            type: ['아침', '점심', '저녁'].filter(() => Math.random() > 0.5) || ['아침'],
            routine: [],
        });
        return { mockData: newMockData };
    }),
}));

export default useRoutineStore;