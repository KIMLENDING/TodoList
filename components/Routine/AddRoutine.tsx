import { Check, Plus } from 'lucide-react';
import React from 'react'

import useRoutineStore, { Routines } from '@/store/Routine';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface AddRoutineProps {
    addRoutine: boolean
    setAddRoutine: (value: boolean) => void
    title: string
    setTitle: (value: string) => void
    description: string
    setDescription: (value: string) => void
    selectedRsId: string
    setSelectedRsId: (value: string) => void
    setScrollToId: (value: string) => void
    Data: Routines
}

const AddRoutine = ({
    addRoutine, setAddRoutine, title, setTitle, description: description, setDescription: setDescription, selectedRsId, setSelectedRsId, setScrollToId, Data
}: AddRoutineProps) => {
    const {
        handleAddRoutine,
    } = useRoutineStore();

    const handleDbAddRoutine = async () => {
        handleAddRoutine(Data.dndId, title, description);
        setAddRoutine(false); // 추가 모드 해제
        setSelectedRsId(''); // 부모요소 선택 해제
        setTitle('');
        setDescription('');
        setScrollToId(Data.dndId); // 스크롤 이동
    }
    return (
        <section>
            {addRoutine && selectedRsId === Data.dndId ? (<> {/*자식 routine 추가 모드*/}
                <div className='flex flex-row gap-4 items-center ring-1 ring-white rounded-lg p-4'>
                    <div className='flex flex-col w-full gap-1'>
                        <div className="flex justify-between items-center">
                            <input type="text" placeholder='제목' value={title} onChange={(e) => { setTitle(e.target.value) }} className="text-sm font-semibold border-white border-b-2 bg-transparent" />
                            <button onClick={() => { handleDbAddRoutine() }}>
                                <Check className='text-yellow-300' />
                            </button>
                        </div>
                        <input type="text" placeholder='부제목' value={description} onChange={(e) => { setDescription(e.target.value) }} className="text-xs text-gray-500 border-white border-b-2 bg-transparent" />
                    </div>
                </div>
            </>) :
                (<>
                    <div className='flex w-full justify-center ' onClick={() => { setAddRoutine(true); setSelectedRsId(Data.dndId) }}>
                        <Plus className='duration-300 transition-all h-0  opacity-0 group-hover:opacity-100 group-hover:h-[24px] group-hover:text-yellow-400' />
                    </div>
                </>)}
        </section>
    )
}

export default AddRoutine