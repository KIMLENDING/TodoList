'use client';

import React from 'react'
import ProgressBarCard from '@/components/dashboard/ProgressBarCard';
import Searchbar from '@/components/dashboard/Searchbar';
import PriorityAndCategoryCard from '@/components/dashboard/PriorityAndCategoryCard';
const Deashboard = () => {

    return (
        <section className='w-full mt-10 flex flex-col gap-4 px-1 items-center overflow-y-auto no-scrollbar'>
            <div className='flex w-full flex-col h-full gap-8' style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                <div className='max-md:hidden'><Searchbar /></div>
                <div className='w-full flex-1 flex flex-col gap-4'>
                    <ProgressBarCard />
                    <PriorityAndCategoryCard />
                </div>
                <div>특정 기간- 여긴 달력으로 값 넘겨주면 될것 같고</div>
                <div>태그별 필터링 - 여긴 input으로 검색 해야하고</div>
            </div>
        </section>
    )
}

export default Deashboard