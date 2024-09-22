import { Check } from 'lucide-react'
import React from 'react'
import DropDownRoutines from './DropDownRoutines'
import { Routines } from './Routine'
import useRoutineStore from '@/store/Routine'


interface EditRoutinesProps {
    edit2: boolean
    setEdit2: (value: boolean) => void
    title: string
    setTitle: (value: string) => void
    discription: string
    setDiscription: (value: string) => void
    selectedRsId: string
    setSelectedRsId: (value: string) => void
    Data: Routines
}
const EditRoutines = ({
    edit2, setEdit2, title, setTitle, discription, setDiscription, selectedRsId, setSelectedRsId, Data
}: EditRoutinesProps) => {
    const {
        handleEdit2,
        handleDelet2,
    } = useRoutineStore();
    return (
        <section>
            {edit2 && selectedRsId === Data._id ? (<> {/*부모 수정 모드 */}
                <div className='flex flex-row gap-4 items-center'>
                    <div className='flex flex-col w-full gap-1'>
                        <div className="flex justify-between items-center">
                            <input type="text" value={title} onChange={(e) => { setTitle(e.target.value) }} className="text-sm font-semibold border-white border-b-2 bg-transparent" />
                            <button onClick={() => {
                                handleEdit2(Data._id, title, discription);
                                setEdit2(false);
                                setTitle('');
                                setDiscription('');
                            }}><Check className='text-yellow-300' /></button>
                        </div>
                        <input type="text" value={discription} onChange={(e) => { setDiscription(e.target.value) }} className="text-xs text-gray-500 border-white border-b-2 bg-transparent" />
                    </div>
                </div>
            </>) : (<>
                <div className='flex flex-col w-full gap-1 px-3 '>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">
                            {Data.title}
                        </span>
                        <div className='opacity-0 group-hover:opacity-100 duration-300 transition-all'>
                            <DropDownRoutines title={Data.title} _id={Data._id} discription={Data.discription} handleDelet2={() => handleDelet2(Data._id)} setEdit2={setEdit2} setTitle={setTitle} setDiscription={setDiscription} setChoisePId={setSelectedRsId} />
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">
                        {Data.discription}
                    </span>
                </div>
            </>)}
        </section>
    )
}

export default EditRoutines