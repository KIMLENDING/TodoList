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


const DateRangeSelect = () => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const { user } = useUser();
    const getTodosByDay = useQuery(api.todos.getTodosByDay, { date: { from: Number(date?.from), to: Number(date?.to) }, userId: user?.id });
    console.log(getTodosByDay)
    return (
        <div>
            <Card >
                <CardHeader>
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
                                    <div className='flex flex-col w-full gap-2'>
                                        {getTodosByDay?.map(({ _id, todoTitle, _creationTime, }) => (
                                            <Card key={_id}>
                                                <Link href={`/todos/${_id}`} className="flex-1 min-w-0">
                                                    <CardHeader>
                                                        <CardTitle><TextScrolling text={todoTitle} /></CardTitle>
                                                        <div className='flex flex-row gap-2'>
                                                            <div className='flex gap-2'>
                                                                {_creationTime && (
                                                                    <div className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center'>
                                                                        작성일: {format(_creationTime, "y/LL/dd HH:mm")}
                                                                    </div>
                                                                )}

                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                </Link>
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