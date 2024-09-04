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

export default function DateTimePickerWithRange({ date, setDate }: DateTimePickerWithRangeProps) {
    const [allDay, setAllDay] = useState(false);
    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        if (selectedDate?.from) {
            const newFrom = setHours(setMinutes(selectedDate.from, selectedDate.from.getMinutes()), selectedDate.from.getHours())
            const newTo = selectedDate.to
                ? setHours(setMinutes(selectedDate.to, selectedDate.to.getMinutes()), selectedDate.to.getHours())
                : newFrom
            setDate({ from: newFrom, to: newTo })
        } else {
            setDate(selectedDate)
        }
    }

    const handleTimeChange = (timeStr: string, isFrom: boolean) => {
        const [hours, minutes] = timeStr.split(':').map(Number)

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
            console.log("allDay---")
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
        <div className={cn("grid gap-2")}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
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