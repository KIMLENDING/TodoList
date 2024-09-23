import React, { useState } from 'react'
import DateTimePickerWithRange from '../createTodo/DateTimePickerWithRange'
import { DateRange } from 'react-day-picker';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import LoaderSpinner from '../LoaderSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { format } from "date-fns"
import TextScrolling from '../TextScrolling';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import TodoControls from '../TodoCompletion';


const DateRangeSelect = () => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const { user } = useUser();
    const getTodosByDay = useQuery(api.todos.getTodosByDay, { date: { from: Number(date?.from), to: Number(date?.to) }, userId: user?.id });
    return (
        <div className='w-full grid grid-cols-1'>
            <Card className='hover:ring-0'>
                <CardHeader className='overflow-auto'>
                    <CardTitle>날짜 선택</CardTitle>
                    <DateTimePickerWithRange date={date} setDate={setDate} checked={true} />
                </CardHeader>
                <CardContent className='flex justify-between gap-5'>

                    {!user ? (<>로그인 해주세요</>) : (
                        <>
                            {getTodosByDay ? (
                                getTodosByDay.length === 0 ? (
                                    <div>자료가 없습니다</div>
                                ) : (
                                    <div className='flex flex-col w-full max-h-[500px] gap-2 min-w-0 overflow-y-scroll p-1'>
                                        {getTodosByDay?.map(({ _id, todoTitle, _creationTime, isCompleted }) => (
                                            <Card key={_id} >
                                                <CardHeader>
                                                    <div className='flex flex-col'>
                                                        <div className='flex flex-row gap-4 justify-between items-center'>
                                                            <Link href={`/todos/${_id}`} className="flex-1 min-w-0">
                                                                <CardTitle className="flex-1 overflow-hidden">
                                                                    <TextScrolling text={todoTitle} />
                                                                </CardTitle>
                                                            </Link>
                                                            <div className="flex-shrink-0"> {/* 요소 크기 유지 */}
                                                                <Badge variant={isCompleted !== '완료' ? (isCompleted === '진행중' ? "secondary" : "destructive") : "completed"}>
                                                                    <TodoControls isCompleted={isCompleted} todoId={_id} />
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className='flex flex-row gap-2'>
                                                    <div className='flex gap-2'>
                                                        {_creationTime && (
                                                            <div className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center'>
                                                                작성일: {format(_creationTime, "y/LL/dd HH:mm")}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <LoaderSpinner />
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div >
    )
}

export default DateRangeSelect