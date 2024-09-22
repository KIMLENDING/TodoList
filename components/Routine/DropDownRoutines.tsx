import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis, PencilOff, Trash2 } from 'lucide-react';
interface DropDownComponent2Props {
    title: string;
    discription: string;
    _id: string;
    setEdit2: (value: boolean) => void;
    setTitle: (value: string) => void;
    setDiscription: (value: string) => void;
    setChoisePId: (value: string) => void;
    handleDelet2: () => void;
}

const DropDownRoutines = (props: DropDownComponent2Props) => {
    return (
        <DropdownMenu >{/** 부모 컴포넌트 옵션 */}
            <DropdownMenuTrigger> <Ellipsis className='text-yellow-400' /> </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-[#1F1F1F] text-gray-100'>
                <DropdownMenuItem className='p-0' >
                    <button className='flex flex-row items-center justify-between gap-4 w-full m-2'
                        onClick={() => { props.setEdit2(true); props.setTitle(props.title); props.setDiscription(props.discription); props.setChoisePId(props._id) }}>
                        <PencilOff />
                        <div className='flex-1 font-bold pr-1'>수정</div>
                    </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='p-0'>
                    <button className='flex flex-row items-center justify-between gap-4 w-full m-2' onClick={() => props.handleDelet2()}>
                        <Trash2 />
                        <div className='flex-1 font-bold pr-1'>삭제</div>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropDownRoutines