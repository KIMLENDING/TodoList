'use client';

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from 'next/navigation'
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from "@/components/ui/use-toast"
import { useUser } from '@clerk/nextjs';

interface TodoControlsProps {
    todoId: Id<'todos'>;
    isCompleted: string;

}
const TodoControls = ({ isCompleted, todoId }: TodoControlsProps) => {
    const router = useRouter();
    const updateTodoCompletion = useMutation(api.todos.updateTodoCompletion);
    const deleteTodo = useMutation(api.todos.deleteTodo);
    const handleComplete = async (changeState: string) => {
        try {
            // 완료,실패 처리
            if (changeState === '완료') {
                // 완료 처리
                await updateTodoCompletion({ id: todoId, isCompleted: '완료' });
            } else if (changeState === '실패') {
                // 실패 처리
                await updateTodoCompletion({ id: todoId, isCompleted: '실패' });
            } else if (changeState === '진행중') {
                // 진행중 처리
                await updateTodoCompletion({ id: todoId, isCompleted: '진행중' });
            }
            toast({ title: '상태 업데이트 성공' });
        } catch (error) {
            // 에러 처리
            toast({ title: '상태 업데이트 실패', variant: 'destructive' });
            console.error('Todo completion update failed:', error);
        }
    }
    const handleDelete = async () => {
        // 삭제 처리
        // 현재 유저와 todo 작성자가 같을 때만 삭제
        await deleteTodo({ id: todoId });
    }
    const handleEdit = () => {
        // 수정 처리
        router.push(`/todos/${todoId}`)
    }
    const handleShare = () => {
        // 공유 처리
        console.log('공유하기'); // 이건 어떻게 할지 생각해보기
    }

    return (
        <div onClick={e => {
            e.stopPropagation();
        }}>
            <DropdownMenu >
                <DropdownMenuTrigger>{isCompleted !== '완료' ? (isCompleted === '진행중' ? "진행중" : "실패") : '완료'}</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>설정</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { handleComplete('완료') }} disabled={isCompleted === '완료'}>완료</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleComplete('실패') }} disabled={isCompleted === '실패'}>실패</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleComplete('진행중') }} disabled={isCompleted === '진행중' || isCompleted === '완료'}>진행중</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>수정</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>삭제</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>공유</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default TodoControls