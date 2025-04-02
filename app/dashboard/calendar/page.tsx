'use client';
import React, { useState } from 'react'
import { DateRange } from 'react-day-picker';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import 'dayjs/locale/ko';

import YearMonthSelector from '@/components/YearMonthSelector';
import dayjs from 'dayjs'

import Calendar from '@/components/Calendar';

const CalendarPage = () => {
    // 날짜 선택 + 유저 정보 + 해당 날짜의 할 일 정보
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const { user } = useUser();
    const getTodosByDay = useQuery(api.todos.getTodosByDay, { date: { from: Number(date?.from), to: Number(date?.to) }, userId: user?.id });
    console.log('getTodosByDay', getTodosByDay);
    const handleDateChange = (dateRange: DateRange) => {
        setDate(dateRange); // 날짜 범위 업데이트
    };

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

        return todos.reduce((months: { [month: string]: any[] }, todo: any) => {
            const creationDate = new Date(todo._creationTime).toLocaleDateString('ko-KR'); // 생성 날짜 추출
            const monthonly = creationDate.split('.')[1].trim().padStart(2, '0'); // 월 추출 및 두 자릿수로 변환 (ex. 4 -> 04)
            const year_month = year + '-' + monthonly;
            if (!months[year_month]) {
                months[year_month] = [];
            }
            // 해당 월에 할 일 추가
            months[year_month].push(todo);
            return months;
        }, months); // 빈 월 배열이 포함된 객체를 초기값으로 설정
    };

    const groupedByDate: { [month: string]: any[] } = groupByMonth(getTodosByDay || []); // 일별 할 일 정보를 받아서 일별로 할 일을 분류한다.

    return (
        <div>
            <YearMonthSelector onDateChange={handleDateChange} />
            <div className="w-full grid grid-cols-1 xl:grid-cols-2  2xl:grid-cols-3  auto-rows-max gap-4">
                {Object.keys(groupedByDate).map((year_month) => (
                    <div key={year_month}>
                        <Calendar monthTodos={groupedByDate[year_month]} date={year_month} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CalendarPage