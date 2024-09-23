import { Check } from 'lucide-react'
import React from 'react'
import DropDownRoutines from './DropDownRoutines'

import useRoutineStore, { Routines } from '@/store/Routine'
import { CardTitle } from '../ui/card'


interface EditRoutinesProps {
    edit2: boolean
    setEdit2: (value: boolean) => void
    title: string
    setTitle: (value: string) => void
    description: string
    setDescription: (value: string) => void
    selectedRsId: string
    setSelectedRsId: (value: string) => void
    Data: Routines
}
const EditRoutines = ({
    edit2, setEdit2, title, setTitle, description: description, setDescription: setDescription, selectedRsId, setSelectedRsId, Data
}: EditRoutinesProps) => {
    const {
        handleEdit2,
        handleDelet2,
    } = useRoutineStore();
    return (
        <section>
            {edit2 && selectedRsId === Data.dndId ? (<> {/*부모 수정 모드 */}
                <div className='flex flex-row gap-4 items-center'>
                    <div className='flex flex-col w-full gap-1'>
                        <div className="flex justify-between items-center">
                            <input type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} className="text-sm font-semibold border-white border-b-2 bg-transparent" />
                            <button onClick={() => {
                                handleEdit2(Data.dndId, title, description);
                                setEdit2(false);
                                setTitle('');
                                setDescription('');
                                setSelectedRsId('');
                            }}><Check className='text-yellow-300' /></button>
                        </div>
                        <input type="text" value={description} onChange={(e) => { setDescription(e.target.value) }} className="text-xs text-gray-500 border-white border-b-2 bg-transparent" />
                    </div>
                </div>
            </>) : (<>
                <div className='flex flex-col w-full gap-1 px-3 '>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">
                            {Data.title}
                        </CardTitle>
                        <div className={`duration-300 transition-all ${selectedRsId === Data.dndId ? 'hover:opacity-100 ' : 'opacity-0 pointer-events-none'}`}>
                            <DropDownRoutines title={Data.title} dndId={Data.dndId} description={Data.description} handleDelet2={() => handleDelet2(Data.dndId)} setEdit2={setEdit2} setTitle={setTitle} setDescription={setDescription} setChoisePId={setSelectedRsId} />
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">
                        {Data.description}
                    </span>
                </div>
            </>)}
        </section>
    )
}

export default EditRoutines