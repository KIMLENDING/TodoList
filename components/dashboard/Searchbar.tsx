"use client";
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/useDebouncd';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

const Searchbar = () => {
    const [search, setSearch] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch) {
            router.push(`/dashboard/todos?search=${search}`)
        } else if (!debouncedSearch && pathname === '/dashboard/todos') {
            router.push('/dashboard/todos')
        }
    }, [router, debouncedSearch, pathname])

    return (
        <div className='relative mt-8 block rounded-3xl shadow-xl'>
            <Input className=' py-1 pl-12 max-sm:h-8 max-sm:pl-8 rounded-3xl'
                placeholder='검색'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onLoad={() => setSearch('')}
            />
            <Search width={20} height={20} className=' absolute top-2.5 left-4 max-sm:top-1.5 max-sm:left-2' />

        </div>
    )
}

export default Searchbar