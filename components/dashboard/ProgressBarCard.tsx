import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import LoaderSpinner from '../LoaderSpinner';
interface ProgressBarProps {
    label: string;
    value: number;
    max: number;
    color: string;
}
const ProgressBar = ({ label, value = 0, max = 0, color }: ProgressBarProps) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm font-medium text-gray-700">{`${value}/${max}`}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className={`h-2.5 rounded-full ${color}`}
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
        <div className='h-min'>
            <Card>
                <CardHeader>
                    <CardTitle>상황판</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    {!user ? (<>로그인 해주세요</>) : (<>
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