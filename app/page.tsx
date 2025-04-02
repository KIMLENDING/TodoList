import Image from 'next/image'
import React from 'react'
import { sampleData } from '@/lib/smapleData'
import Calendar from '@/components/Calendar'
const page = () => {

    return (
        <section className='bg-black-7 w-full min-h-screen mx-auto'>
            <nav>
                <div className='flex justify-between items-center py-4 px-8  text-white bg-black-7 border-b-[1px] border-zinc-800'>
                    <div className='flex flex-row items-center gap-3'>
                        <Image src={'/icons/logo.svg'} width={100} height={100} alt='logo' className='h-8 w-8' />
                        <div className=' h-7 w-[1px] bg-zinc-600' />
                        <h1 className='text-2xl font-bold'>Todo</h1>
                    </div>
                    <div className='flex space-x-4 text-sm' >
                        <button className='bg-black-7 hover:bg-white-1/10 text-white-1 border-[1px] py-1 px-2 rounded-md border-zinc-800 transition-colors duration-300'>Login</button>
                        <button className='bg-white-1 hover:bg-white-1/70 text-black-7 border-[1px] py-1 px-2 rounded-md border-zinc-800 transition-colors duration-300'>Sign Up</button>
                    </div>
                </div>
            </nav>
            <div>
                <p className='text-gray-500'>당신의 계획을 기록를 도와주는 Todo List</p>
            </div>

            <div className='flex flex-col gap-6 w-96 p-4 text-black-1 group '>
                <div className='relative w-full h-[2px] bg-zinc-500/50 
                after:content-[""] after:absolute after:w-0 after:h-[2px] group-hover:after:w-full group-hover:after:bg-white-1 after:top-0 after:left-0  after:transition-all after:ease-in-out after:duration-500'/>
                <div>
                    <div className='aspect-video bg-zinc-600 animate-pulse rounded-xl shadow-md'>
                    </div>
                </div>
            </div>
            <div className='  max-w-[420px]'>
                <Calendar monthTodos={sampleData} date={'2024-09'} sample={true} />
                <div className='px-5 text-base font-medium text-zinc-500'>
                    <h2 className='text-white-1 text-2xl font-semibold'>캘린더</h2>
                    <p>색상의 진함으로 당일 일과의 완료 비율을 알 수 있음</p>
                    <p>진행 및 실패 일과 비율이 많으면 연한 색상으로 표시</p>
                </div>
            </div>


        </section>
    )
}

export default page