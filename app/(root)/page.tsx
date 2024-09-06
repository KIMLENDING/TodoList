'use client';
import LoaderSpinner from '@/components/LoaderSpinner';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Progress } from "@/components/ui/progress"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import React from 'react'
import ProgressBarCard from '@/components/dashboard/ProgressBarCard';

const Deashboard = () => {





    return (
        <section className='w-full mt-10 flex flex-col gap-4 items-center overflow-y-auto no-scrollbar'>
            <div className='h-full' style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                <div>검색어 입력란</div>
                <div>
                    <ProgressBarCard />
                </div>
                <div>특정 기간- 여긴 달력으로 값 넘겨주면 될것 같고</div>
                <div>우선순위 필터링- 여긴 select로 값 넘겨주면 될것 같고</div>
                <div>카테고리별 필터링- 여긴 select로 값 넘겨주면 될것 같고</div>
                <div>태그별 필터링 - 여긴 input으로 검색 해야하고</div>
            </div>
        </section>
    )
}

export default Deashboard