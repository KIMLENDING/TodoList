import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Id } from '@/convex/_generated/dataModel'
import useRoutineStore from '@/store/Routine'
import { useUser } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { Check, Plus } from 'lucide-react'

import React from 'react'

interface AddRoutinesProps {
    addRoutine: boolean
    setAddRoutine: (value: boolean) => void
    edit2: boolean
    setEdit2: (value: boolean) => void
    title: string
    setTitle: (value: string) => void
    description: string
    setDescription: (value: string) => void
}
const AddRoutines = (
    { addRoutine, setAddRoutine, edit2, setEdit2, title, setTitle,
        description: description, setDescription: setDescription
    }: AddRoutinesProps) => {
    const {
        handleAddRoutine2,
    } = useRoutineStore();


    const handleTest = async () => {
        handleAddRoutine2(title, description);
        setAddRoutine(false);
        setEdit2(false);
        setTitle('');
        setDescription('');
    }
    return (
        <section>
            {addRoutine && edit2 ? (<> {/*부모 추가 모드(데이터 입력 모드)  edit을 넣은 이유는 addTodd만 쓰면 다를 수정 모드일때 항 상 켜져서*/}
                <div className='flex w-fit bg-[#1F1F1F] h-fit items-center justify-center rounded-xl'>
                    <div className='flex flex-col gap-3 rounded-lg p-4 transition-shadow group hover:ring-1 hover:ring-gray-300 shadow shadow-[#a87f7f]'>
                        <div className="flex justify-between items-center gap-3">
                            <input type="text" placeholder='제목' value={title} onChange={(e) => { setTitle(e.target.value) }} className="text-sm font-semibold border-white border-b-2 bg-transparent" />
                            <button onClick={() => { handleTest() }}>
                                <Check className='text-yellow-300' />
                            </button>
                        </div>
                        <input type="text" placeholder='부제목' value={description} onChange={(e) => { setDescription(e.target.value) }} className="text-xs text-gray-500 border-white border-b-2 bg-transparent" />
                    </div>
                </div>
            </>) : (<> {/*부모 추가 모드(데이터 입력 모드) 아닐때 상시 보이는 추가 버튼 */}
                <div className='flex w-fit bg-[#1F1F1F] h-fit items-center justify-center rounded-xl pb-2'>
                    <div className={cn(
                        'flex flex-row gap-3 rounded-lg p-4 transition-all group hover:ring-1 hover:ring-gray-300 shadow shadow-[#272727]',
                    )} onClick={() => { setAddRoutine(true); setEdit2(true) }}
                    >
                        <Plus className='text-yellow-300' />
                        <p>루틴 생성</p>
                    </div>
                </div>
            </>)}

        </section>
    )
}

export default AddRoutines