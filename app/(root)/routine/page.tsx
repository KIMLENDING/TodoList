'use client';
import LoaderSpinner from '@/components/LoaderSpinner';
import RoutineComponent from '@/components/Routine/Routine'
import { api } from '@/convex/_generated/api';
import useRoutineStore, { Routines } from '@/store/Routine';

import { useMutation, useQuery } from 'convex/react';
import React, { useEffect, useRef, useState } from 'react'

const RoutinePage = () => {
    const { mockData } = useRoutineStore();
    const Routines = useQuery(api.routines.getUserRoutines) as Routines[];
    const setRoutines = useMutation(api.routines.setRoutines);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        const updateRoutines = async () => {
            console.log('Routines', Routines);
            console.log('mockData', mockData);
            console.log('서버에서 가져온 루틴 데이터 업로드 하는 useEffect');
            // Check if mockData has valid data before updating
            if (JSON.stringify(mockData) === JSON.stringify(Routines)) {
                console.log('루틴 데이터가 서버에서 가져온 데이터와 같을 경우');
                return;
            } // 루틴 데이터가 서버에서 가져온 데이터와 같을 경우
            if (mockData && mockData.length > 0) {
                try { // 덮어쓰기를 하기위해 서버에서 추가된 필드 부분은 삭제
                    console.log('루틴 데이터 업로드');
                    const filteredData = mockData.map(({ user, _creationTime, _id, authorId, ...rest }) => rest);
                    await setRoutines({ mockData: filteredData });
                } catch (error) {
                    console.error("Error updating routines:", error);
                    if (isMounted.current) {
                        setError("Failed to update routines. Please try again later.");
                    }
                }
            }
        };
        updateRoutines();
        return () => {
            isMounted.current = false;
        };
    }, [mockData,]);
    if (!Routines) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <LoaderSpinner />
            </div>);
    }
    return (
        <div>
            {error && <div className="error-message">{error}</div>}
            <RoutineComponent routineData={Routines} />
        </div>
    );
}

export default RoutinePage