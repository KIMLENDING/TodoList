import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

import Link from 'next/link'
import TextScrolling from './TextScrolling'
import { Badge } from './ui/badge'
import TodoControls from './TodoCompletion'
import { Progress } from './ui/progress'
import { format } from 'date-fns'

import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

const TodoCard = ({ todo, index }: any) => {

    const formatDateRange = (from: number, to?: number) => {
        if (isNaN(from)) {
            return '';
        }
        if (!to) {
            return format(from, "y/LL/dd HH:mm");
        }
        const from1 = new Date(from);
        const to1 = new Date(to);
        const compareYear = from1.getFullYear() === to1.getFullYear();
        const compareMonth = from1.getMonth() === to1.getMonth();
        const compareDay = from1.getDate() === to1.getDate();
        if (compareYear && compareMonth && compareDay) {
            return format(from, "y/LL/dd HH:mm") + ' - ' + format(to, " HH:mm");
        } else if (compareYear && compareMonth) {
            return format(from, "y/LL/dd HH:mm") + ' - ' + format(to, "dd HH:mm");
        } else if (compareYear) {
            return format(from, "y/LL/dd HH:mm") + ' - ' + format(to, "LL/dd HH:mm");
        }
        return format(from, "y/LL/dd HH:mm") + ' - ' + format(to, "y/LL/dd HH:mm");
    }

    function convertToPercentage(isCompleted: string, fromTimestamp?: number, toTimestamp?: number) {
        if (isCompleted === '완료') {
            return 100;
        }
        if (!fromTimestamp || !toTimestamp || isCompleted === '실패') {
            return 0;
        }
        // 전체 구간 (to - from) 계산
        const currentTimestamp = Date.now();
        const totalDuration = toTimestamp - fromTimestamp;

        // 현재 타임스탬프가 fromTimestamp부터 얼마나 진행되었는지 계산
        const progress = currentTimestamp - fromTimestamp;

        // 백분율 계산 (0% ~ 100%)
        const percentage = Math.round((progress / totalDuration) * 1000) / 10;
        if (percentage === 100) {
            // 완료 표시 업데이트 db에 패치 해줘야함
        }

        if (percentage > 100) {
            return 100;
        }
        if (percentage < 0) {
            return 0;
        }
        return percentage;
    }
    const attachmentUrls = (urls: string[]) => {
        if (urls.length === 0) {
            return '첨부파일 ' + 0 + '개';
        }
        return '첨부파일 ' + urls.length + '개';
    }
    const { ref, inView } = useInView({ // inView는 해당 요소가 화면에 보이는지 여부를 알려준다.
        threshold: 0.2, // 0.2는 20%가 화면에 보일 때 inView가 true가 된다.
        triggerOnce: true, // 한번만 실행되게 한다.
    })
    return (
        <section ref={ref} className='w-full '>
            <section className={cn(
                'reveal xScrollbars mx-auto  flex w-full  flex-col gap-4 overflow-y-scroll  p-1',
                {
                    'animate-rotate': index! % 2 !== 0 && inView, // 해당 달이 홀수 달일 때 rotate 애니메이션 실행 6도에서 0도로 각도가 돌아옴
                    'animate-rotateAlt': index! % 2 === 0 && inView, // 해당 달이 짝수 달일 때 rotateAlt 애니메이션 실행 -6도에서 0도로 각도가 돌아옴
                },
            )}>

                <Card className='w-full flex flex-col bg-[#1f1f1f] text-white-1 border-none'>
                    <CardHeader>
                        <div className='flex flex-col'>
                            <div className='flex flex-row gap-4 justify-between items-center'>
                                <Link href={`/dashboard/todos/${todo._id}`} className="flex-1 min-w-0"> {/* min-w-0: 최소 너비 0 기본은 auto라서 자식요소의 공간을 최대한 확보하려 하기 때문에 자식요소가 커지는 것을 방지*/}
                                    <CardTitle className="flex-1 overflow-hidden">
                                        <TextScrolling text={todo.todoTitle} />
                                    </CardTitle>
                                </Link>
                                <div className="flex-shrink-0"> {/* 요소 크기 유지 */}
                                    <Badge variant={todo.isCompleted !== '완료' ? (todo.isCompleted === '진행중' ? "secondary" : "destructive") : "completed"}>
                                        <TodoControls isCompleted={todo.isCompleted} todoId={todo._id} />
                                    </Badge>
                                </div>
                            </div>
                            <CardDescription className='truncate'>{todo.todoDescription}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2'>
                        <div>
                            {todo.dueDate?.from ? (todo.dueDate.to ? (<>
                                기간: {formatDateRange(todo.dueDate?.from!, todo.dueDate?.to!)}
                            </>) : (<>
                                {formatDateRange(todo.dueDate?.from!)}
                            </>)) : (<>생성 일자: {formatDateRange(todo._creationTime)}</>)}
                        </div>
                        <div className='flex gap-2'>
                            {todo.category && <div className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center'>
                                {todo.category}
                            </div>}
                            {todo.priority && <div className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center'>
                                {todo.priority}
                            </div>}
                        </div>
                        <div className='flex justify-between items-center gap-2'>
                            <Progress title={todo.isCompleted} value={convertToPercentage(todo.isCompleted, todo.dueDate?.from, todo.dueDate?.to)} />
                            {convertToPercentage(todo.isCompleted, todo.dueDate?.from, todo.dueDate?.to)}%
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-end items-center'>
                        <div>{todo.attachments ? attachmentUrls(todo.attachments.attachmentUrls!) : ""}</div>
                    </CardFooter>
                </Card>
            </section>
        </section>
    )
}

export default TodoCard