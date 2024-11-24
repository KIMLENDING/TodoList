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
            console.log('서버에서 가져온 루틴 데이터 업로드 하는 useEffect');
            // 루틴 데이터가 서버에서 가져온 데이터와 같을 경우
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
    }, [mockData]); // 의존성 배열에 Routines를 추가 하지 않는 이유는 무한 랜더링이 발생함  
    /**
     * 이유는 setRoutines가 업데이트 되면 useQuery가 다시 실행되고 그럼 Routines가 변경됨 그럼 useEffect가 다시 실행됨 이걸 무한 반복함 여기서 
     *  if (JSON.stringify(mockData) === JSON.stringify(Routines)) 이걸로 해결하려 했지만 첫랜더링 시엔 mockData와 Routines가 같지만 
     * 한번 서버에 업데이트 되면 mockData의 변경된 순서와 내용은 Rutines와 같지만  생성시간과 _id가 다르기 때문에  해결이 안됨 
     * 그래서 의존성 배열에 Routines를 추가하지 않음 
     * 어차피 서버에 저장된 순서와 내용은 클라이언트와 같기 때문에 Routines를 의존성 배열에 추가하지 않아도 됨
     * 

     */
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