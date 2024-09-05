'use client';
import LoaderSpinner from '@/components/LoaderSpinner';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

import React from 'react'
import { Label } from '@/components/ui/label';

import Link from 'next/link';
import TextScrolling from '@/components/TextScrolling';
import TodoCompletion from '@/components/TodoCompletion';


const TodoList = () => {
    const { user } = useUser();
    const todos = useQuery(api.todos.getUserTodos, { userId: user?.id! });

    const formatDateRange = (from: number, to?: number) => {
        if (isNaN(from)) {
            return '';
        }
        if (!to) {
            return format(from, "y/LL/dd HH:mm");
        }
        const from1 = new Date(from);
        const to1 = new Date(to);
        const compareYear = from1.getFullYear() === to1.getFullYear();
        const compareMonth = from1.getMonth() === to1.getMonth();
        const compareDay = from1.getDate() === to1.getDate();
        if (compareYear && compareMonth && compareDay) {
            return format(from, "y/LL/dd HH:mm") + ' - ' + format(to, " HH:mm");
        } else if (compareYear && compareMonth) {
            return format(from, "y/LL/dd HH:mm") + ' - ' + format(to, "dd HH:mm");
        } else if (compareYear) {
            return format(from, "y/LL/dd HH:mm") + ' - ' + format(to, "LL/dd HH:mm");
        }
        return format(from, "y/LL/dd HH:mm") + ' - ' + format(to, "y/LL/dd HH:mm");
    }
    function convertToPercentage(isCompleted: boolean, fromTimestamp?: number, toTimestamp?: number) {
        if (isCompleted) {
            return 100;
        }
        if (!fromTimestamp || !toTimestamp) {
            return 0;
        }
        // 전체 구간 (to - from) 계산
        const currentTimestamp = Date.now();
        const totalDuration = toTimestamp - fromTimestamp;

        // 현재 타임스탬프가 fromTimestamp부터 얼마나 진행되었는지 계산
        const progress = currentTimestamp - fromTimestamp;

        // 백분율 계산 (0% ~ 100%)
        const percentage = Math.round((progress / totalDuration) * 1000) / 10;
        if (percentage === 100) {
            // 완료 표시 업데이트 db에 패치 해줘야함
        }

        if (percentage > 100) {
            return 100;
        }
        if (percentage < 0) {
            return 0;
        }
        return percentage;
    }

    const attachmentUrls = (urls: string[]) => {
        if (urls.length === 0) {
            return '첨부파일 ' + 0 + '개';
        }
        return '첨부파일 ' + urls.length + '개';
    }

    if (!todos || !user) return <LoaderSpinner />;
    return (
        <section className='w-full mt-10 flex flex-col gap-4 items-center overflow-y-auto no-scrollbar'>
            <div>
                {/* 프로필,이름,제목,설명,기간,우선순위,카테고리,태그,진행상황,완료여부 */}
                <Label className='text-[24px] font-extrabold'>TODO 목록</Label>
            </div>
            <div className='h-full' style={{ maxHeight: 'calc(100vh - 10rem)' }}> {/** 세로 높이를 설정해 둬야 overflow기능이 작동함 */}
                <div className='w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 auto-rows-max'>
                    {todos.sort((a, b) => b._creationTime - a._creationTime).map(todo => (
                        <div key={todo._id} >
                            <Card className=' w-full flex flex-col'>
                                <CardHeader>
                                    <div className='flex flex-col'>
                                        <div className='flex flex-row gap-4 justify-between items-center'>
                                            <Link href={`/todos/${todo._id}`} >
                                                <CardTitle className="flex-1 overflow-hidden">
                                                    {/* <div className='truncate'>{todo.todoTitle}</div> */}
                                                    <TextScrolling text={todo.todoTitle} />
                                                </CardTitle>
                                            </Link>
                                            <div className='flex items-center justify-center'>
                                                <Badge variant={todo.isCompleted ? "completed" : "secondary"}>
                                                    <TodoCompletion isCompleted={todo.isCompleted} />
                                                </Badge>
                                            </div>

                                        </div>
                                        <CardDescription className='truncate'>{todo.todoDescription}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2'>
                                    <div>
                                        {todo.dueDate?.from ? (todo.dueDate.to ? (<>
                                            기간: {formatDateRange(todo.dueDate?.from!, todo.dueDate?.to!)}
                                        </>) : (<>
                                            {formatDateRange(todo.dueDate?.from!)}
                                        </>)) : (<>생성 일자: {formatDateRange(todo._creationTime)}</>)}
                                    </div>
                                    <div className='flex gap-2'>
                                        {todo.category && <div className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center'>
                                            {todo.category}
                                        </div>}
                                        {todo.priority && <div className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center'>
                                            {todo.priority}
                                        </div>}
                                    </div>
                                    <div className='flex justify-between items-center gap-2'>
                                        <Progress value={convertToPercentage(todo.isCompleted, todo.dueDate?.from, todo.dueDate?.to)} />
                                        {convertToPercentage(todo.isCompleted, todo.dueDate?.from, todo.dueDate?.to)}%
                                    </div>
                                </CardContent>
                                <CardFooter className='flex justify-end items-center'>
                                    <div>{todo.attachments ? attachmentUrls(todo.attachments.attachmentUrls!) : ""}</div>
                                </CardFooter>
                            </Card>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TodoList