import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TodoCompletionProps {
    isCompleted: boolean;

}
const TodoCompletion = ({ isCompleted }: TodoCompletionProps) => {

    const handleComplete = () => {
        // 완료 처리
    }
    const handleDelete = () => {
        // 삭제 처리
    }
    const handleShare = () => {
        // 공유 처리
    }

    return (
        <div onClick={e => {
            e.stopPropagation();
        }}>
            <DropdownMenu >
                <DropdownMenuTrigger>{isCompleted ? "Completed" : 'In Progress'}</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>편집</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleComplete}>완료</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>삭제</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>공유</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default TodoCompletion