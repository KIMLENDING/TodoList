"use client"
import { format, setHours, setMinutes } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { DateTimePickerWithRangeProps } from "@/types/types"
import { useState } from "react"

export default function DateTimePickerWithRange({ date, setDate, checked = false }: DateTimePickerWithRangeProps) {
    const [allDay, setAllDay] = useState(checked);
    const [time, setTime] = useState({
        from_hours: 0,
        from_minutes: 0,
        to_hours: 0,
        to_minutes: 0,
    });

    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        if (selectedDate?.from) {
            if (allDay) { // 대시보드 컴포넌트에서 사용되는 달력일 때 또는 하루종일이 체크되어있을 때
                const newFrom = setHours(setMinutes(selectedDate.from, 0), 0)
                const newTo = selectedDate.to ? setHours(setMinutes(selectedDate.to!, 59), 23) : setHours(setMinutes(selectedDate.from, 59), 23)
                setDate({ from: newFrom, to: newTo })
            } else {
                const newFrom = setHours(setMinutes(selectedDate.from, time.from_minutes), time.from_hours)
                const newTo = selectedDate.to
                    ? setHours(setMinutes(selectedDate.to, time.to_minutes), time.to_hours)
                    : newFrom
                setDate({ from: newFrom, to: newTo })
            }
        } else {
            setDate(selectedDate)
        }
    }

    const handleTimeChange = (timeStr: string, isFrom: boolean) => {
        const [hours, minutes] = timeStr.split(':').map(Number)
        if (isFrom) {
            setTime(prevTime => ({ ...prevTime, from_hours: hours, from_minutes: minutes }))
        } else {
            setTime(prevTime => ({ ...prevTime, to_hours: hours, to_minutes: minutes }))
        }
        setDate(prevDate => {
            if (!prevDate?.from) return prevDate
            const newDate = { ...prevDate }
            const dateToUpdate = isFrom ? newDate.from : (newDate.to || newDate.from)
            const updatedDate = setHours(setMinutes(dateToUpdate!, minutes), hours)
            if (isFrom) {
                newDate.from = updatedDate
                if (!newDate.to || updatedDate > newDate.to) {
                    newDate.to = updatedDate
                }
            } else {
                newDate.to = updatedDate
            }
            return newDate
        })
    }


    const handleClick = () => {
        setAllDay(!allDay); // 하루 종일 체크박스 클릭시
        if (!allDay) { // setAllDay가 false일때 실행 true로 바꿀 때 실행 되는 거임 
            //(state가 비동기라서 바로 allDay가 true로 바뀌지 않음) 
            //{업데이터 함수 사용하고  if문은 useEffect로 처리함면됨 }
            setDate(prevDate => {
                if (!prevDate?.from) return prevDate
                // const newDate = { ...prevDate }
                const newFrom = setHours(setMinutes(prevDate.from, 0), 0)
                const newTo = setHours(setMinutes(prevDate.to!, 59), 23)
                return { from: newFrom, to: newTo }
            }) // 하루 종일 체크박스 클릭시 00:00 ~ 23:59로 변경
        }
    }
    const compareYear = date?.from?.getFullYear() === date?.to?.getFullYear();
    const compareMonth = date?.from?.getMonth() === date?.to?.getMonth();
    const compareDay = date?.from?.getDate() === date?.to?.getDate();
    return (
        <div className="flex">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            " justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (compareYear && compareMonth && compareDay ? (<>{format(date.from, "y/LL/dd HH:mm")} -{" "}
                                {format(date.to, " HH:mm")}</>) : (
                                <>
                                    {format(date.from, "y/LL/dd HH:mm")} -{" "}
                                    {format(date.to, "y/LL/dd HH:mm")}
                                </>)
                            ) : (
                                format(date.from, "y/LL/dd HH:mm")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                    />
                    <div className="flex justify-end space-x-2 p-3">
                        <div className="flex items-center gap-1">
                            <Checkbox id="terms1" checked={allDay} onClick={handleClick} />
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                하루 종일
                            </label>
                        </div>{!allDay && <>
                            <Input
                                type="time"
                                value={date?.from ? format(date.from, "HH:mm") : ""}
                                onChange={(e) => handleTimeChange(e.target.value, true)}
                                className="w-[120px]"
                            />
                            <Input
                                type="time"
                                value={date?.to ? format(date.to, "HH:mm") : ""}
                                onChange={(e) => handleTimeChange(e.target.value, false)}
                                className="w-[120px]"
                            />
                        </>
                        }
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}