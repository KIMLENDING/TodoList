'use client';
import LoaderSpinner from '@/components/LoaderSpinner';
import RoutineComponent from '@/components/Routine/Routine'
import { api } from '@/convex/_generated/api';
import useRoutineStore, { Routines } from '@/store/Routine';

import { useMutation, useQuery } from 'convex/react';
import React, { useEffect } from 'react'

const RoutinePage = () => {
    const { mockData } = useRoutineStore();
    const Routines = useQuery(api.routines.getUserRoutines) as Routines[];
    const setRoutines = useMutation(api.routines.setRoutines);
    useEffect(() => {
        const updateRoutines = async () => {
            // Check if mockData has valid data before updating
            if (mockData && mockData.length > 0) {
                try { // 덮어쓰기를 하기위해 서버에서 추가된 부분은 삭제

                    const filteredData = mockData.map(({ user, _creationTime, _id, authorId, ...rest }) => rest);
                    await setRoutines({ mockData: filteredData });
                } catch (error) {
                    console.error("Error updating routines:", error);
                }
            }
        };
        updateRoutines();
    }, [mockData]);
    if (!Routines) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <LoaderSpinner />
            </div>);
    }
    return (
        <div>
            <RoutineComponent routineData={Routines} />
        </div>
    )
}

export default RoutinePage