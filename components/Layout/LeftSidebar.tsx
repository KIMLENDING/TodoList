"use client";
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import { cn } from '@/lib/utils';


const LeftSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    return (
        <section className='left_sidebar'>
            <nav>
                <Link href='/' className='flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center'>
                    <h1 className='text-[24px] font-extrabold text-white-1 max-lg:hidden'>TODO</h1>
                </Link>
                {sidebarLinks.map(({ route, label, imgURL }) => {
                    const isActive = pathname === route || pathname.startsWith(`${route}/`);
                    return <Link href={route} key={label}
                        className={cn('flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start', {
                            'bg-nav-focus border-r-4 border-blue-300': isActive
                        })}>
                        <Image src={imgURL} alt={label} width={24} height={24} />
                        <p>{label}</p>
                    </Link>
                })}
            </nav>
            <SignedOut>
                <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
                    <Button asChild className='text-[16px] w-full bg-blue-400 font-extrabold'>
                        <Link href='/sign-in'>로그인</Link>
                    </Button>
                </div>
            </SignedOut>
            <SignedIn>
                <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
                    <Button className='text-[16px] w-full bg-blue-400 font-extrabold' onClick={() => signOut(() => router.push('/'))}>
                        로그아웃
                    </Button>
                </div>
            </SignedIn>
        </section>
    )
}

export default LeftSidebar