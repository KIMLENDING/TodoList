import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { TodoState } from '@/types/types';
import PriorityAndCategorySelector from '../createTodo/PriorityAndCategorySelector';
import LoaderSpinner from '../LoaderSpinner';
import TodoCard from '../TodoCard';
import { Label } from '../ui/label';
import TextScrolling from '../TextScrolling';
import Link from 'next/link';

const PriorityAndCategoryCard = () => {
    const { user } = useUser();
    const [todoState, setTodoState] = useState<TodoState>({
        priority: "상",
        category: "개인",
    });
    const getTodosByCategory = useQuery(api.todos.getTodosByCategory, { priority: todoState.priority, category: todoState.category, userId: user?.id } || {});
    return (
        <div>
            <Card >
                <CardHeader>
                    <CardTitle>필터링</CardTitle>
                    <PriorityAndCategorySelector todoState={todoState} setTodoState={setTodoState} />
                </CardHeader>
                <CardContent className='flex justify-between gap-5'>

                    {!user ? (<>로그인 해주세요</>) : (
                        <>
                            {getTodosByCategory ? (
                                getTodosByCategory.length === 0 ? (
                                    <div>자료가 없습니다</div>
                                ) : (
                                    <div className='flex flex-col w-full gap-2'>
                                        {getTodosByCategory?.map(({ _id, todoTitle, category, priority }) => (
                                            <Card key={_id}>
                                                <Link href={`/todos/${_id}`} className="flex-1 min-w-0">
                                                    <CardHeader>
                                                        <CardTitle><TextScrolling text={todoTitle} /></CardTitle>
                                                        <div className='flex flex-row gap-2'>
                                                            <div className='flex gap-2'>
                                                                {category && (
                                                                    <div className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center'>
                                                                        {category}
                                                                    </div>
                                                                )}
                                                                {priority && (
                                                                    <div className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center'>
                                                                        {priority}
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
                <CardFooter>
                </CardFooter>
            </Card>
        </div>
    )
}

export default PriorityAndCategoryCard