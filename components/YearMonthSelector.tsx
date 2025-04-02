import React from 'react';
import { startOfYear, endOfYear } from 'date-fns';
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'
import { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface YearSelectorProps {
    onDateChange: (dateRange: DateRange) => void;
}

export default function YearSelector({ onDateChange }: YearSelectorProps) {
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    })
    const currentDate = new Date();
    const [date, setDate] = React.useState<DateRange>({
        from: startOfYear(currentDate),
        to: endOfYear(currentDate),
    });
    const [selectedYear, setSelectedYear] = React.useState(currentDate.getFullYear());

    const handleYearSelect = (value: string) => {
        const year = parseInt(value);
        setSelectedYear(year);
        updateDateRange(year);
    };

    const updateDateRange = (year: number) => {
        const firstDay = startOfYear(new Date(year, 0, 1));
        const lastDay = endOfYear(new Date(year, 0, 1));
        const newDateRange = { from: firstDay, to: lastDay };
        setDate(newDateRange);
        onDateChange(newDateRange);  // 상위 컴포넌트에 날짜 범위 전달
    };

    const years = Array.from({ length: 2100 - 2024 + 1 }, (_, i) => 2024 + i);

    React.useEffect(() => {
        onDateChange(date);  // 컴포넌트 마운트 시 초기 날짜 범위 전달
    }, []);

    return (

        <div className={cn(
            'reveal sticky top-5 z-10 mx-auto rounded-full bg-white-1 px-3 py-1 text-xs font-bold text-zinc-500 first-of-type:mt-10 max-w-[120px] ',
            { 'animate-revealSm': inView },
        )}
            ref={ref}>
            <Select onValueChange={handleYearSelect} value={selectedYear.toString()} >
                <SelectTrigger className='  focus:ring-0 focus:ring-white-1 border-0'>
                    <SelectValue placeholder="년도 선택" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            {year}년
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

    );
}

// import React, { useEffect, useState } from 'react';
// import { startOfMonth, endOfMonth, format } from 'date-fns';
// import { ko } from 'date-fns/locale';
// import { DateRange } from 'react-day-picker';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// interface YearMonthSelectorProps {
//     onDateChange: (dateRange: DateRange) => void;
// }

// export default function YearMonthSelector({ onDateChange }: YearMonthSelectorProps) {
//     const currentDate = new Date();
//     const [date, setDate] = useState<DateRange>({
//         from: startOfMonth(currentDate),
//         to: endOfMonth(currentDate),
//     });
//     const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
//     const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

//     const handleYearSelect = (value: string) => {
//         const year = parseInt(value);
//         setSelectedYear(year);
//         updateDateRange(year, selectedMonth);
//     };

//     const handleMonthSelect = (value: string) => {
//         const month = parseInt(value);
//         setSelectedMonth(month);
//         updateDateRange(selectedYear, month);
//     };

//     const updateDateRange = (year: number, month: number) => {
//         const selectedDate = new Date(year, month - 1, 1);
//         const firstDay = startOfMonth(selectedDate);
//         const lastDay = endOfMonth(selectedDate);
//         const newDateRange = { from: firstDay, to: lastDay };
//         setDate(newDateRange);
//         onDateChange(newDateRange);  // 상위 컴포넌트에 날짜 범위 전달
//     };

//     const years = Array.from({ length: 2100 - 2024 + 1 }, (_, i) => 2024 + i);
//     const months = Array.from({ length: 12 }, (_, i) => i + 1);

//     useEffect(() => {
//         onDateChange(date);  // 컴포넌트 마운트 시 초기 날짜 범위 전달
//     }, []);

//     return (
//         <div className="flex flex-col items-start gap-4">
//             <div className="flex gap-4">
//                 <Select onValueChange={handleYearSelect} value={selectedYear.toString()}>
//                     <SelectTrigger className="w-[120px]">
//                         <SelectValue placeholder="년도 선택" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {years.map((year) => (
//                             <SelectItem key={year} value={year.toString()}>
//                                 {year}년
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>

//                 <Select onValueChange={handleMonthSelect} value={selectedMonth.toString()}>
//                     <SelectTrigger className="w-[120px]">
//                         <SelectValue placeholder="월 선택" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {months.map((month) => (
//                             <SelectItem key={month} value={month.toString()}>
//                                 {format(new Date(2021, month - 1, 1), 'M월', { locale: ko })}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             </div>

//             {date.from && date.to && (
//                 <div>
//                     선택된 기간: {format(date.from, 'yyyy년 M월 d일', { locale: ko })} - {format(date.to, 'yyyy년 M월 d일', { locale: ko })}
//                 </div>
//             )}
//         </div>
//     );
// }