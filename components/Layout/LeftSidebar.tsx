"use client";
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';


const LeftSidebar = () => {
    const { isSignedIn, user } = useUser();
    const updateTodoState = useMutation(api.todos.updateCompleted);
    const resetRoutines = useMutation(api.routines.resetRoutines);
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    useEffect(() => {
        if (isSignedIn && user) {
            // 사용자가 로그인 되었을 때 실행할 코드
            updateTodoState({ userId: user.id }); // 완료된 Todo 항목 업데이트
            resetRoutines({ routeId: pathname }); // 루틴 완료 여부 초기화
        }
    }, [isSignedIn, user]);
    return (
        <section className='left_sidebar'>
            <nav>
                <Link href='/dashboard' className='flex cursor-pointer items-center gap-3 pb-10 max-lg:justify-center'>
                    <div className='border-2 rounded-md'>
                        <Image src='/icons/logo.svg' alt='menu icon' width={34} height={34} />
                    </div>
                    <h1 className='pt-2 text-[28px] font-extrabold  max-lg:hidden'>TODO</h1>
                </Link>
                {sidebarLinks.map(({ route, label, imgURL, component }) => {
                    const isActive = pathname === route || pathname.startsWith(`/dashboard/${route}/`);
                    return <Link href={route} key={label}
                        className={cn('flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start', {
                            'bg-nav-focus border-r-4 border-blue-300': isActive
                        })}>
                        {/* <Image src={imgURL} alt={label} width={24} height={24} /> */}
                        {React.createElement(component)}
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