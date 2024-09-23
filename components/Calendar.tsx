'use client';
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import useClickOutside from '@/hooks/useClickOutside'
import 'dayjs/locale/ko';
import dayjs from 'dayjs'
import { cn } from '@/lib/utils';
import TextBlock from '@/components/TextBlock';
import Tooltip from '@/components/Tooltip';

interface CalendarProps {
    monthTodos: any[];
    date: any;
}

const Calendar = ({ monthTodos, date }: CalendarProps) => {

    console.log(date)

    const [calBgColor, setCalBgColor] = useState(0) // 캘린더 배경 색
    const [takeover, setTakeover] = useState(false) // 타일 클릭 시 타일 내용을 보여주는 창
    const [clip, setClip] = useState(false) // 요소의 내용이 넘치면 숨김 처리
    const [loadIn, setLoadIn] = useState(true) // 타일의 초기 애니메이션
    const [activeTileIndex, setActiveTileIndex] = useState<number | null>(null); // 현재 활성화된 타일의 인덱스

    // 타일 생성

    const setDate = new Date(date)

    const getYear = setDate.getFullYear()
    const getMonth = setDate.getMonth()

    const currentYear = dayjs().year(getYear!) // 년도 가져오기
    const currentMonth = dayjs(currentYear).month(getMonth!) // 월 가져오기 0~11

    const monthStartDay =
        ((dayjs(currentMonth).startOf('month').day()))  // (일,월,화,수,목,금,토) 0~6 (0,1,2,3,4,5,6) 
    const blankTiles = Array.from({ length: monthStartDay }) // 빈 타일 만들기
    const monthDays = dayjs().month(getMonth! || 0).daysInMonth() // 해당 월의 일 수
    const tiles = Array.from({ length: monthDays }) // 해당 월의 타일 만들기

    // 동작 함수
    const clickOutsideRef = useClickOutside(() => { // 해당 요소 외부를 클릭하면 실행
        console.log('clickOutsideRef')
        setTakeover(false)
        setClip(false)
        setCalBgColor(0)
        setActiveTileIndex(null)
    })

    const { ref, inView } = useInView({ // inView는 해당 요소가 화면에 보이는지 여부를 알려준다.
        threshold: 0.2, // 0.2는 20%가 화면에 보일 때 inView가 true가 된다.
        triggerOnce: true, // 한번만 실행되게 한다.
    })
    const handleClip = () => {
        // 타일의 컨텐츠가 일정 시간이 지나면 클리핑되도록 설정
        setTimeout(() => {
            setClip(true)
        }, 500)
    }

    const handleLoadIn = () => {
        // 타일의 초기 애니메이션 - 초기 로딩 상태를 false로 변경
        setTimeout(() => {
            setLoadIn(false)
        }, 1200)
    }

    useEffect(() => {
        handleLoadIn()
    }, [])


    // 받아온 할 일 정보를 일별로 분류
    const groupByDate = (todos: any) => {
        return todos.reduce((acc: { [date: string]: any[] }, todo: any) => {
            const creationDate = new Date(todo._creationTime).toLocaleDateString('ko-KR');
            const dateonly = creationDate.split('.')[2];
            if (!acc[dateonly]) {
                acc[dateonly] = [];
            }
            acc[dateonly].push(todo);
            return acc;
        }, {});
    };
    const groupedByDate: { [date: string]: any[] } = groupByDate(monthTodos || []); // 일별 할 일 정보를 받아서 일별로 할 일을 분류한다.


    // 완료 비율 계산
    const getCompletionRate = (todos: any) => {
        const completedTodos = todos.filter((todo: any) => todo.isCompleted === '완료')
        const completionRate = Math.floor((completedTodos.length / todos.length) * 100)
        return completionRate
    }

    // 완료비율 계산
    const bgColors = (rate: number) =>
        // rate가 0이면 zinc-800, 1~20이면 emerald-400, 21~40이면 teal-400, 41~60이면 sky-400, 61~80이면 blue-400, 81~100이면 violet-400
        cn({
            'bg-zinc-800': rate === 0,
            'bg-emerald-100': rate >= 1 && rate <= 20,
            'bg-emerald-300': rate >= 21 && rate <= 40,
            'bg-emerald-500': rate >= 41 && rate <= 60,
            'bg-emerald-600': rate >= 61 && rate <= 80,
            'bg-emerald-700': rate >= 81 && rate <= 100,
        })
    return (
        <section ref={ref} className='w-full'>
            <section
                className={cn(
                    'reveal xScrollbars mx-auto my-10 flex w-full max-w-sm flex-col gap-4 overflow-y-scroll rounded-3xl bg-zinc-800 p-7 shadow-xl',
                    bgColors(calBgColor),
                    {
                        'animate-rotate': getMonth! % 2 !== 0 && inView, // 해당 달이 홀수 달일 때 rotate 애니메이션 실행 6도에서 0도로 각도가 돌아옴
                        'animate-rotateAlt': getMonth! % 2 === 0 && inView, // 해당 달이 짝수 달일 때 rotateAlt 애니메이션 실행 -6도에서 0도로 각도가 돌아옴
                    },
                )}
                ref={clickOutsideRef}
            >
                <h2 className="reveal -mt-2 animate-revealSm text-sm font-bold tracking-wider text-zinc-300">
                    {dayjs().locale('ko').month(getMonth! || 0).format('MMMM')}
                </h2>
                <div className="grid w-full grid-cols-7 gap-2 ">
                    {/* 해당 달의 빈 타일 */}
                    {blankTiles.map((_, index) => (
                        <div
                            className={cn(
                                'h-8 w-full rounded-lg bg-zinc-700/15 transition-all duration-300 min-[400px]:h-10',
                                {
                                    'invisible opacity-0 delay-0 duration-0': takeover,
                                },
                            )}
                            key={index}
                        />
                    ))}
                    {/* 해당 달의 타일에 내용이 있을 때 자세한 내용을 보여주는 창 takeover가 true일 때*/}
                    {tiles.map((_, index) => {
                        const dayData = Object.entries(groupedByDate).find(([date]) => Number(date) === index + 1)?.[1]; // 해당 날짜의 할 일 정보
                        const isActive = activeTileIndex === index // 활성화된 타일은 더 큰 크기로 렌더링됨
                        return (
                            <div key={index}
                                className={cn({
                                    'scaleFade animate-scaleFade': loadIn,
                                })}
                                style={{
                                    animationDelay: `${index / 50 + 0.04}s`,
                                }}>
                                {takeover && isActive && (
                                    <div
                                        className={cn(
                                            'absolute left-0 top-0 z-50 flex h-max min-h-full w-full animate-fadeSm flex-col',
                                            bgColors(getCompletionRate(dayData) === 0 ? 1 : getCompletionRate(dayData)),
                                        )}
                                    >
                                        <div className="sticky -top-7 z-10 animate-revealSm pl-2 pt-2">
                                            <button
                                                className="z-50 block w-max rounded-full bg-white-1 px-3 py-1.5 font-bold tracking-wide text-zinc-600 shadow-md transition-transform active:scale-90 sm:hover:scale-90 sm:active:scale-75"
                                                onClick={() => {
                                                    setTakeover(false)
                                                    setActiveTileIndex(null)
                                                    setClip(false)
                                                    setCalBgColor(0)
                                                }}
                                            >
                                                back
                                            </button>
                                        </div>
                                        <ul className="relative my-2 flex w-full flex-col gap-2 odd:*:animate-rotateAlt even:*:animate-rotate">
                                            {/* 내용이 있을 때 */}
                                            {dayData?.map(
                                                ({ todoTitle, _id, isCompleted }) => (
                                                    <div key={_id}>
                                                        <TextBlock todoTitle={todoTitle} isCompleted={isCompleted} _id={_id} />
                                                    </div>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}
                                {/* 타일 생성 */}
                                {dayData ? (
                                    <div
                                        className={cn('group/tooltip relative delay-100', {
                                            'invisible opacity-0 delay-0': takeover && !isActive,
                                            'overflow-clip': clip,
                                        })}
                                    >{/** 일정이 있는 타일 생성 */}
                                        <Tooltip text={String(index + 1)} state={takeover} />
                                        <button
                                            onClick={() => {
                                                setTakeover(true)
                                                handleClip()
                                                setActiveTileIndex(index)
                                                setTimeout(() => {
                                                    setCalBgColor(getCompletionRate(dayData) === 0 ? 1 : getCompletionRate(dayData))
                                                }, 400)
                                            }}
                                            className={cn(
                                                'block h-8 w-full rounded-lg transition-all duration-150 hover:scale-90 active:scale-75 min-[400px]:h-10',
                                                bgColors(getCompletionRate(dayData) === 0 ? 1 : getCompletionRate(dayData)),
                                                {
                                                    'scale-[20] cursor-default duration-300 hover:scale-[20] active:scale-[20]':
                                                        isActive && takeover,
                                                },
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={cn('group/tooltip relative delay-100')}
                                    >  {/* 일정이 없는 타일 생성 */}
                                        <Tooltip text={String(index + 1)} state={false} />
                                        <div
                                            className={cn(
                                                'h-8 w-full rounded-lg bg-zinc-700/50 transition-all delay-100 duration-300 min-[400px]:h-10',
                                                {
                                                    'invisible opacity-0 delay-0 duration-0': takeover,
                                                },
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

        </section>
    )
}

export default Calendar