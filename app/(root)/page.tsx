'use client';

import React from 'react'
import ProgressBarCard from '@/components/dashboard/ProgressBarCard';
import Searchbar from '@/components/dashboard/Searchbar';
import PriorityAndCategoryCard from '@/components/dashboard/PriorityAndCategoryCard';
import DateRangeSelect from '@/components/dashboard/DateRangeSelect';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import Animate from '@/components/Animate';
const Deashboard = () => {
    const { ref, inView } = useInView({ // inView는 해당 요소가 화면에 보이는지 여부를 알려준다.
        threshold: 0.2, // 0.2는 20%가 화면에 보일 때 inView가 true가 된다.
        triggerOnce: true, // 한번만 실행되게 한다.
    })
    return (
        <section className='w-full mt-10 flex flex-col gap-4 px-1 items-center overflow-y-auto no-scrollbar'>
            <div className='flex w-full flex-col h-full gap-8' style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                <div className='max-md:hidden'><Searchbar /></div>
                <div className='w-full flex-1 flex flex-col gap-4'>
                    <Animate index={1}>{<ProgressBarCard />}</Animate>
                    <Animate index={2}>{<PriorityAndCategoryCard />}</Animate>{/** 우선순위, 카테고리로 필터링 */}
                    <Animate index={3}>{<DateRangeSelect />}</Animate>{/** 기간으로 생성한 todo 필터링 */}
                </div>
            </div>
        </section>
    )
}

export default Deashboard