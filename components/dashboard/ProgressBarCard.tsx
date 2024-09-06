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
interface ProgressBarCardProps {
    label: string;
    value: number;
    total: number;
}
const ProgressBar = ({ label, value, max, color }: ProgressBarProps) => (
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
    const getTodoCount = useQuery(api.todos.getTodoCount, { userId: user?.id! });
    const completed = getTodoCount?.completed || 0;
    const inProgress = getTodoCount?.inProgress || 0;
    const failed = getTodoCount?.failed || 0;
    const total = completed + inProgress + failed || 1;

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>상황판</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    {user ? (
                        <> <ProgressBar label="완료" value={completed} max={total} color="bg-green-600" />
                            <ProgressBar label="진행중" value={inProgress} max={total} color="bg-blue-600" />
                            <ProgressBar label="실패" value={failed} max={total} color="bg-red-600" /></>
                    ) : (<><LoaderSpinner /></>)}

                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ProgressBarCard