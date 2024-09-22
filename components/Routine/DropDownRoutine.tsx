
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis, PencilOff, Trash2 } from 'lucide-react';


interface DropDownComponentProps {
    title: string;
    discription: string;
    _id: string;
    setEdit: (value: boolean) => void;
    setTitle: (value: string) => void;
    setDiscription: (value: string) => void;
    setChoiseRoutine: (value: string) => void;
    handleDelet: () => void;
}


const DropDownRoutine = (props: DropDownComponentProps) => {
    return (
        <section>
            <DropdownMenu >{/** 자식 컴포넌트 옵션 */}
                <DropdownMenuTrigger> <Ellipsis className='text-yellow-400' /> </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-[#1F1F1F] text-gray-100'>
                    <DropdownMenuItem className='p-0'>
                        <button className='flex flex-row items-center justify-between gap-4 w-full m-2'
                            onClick={() => { props.setEdit(true); props.setTitle(props.title); props.setDiscription(props.discription); props.setChoiseRoutine(props._id) }}>
                            <PencilOff />
                            <div className='flex-1 font-bold pr-1'>수정</div>
                        </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='p-0'>
                        <button className='flex flex-row items-center justify-between gap-4 w-full m-2' onClick={() => props.handleDelet()}>
                            <Trash2 />
                            <div className='flex-1 font-bold pr-1'>삭제</div>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </section>
    )
}

export default DropDownRoutine