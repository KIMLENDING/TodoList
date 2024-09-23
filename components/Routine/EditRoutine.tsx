import React from 'react'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import DropDownRoutine from './DropDownRoutine'
import useRoutineStore, { Routine } from '@/store/Routine'

interface EditRoutineProps {
    edit: boolean
    setEdit: (value: boolean) => void
    title: string
    setTitle: (value: string) => void
    description: string
    setDescription: (value: string) => void
    selectedRoutineId: string
    setSelectedRoutineId: (value: string) => void

    routineItmes: Routine
}

const EditRoutine = ({
    edit, setEdit, title, setTitle, description: description, setDescription: setDescription, selectedRoutineId, setSelectedRoutineId, routineItmes: routine
}: EditRoutineProps) => {
    const {
        handleEdit,
        handleDelet,
        handleCompleted,
    } = useRoutineStore();
    return (
        <section>
            {edit && selectedRoutineId === routine.dndId ? (<>{/*자식(루틴) 수정 모드 */}
                <div className='flex flex-row gap-4 items-center'>
                    <button onClick={() => handleCompleted(routine.dndId)} className={cn("duration-300 transition-all p-1 text-xs font-semibold text-gray-900 rounded-full border-2 w-fit h-fit", routine.completed ? 'bg-yellow-500' : 'bg-opacity-0')}>
                        {routine.completed ? <Check size={16} /> : <><Check size={16} className='opacity-0' /></>}
                    </button>
                    <div className='flex flex-col w-full gap-1'>
                        <div className="flex justify-between items-center">
                            <input type="text" value={title} placeholder='제목' onChange={(e) => { setTitle(e.target.value) }} className="text-sm font-semibold border-white border-b-2 bg-transparent" />
                            <button onClick={() => {
                                handleEdit(routine.dndId, title, description);
                                setEdit(false);
                                setTitle('');
                                setDescription('');
                                setSelectedRoutineId('');
                            }}><Check /></button>
                        </div>
                        <input type="text" value={description} placeholder='부제목' onChange={(e) => { setDescription(e.target.value) }} className="text-xs text-gray-500 border-white border-b-2 bg-transparent" />
                    </div>
                </div>
            </>) : (<>{/*자식 수정 모드 아닐때 */}
                <div className='flex flex-row gap-4 items-center group '>
                    <button onClick={() => handleCompleted(routine.dndId)} className={cn("duration-300 transition-all p-1 text-xs font-semibold text-gray-900 rounded-full border-2 w-fit h-fit", routine.completed ? 'bg-yellow-500' : 'bg-opacity-0')}>
                        {routine.completed ? <Check size={16} /> : <><Check size={16} className='opacity-0' /></>}
                    </button>
                    <div className='flex flex-col w-full gap-1 '>
                        <div className="flex justify-between items-center ">
                            <span className={cn("relative text-sm font-semibold transition-all duration-700 ease-in-out", routine.completed ? ' opacity-50' : 'opacity-100')}>
                                {routine.title}
                                <span className={` absolute left-1/2 right-0 top-1/2 h-0.5 bg-current transform scale-x-0 origin-left transition-transform duration-300 ease-in-out
                                                                                                                ${routine.completed ? 'scale-x-100' : 'scale-x-0'}`}
                                ></span>
                                <span className={` absolute left-0 right-1/2 top-1/2 h-0.5 bg-current transform scale-x-0 origin-right transition-transform duration-300 ease-in-out
                                                                                                                ${routine.completed ? 'scale-x-100' : 'scale-x-0'}`}
                                ></span>
                            </span>
                            <div className={`duration-300 transition-all ${selectedRoutineId === routine.dndId ? 'group-hover:opacity-100 ' : 'opacity-0 pointer-events-none'}`}>
                                <DropDownRoutine title={routine.title} dndId={routine.dndId} description={routine.description} handleDelet={() => handleDelet(routine.dndId)} setEdit={setEdit} setTitle={setTitle} setDescription={setDescription} setChoiseRoutine={setSelectedRoutineId} />
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 ">
                            {routine.description}
                        </span>
                    </div>
                </div>
            </>)}
        </section>
    )
}

export default EditRoutine