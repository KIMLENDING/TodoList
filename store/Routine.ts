
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
export interface Routine {
    dndId: string; // 클라이언트에서 dnd를 위한 아이디
    indexDB: number; // 순서 DB에서 사용할 인덴스로 데이터를 가져올 때 순서를 정렬해서 가져오기 위함
    title: string; //
    description: string; // 설명
    completed: boolean;
    createdAt: number; // 루틴 생성 날짜
    completedDate: number[]; // 루틴 완료 날짜
}
export interface Routines {
    [x: string]: any; // 서버에서 만드는 필드
    dndId: string;
    indexDB: number; // 순서
    title: string; // 시간 - 이게 제목임
    description: string; // 설명
    type: string[]; // 아침, 점심, 저녁 중복 가능 - 기본값 아침
    routineItmes: Routine[]; // 할일
    updateAt: number; // 루틴 업데이트 날짜
}

interface RoutineStore {
    mockData: Routines[];
    setMockData: (data: Routines[]) => void;
    handleCompleted: (routineId: string) => void;
    handleEdit: (routineId: string, title: string, description: string) => void;
    handleEdit2: (mockId: string, title: string, description: string) => void;
    handleDelet: (routineId: string) => void;
    handleDelet2: (mockId: string) => void;
    handleAddRoutine: (DataId: string, title: string, description: string) => void;
    handleAddRoutine2: (title: string, description: string) => void;
}

const useRoutineStore = create<RoutineStore>((set) => ({
    mockData: [],
    setMockData: (data) => set({ mockData: data }),

    handleCompleted: (routineId) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        for (let i = 0; i < newMockData.length; i++) {
            const routine = newMockData[i].routineItmes?.find((r: Routine) => r.dndId === routineId);
            if (routine) {
                if (routine.completed === false) { // 완료 시 오늘(완료한) 날짜 추가
                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    routine.completedDate.push(startOfDay);
                } else { // 완료 취소 시 오늘(취소한) 날짜 삭제
                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    routine.completedDate = routine.completedDate.filter((date: any) => date !== startOfDay);
                }
                routine.completed = !routine.completed;
                return { mockData: newMockData };
            }
        }
        return state;
    }),

    handleEdit: (routineId, title, description) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        for (let i = 0; i < newMockData.length; i++) {
            const routine = newMockData[i].routineItmes?.find((r: Routine) => r.dndId === routineId);
            if (routine) {
                routine.title = title;
                routine.description = description;
                return { mockData: newMockData };
            }
        }
        return state;
    }),

    handleEdit2: (mockId, title, description) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        const routineToEdit = newMockData.find((r: Routines) => r.dndId === mockId);
        if (routineToEdit) {
            routineToEdit.title = title;
            routineToEdit.description = description;
            return { mockData: newMockData };
        }
        return state;
    }),

    handleDelet: (routineId) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        console.log(newMockData.length);
        for (let i = 0; i < newMockData.length; i++) {
            if (newMockData[i].routineItmes) {
                newMockData[i].routineItmes = newMockData[i].routineItmes.filter((r: Routine) => r.dndId !== routineId);
            }
        }
        return { mockData: newMockData };
    }),

    handleDelet2: (mockId) => set((state) => {
        const newMockData = state.mockData.filter((r: Routines) => r.dndId !== mockId);
        return { mockData: newMockData };
    }),

    handleAddRoutine: (DataId, title, description) => set((state) => {
        const newMockData = JSON.parse(JSON.stringify(state.mockData));
        const routineToAddTo = newMockData.find((r: Routines) => r.dndId === DataId); // 부모 루틴 찾기
        if (routineToAddTo) {
            routineToAddTo.routineItmes = routineToAddTo.routineItmes || [];
            const uuid = uuidv4();
            routineToAddTo.routineItmes.push({
                dndId: `routine-${DataId}-${uuid}`,
                indexDB: routineToAddTo.routineItmes.length,
                title,
                description,
                completed: false,
                createdAt: Date.now(),
                completedDate: [],
            });
            return { mockData: newMockData };
        }
        return state;
    }),

    handleAddRoutine2: (title, description) => set((state) => {
        const newMockData = [...state.mockData];
        const uuid = uuidv4();
        newMockData.push({
            dndId: `mock-${uuid}`, // 클라이언트에서 dnd를 위한 아이디
            indexDB: newMockData.length,
            title,
            description,
            type: ['아침'],
            routineItmes: [],
            updateAt: Date.now(),
        });
        return { mockData: newMockData };
    }),
}));

export default useRoutineStore;