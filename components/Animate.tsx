
import { cn } from '@/lib/utils'
import React from 'react'
import { useInView } from 'react-intersection-observer'

const Animate = ({
    children,
    index,
}: Readonly<{
    children: React.ReactNode;
    index: number;
}>) => {
    const { ref, inView } = useInView({ // inView는 해당 요소가 화면에 보이는지 여부를 알려준다.
        threshold: 0.2, // 0.2는 20%가 화면에 보일 때 inView가 true가 된다.
        triggerOnce: true, // 한번만 실행되게 한다.
    })
    return (
        <section ref={ref} className='w-full '>
            <section className={cn(
                'reveal xScrollbars mx-auto  flex w-full  flex-col gap-4 overflow-y-scroll rounded-3xl ',
                {
                    'animate-rotate': inView && index % 2 !== 0, // 해당 달이 홀수 달일 때 rotate 애니메이션 실행 6도에서 0도로 각도가 돌아옴
                    'animate-rotateAlt': inView && index % 2 === 0, // 해당 달이 짝수 달일 때 rotateAlt 애니메이션 실행 -6도에서 0도로 각도가 돌아옴
                },
            )}>
                {children}
            </section>
        </section>
    )
}

export default Animate