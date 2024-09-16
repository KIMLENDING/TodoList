'use client';

import React from 'react'
import ProgressBarCard from '@/components/dashboard/ProgressBarCard';
import Searchbar from '@/components/dashboard/Searchbar';
import PriorityAndCategoryCard from '@/components/dashboard/PriorityAndCategoryCard';
import DateRangeSelect from '@/components/dashboard/DateRangeSelect';
const Deashboard = () => {

    return (
        <section className='w-full mt-10 flex flex-col gap-4 px-1 items-center overflow-y-auto no-scrollbar'>
            <div className='flex w-full flex-col h-full gap-8' style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                <div className='max-md:hidden'><Searchbar /></div>
                <div className='w-full flex-1 flex flex-col gap-4'>
                    <div>
                        <ProgressBarCard /> {/** 진행률 */}
                    </div>
                    <PriorityAndCategoryCard /> {/** 우선순위, 카테고리로 필터링 */}
                    <DateRangeSelect /> {/** 기간으로 생성한 todo 필터링 */}
                </div>
            </div>
        </section>
    )
}

export default Deashboard