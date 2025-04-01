import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { TodoState } from '@/types/types';
import PriorityAndCategorySelector from '../createTodo/PriorityAndCategorySelector';
import LoaderSpinner from '../LoaderSpinner';
import TextScrolling from '../TextScrolling';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import TodoControls from '../TodoCompletion';

const PriorityAndCategoryCard = () => {
    const { user } = useUser();
    const [todoState, setTodoState] = useState<TodoState>({
        priority: "상",
        category: "개인",
    });
    const getTodosByCategory = useQuery(api.todos.getTodosByCategory, { priority: todoState.priority, category: todoState.category, userId: user?.id });
    return (
        <div className='w-full grid grid-cols-1'>
            <Card className='hover:ring-0'>
                <CardHeader>
                    <CardTitle>필터링</CardTitle>
                    <PriorityAndCategorySelector todoState={todoState} setTodoState={setTodoState} />
                </CardHeader>
                <CardContent className='flex justify-between gap-5'>
                    {getTodosByCategory ? (
                        getTodosByCategory.length === 0 ? (
                            <div>자료가 없습니다</div>
                        ) : (
                            <div className='flex flex-col w-full max-h-[500px] gap-2 min-w-0 overflow-y-scroll p-1'>
                                {getTodosByCategory?.map(({ _id, todoTitle, category, priority, isCompleted }) => (
                                    <Card key={_id} >
                                        <CardHeader>
                                            <div className='flex flex-col'>
                                                <div className='flex flex-row gap-4 justify-between items-center'>
                                                    <Link href={`/dashboard/todos/${_id}`} className="flex-1 min-w-0"> {/* min-w-0: 최소 너비 0 기본은 auto라서 자식요소의 공간을 최대한 확보하려 하기 때문에 자식요소가 커지는 것을 방지*/}
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
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )
                    ) : (
                        <LoaderSpinner />
                    )}

                </CardContent>

            </Card>
        </div>
    )
}

export default PriorityAndCategoryCard