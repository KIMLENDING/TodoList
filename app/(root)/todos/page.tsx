"use client";
import Searchbar from '@/components/dashboard/Searchbar';
import EmptyState from '@/components/EmptyState';

import LoaderSpinner from '@/components/LoaderSpinner';
import TodoCard from '@/components/TodoCard';


import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const TodoList = ({ searchParams: { search } }: { searchParams: { search: string } }) => {
    const router = useRouter();
    const { user } = useUser();
    useEffect(() => {
        if (!user) {
            router.push('/sign-in');
        }
    }, [])
    const searchTodosData = useQuery(api.todos.searchTodos, { search: search || '' })
    return (
        <div className='flex flex-col gap-9'>
            <div className='max-md:hidden'>
                <Searchbar />
            </div>
            <section className='w-full mt-10 flex flex-col gap-4 items-center overflow-y-auto no-scrollbar'>
                <div className='flex flex-col gap-9'>
                    <h1 className="text-[20px] font-bold ">
                        {!search ? '최근 작성한 일정' : '검색 결과: '}
                        {search && <span className=''>{search}</span>}
                    </h1>
                </div>
                {searchTodosData ? (
                    <>
                        {searchTodosData.length > 0 ? (
                            <div className='h-full w-full' style={{ maxHeight: 'calc(100vh - 17rem)' }}>
                                <div className="w-full grid grid-cols-1 xl:grid-cols-2  2xl:grid-cols-3 gap-5 auto-rows-max">
                                    {searchTodosData?.map((todo: any, index: any) => (
                                        <TodoCard key={index} todo={todo} />
                                    ))}
                                </div>
                            </div>
                        ) :
                            (<EmptyState title='결과 없음' buttonLink={'/createTodo'} buttonText={'TODO생성하기'} />)}
                    </>
                ) :
                    <LoaderSpinner />}
            </section>
        </div >
    )
}

export default TodoList