"use client";
import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants/index'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { Button } from '../ui/button';



const MobileNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    return (
        <section>
            <Sheet>
                <SheetTrigger>
                    <Image src="/icons/menu.svg" width={34} height={34}
                        alt='menu' className='cursor-pointer'
                    />
                </SheetTrigger>
                <SheetContent side="left"
                    className='border-none bg-black-1 text-white-1'>
                    <Link href='/' className='flex cursor-pointer items-center gap-1 pb-10 '>
                        <Image src='/icons/logo.svg' alt='logo' width={32} height={32} />
                        <h1 className='text-[24px] font-extrabold text-white-1 ml-2'>TODO</h1>
                    </Link>
                    <div className='flex h-[clac(100vh - 72px)] flex-col justify-between overflow-y-auto'>
                        <SheetClose asChild>
                            <nav className='flex h-full flex-col gap-6 text-white-1'>
                                {sidebarLinks.map(({ route, label, imgURL }) => {
                                    const isActive = pathname === route || pathname.startsWith(`${route}/`);
                                    return <SheetClose asChild key={route}>
                                        <Link href={route}
                                            className={cn('flex gap-3 items-center py-4 max-lg:px-4 justify-start', {
                                                'bg-nav-focus border-r-4  ': isActive
                                            })}>
                                            <Image src={imgURL} alt={label} width={24} height={24} />
                                            <p>{label}</p>
                                        </Link>
                                    </SheetClose>
                                })}
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
                            </nav>

                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav