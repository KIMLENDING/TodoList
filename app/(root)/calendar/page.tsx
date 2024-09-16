'use client';
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useClickOutside from '@/hooks/useClickOutside'
import { DateRange } from 'react-day-picker';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import 'dayjs/locale/ko';

import YearMonthSelector from '@/components/YearMonthSelector';
import dayjs from 'dayjs'
import { cn } from '@/lib/utils';
import TextBlock from '@/components/TextBlock';
import Tooltip from '@/components/Tooltip';
import Calendar from '@/components/Calendar';
import Tag from '@/components/Tag';
import { format } from 'date-fns';
const CalendarPage = () => {
    // 날짜 선택 + 유저 정보 + 해당 날짜의 할 일 정보
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const { user } = useUser();
    const getTodosByDay = useQuery(api.todos.getTodosByDay, { date: { from: Number(date?.from), to: Number(date?.to) }, userId: user?.id });
    // console.log(getTodosByDay)
    const handleDateChange = (dateRange: DateRange) => {
        setDate(dateRange); // 날짜 범위 업데이트
    };
    console.log(date?.from)
    // 받아온 할 일 정보를 일별로 분류
    const groupByMonth = (todos: any) => {
        // 월을 미리 설정 (01월부터 12월까지)
        const year = date?.from ? dayjs(date.from).format('YYYY') : dayjs().format('YYYY');
        const months: { [month: string]: any[] } = {
            [`${year}-01`]: [],
            [`${year}-02`]: [],
            [`${year}-03`]: [],
            [`${year}-04`]: [],
            [`${year}-05`]: [],
            [`${year}-06`]: [],
            [`${year}-07`]: [],
            [`${year}-08`]: [],
            [`${year}-09`]: [],
            [`${year}-10`]: [],
            [`${year}-11`]: [],
            [`${year}-12`]: []
        };

        return todos.reduce((acc: { [month: string]: any[] }, todo: any) => {
            const creationDate = new Date(todo._creationTime).toLocaleDateString('ko-KR');
            const monthonly = creationDate.split('.')[1].trim().padStart(2, '0'); // 월 추출 및 두 자릿수로 변환
            const year_month = year + '-' + monthonly;
            if (!acc[year_month]) {
                acc[year_month] = [];
            }
            // 해당 월에 할 일 추가
            acc[year_month].push(todo);
            return acc;
        }, months); // 빈 월 배열이 포함된 객체를 초기값으로 설정
    };

    const groupedByDate: { [month: string]: any[] } = groupByMonth(getTodosByDay || []); // 일별 할 일 정보를 받아서 일별로 할 일을 분류한다.
    console.log(groupedByDate)
    return (
        <div>
            <div className='mt-10 w-full flex flex-col gap-4 overflow-y-auto no-scrollbar'>
                <YearMonthSelector onDateChange={handleDateChange} />
                <Tag year={format(date?.from! || new Date(), 'yyyy')} />
                <div className="w-full grid grid-cols-1 xl:grid-cols-2  2xl:grid-cols-3  auto-rows-max">
                    {Object.keys(groupedByDate).map((year_month) => (
                        <div key={year_month}>
                            {groupedByDate[year_month].length > 0 ? (
                                <Calendar monthTodos={groupedByDate[year_month]} date={year_month} />
                            ) : (
                                <Calendar monthTodos={groupedByDate[year_month]} date={year_month} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CalendarPage