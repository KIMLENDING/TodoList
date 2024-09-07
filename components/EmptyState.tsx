import { EmptyStateProps } from '@/types/types'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const EmptyState = ({ title, search = true, buttonLink, buttonText }: EmptyStateProps) => {
    return (
        <section className='flex-center size-full flex-col gap-3'>
            <Image
                src="/icons/rabbit.svg"
                width={250}
                height={250}
                alt='empty State'
            />
            <div className='flex-center w-full max-x-[254px] flex-col gap-3'>
                <h1 className="text-16 text-center font-medium ">{title}</h1>
                {search && (
                    <p className="text-16 text-center font-medium ">
                        원하는 정보를 찾기 위해 검색어를 조정해 보세요. <br />
                        또는 새로운 일정을 추가해보세요.
                    </p>
                )}
                {buttonLink && (
                    <Button >
                        <Link href={buttonLink} className='flex gap-2'>
                            <Image
                                src="/icons/pencil-line.svg"
                                width={20}
                                height={20}
                                alt='discover'
                            />
                            <h1 className='text-16 font-extrabold ' >{buttonText}</h1>
                        </Link>
                    </Button>
                )}
            </div>
        </section>
    )
}

export default EmptyState