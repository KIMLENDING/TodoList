"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/useDebouncd';
import { Input } from '../ui/input';

const Searchbar = () => {
    const [search, setSearch] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (debouncedSearch) {
            router.push(`/todos?search=${search}`)
        } else if (!debouncedSearch && pathname === '/todos') {
            router.push('/todos')
        }
    }, [router, debouncedSearch, pathname])

    return (
        <div className='relative mt-8 block '>
            <Input className=' py-1 pl-12 max-sm:h-8 max-sm:pl-8'
                placeholder='검색'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onLoad={() => setSearch('')}
            />
            <Image
                src="/icons/search.svg"
                width={20}
                height={20}
                alt='search'
                className='absolute top-2.5 left-4 max-sm:top-1.5 max-sm:left-2'
            />
        </div>
    )
}

export default Searchbar