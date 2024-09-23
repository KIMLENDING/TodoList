import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { SignedOut, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import LoaderSpinner from '../LoaderSpinner';
import { Button } from '../ui/button';
import Link from 'next/link';
interface ProgressBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
}
const ProgressBar = ({ label, value = 0, max = 0, color }: ProgressBarProps) => (
    <div className="mb-4 ">
        <div className="flex justify-between items-center mb-1 ">
            <span className="text-sm font-medium  ">{label}</span>
            <span className="text-sm font-medium ">{`${value}/${max}`}</span>
        </div>
        <div className="w-full bg-opacity-10 bg-yellow-50 rounded-full h-2.5">
            <div
                className={`h-2.5 rounded-full  ${color} `}
                style={{ width: `${(value / max) * 100}%` }}
            ></div>
        </div>
    </div>
);

const ProgressBarCard = () => {
    const { user } = useUser();
    const getTodoCount = useQuery(api.todos.getTodoCount, { userId: user?.id } || {});

    const { completed = 0, inProgress = 0, failed = 0 } = getTodoCount || {};
    const total = completed + inProgress + failed;

    return (
        <div className='h-min '>
            <Card className='hover:ring-0'>
                <CardHeader>
                    <CardTitle className='text-white-1'>상황판</CardTitle>
                </CardHeader>
                <CardContent>
                    {!user ? (<><SignedOut>
                        <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8 flex-col'>
                            <Button asChild className='text-[16px] w-full bg-blue-400 font-extrabold text-white-1'>
                                <Link href='/sign-in'>로그인</Link>
                            </Button>
                            <div>
                                테스트 계정
                                <div>
                                    아이디: kilin0402@gmail.com
                                </div>
                                <div>
                                    비밀번호: todo0402!
                                </div>
                            </div>
                        </div>
                    </SignedOut></>) : (<>
                        {getTodoCount ? (
                            <> <ProgressBar label="완료" value={completed} max={total} color="bg-green-600" />
                                <ProgressBar label="진행중" value={inProgress} max={total} color="bg-blue-600" />
                                <ProgressBar label="실패" value={failed} max={total} color="bg-red-600" /></>
                        ) : (<LoaderSpinner />)}</>)}
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ProgressBarCard