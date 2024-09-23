
"use client";
import { cn } from '@/lib/utils';
import { useEffect, useLayoutEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import { chunkArray } from '@/lib/DargAndDropUtil';

import { useRef } from 'react';
import AddRoutines from './AddRoutines';
import EditRoutines from './EditRoutines';
import EditRoutine from './EditRoutine';
import AddRoutine from './AddRoutine';
import useRoutineStore, { Routine, Routines } from '../../store/Routine';
import { useInView } from 'react-intersection-observer';


// const initialMockData: Routines[] = Array.from({ length: 10 }, (_, index) => ({
//     _id: `mock-${index}`,
//     indexDB: index,
//     title: `언제 ${index} - ${['아침', '점심', '저녁'][Math.floor(Math.random() * 3)]}`, // Random time of day
//     description: `내용 ${index + 1}`,
//     type: ['아침', '점심', '저녁'].filter(() => Math.random() > 0.5) || ['아침'], // Randomly include times
//     routine: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, routineIndex) => ({
//         _id: `routine-${index}-${routineIndex}`,
//         indexDB: routineIndex,
//         title: `언제 ${index} 할일 ${routineIndex} `,
//         description: `언제 ${index} 내용 테스트 ${routineIndex} `,
//         completed: Math.random() > 0.5 // Randomly mark some as completed
//     }))
// }));

interface RoutineComponentProps {
    routineData: any[]
}
const RoutineComponent = ({ routineData = [] }: RoutineComponentProps) => {
    // const [mockData, setMockData] = useState<Routines[]>(mockData2);
    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true,
    })
    const { mockData, setMockData } = useRoutineStore();
    useEffect(() => {
        setMockData(routineData);
    }, []);
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    }); // 윈도우 사이즈
    const [maxItemsPerRow, setmaxItemsPerRow] = useState(4);// 한 행당 최대 아이템 수 설정

    const [enabled, setEnabled] = useState(false); // 드래그 앤 드롭 활성화 여부

    const [selectedRoutineId, setSelectedRoutineId] = useState(''); // 선택된 routine Id or 호버된 아이디
    const [selectedRsId, setSelectedRsId] = useState(''); // 선택된 부모요소 routines id -즉 부모 컴포넌트 선택

    const [edit, setEdit] = useState(false); // 자식 수정 모드
    const [edit2, setEdit2] = useState(false); // 부모 수정, 추가 모드
    const [addRoutine, setAddRoutine] = useState(false);// 할일 추가 모드

    const [title, setTitle] = useState(''); // 제목
    const [description, setDescription] = useState(''); // 설명

    const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // 스크롤 할 요소 오브젝트 key값은 부모요소의 _id_
    const [scrollToId, setScrollToId] = useState<string | null>(null); // 스크롤 할 아이디 값은 부모요소의 _id_
    const [hoverId, setHoverId] = useState(''); // 호버된 아이디
    const [hoverIdP, setHoverIdP] = useState(''); // 호버된 아이디

    console.log('onDragEnd가 실행된 후 리랜더링 하여 chunkedMockData를 다시 생성하여 레이아웃을 고쳐줌',);
    const chunkedMockData = chunkArray(mockData, windowSize.width, maxItemsPerRow); // 최대 너비에 따라 배열을 나눔

    useLayoutEffect(() => { // dom이 로드되기 전에 실행
        const initialSize = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        setWindowSize(initialSize);

        // 윈도우 리사이즈 이벤트 핸들러
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // 리사이즈 이벤트 등록
        window.addEventListener('resize', handleResize);

        // 컴포넌트가 언마운트될 때 이벤트 제거
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // 창 크기에 따라 grid 최대 아이템 수 변경
        if (windowSize.width < 1174) {
            setmaxItemsPerRow(1);
        } else if (windowSize.width >= 1174 && windowSize.width < 1896) {
            console.log('maxItemsPerRow', windowSize.width);
            if (windowSize.width >= 1280 && windowSize.width < 1484) {
                console.log('max');
                setmaxItemsPerRow(1);
            } else {
                setmaxItemsPerRow(2);
            }

        }
        else if (windowSize.width >= 1896 && windowSize.width < 2308) {
            setmaxItemsPerRow(3);
        }
        else {
            setmaxItemsPerRow(4);
        }
    }, [windowSize]);

    useEffect(() => {
        // routine 추가시 해당 부모 컨테이너 스크롤 아래로 이동
        if (scrollToId && scrollRefs.current[scrollToId]) {
            scrollRefs.current[scrollToId]!.scrollTop = scrollRefs.current[scrollToId]!.scrollHeight;
            setScrollToId(null);
        }
    }, [scrollToId, mockData]);

    // --- requestAnimationFrame 초기화
    useEffect(() => {
        // 드래그 앤 드롭 활성화 이거 안하면 오류 발생
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);

    const onDragEnd = ({ source, destination, type }: DropResult) => {
        if (!destination) return;
        if (type === 'GROUP') {
            // 그룹 이동 로직 - 부모 컴포넌트 (루틴s)
            // 행간 이동을 위한 인덱스
            // row-0, row-1, row-2, row-3, row-4, row-5, row-6, row-7, row-8, row-9 ...
            console.log(source.droppableId,);
            const sourceChunkIndex = parseInt(source.droppableId.split('-')[1]); // 이전 행 인덱스
            const destChunkIndex = parseInt(destination.droppableId.split('-')[1]); // 이후 행 인덱스

            const newMockData = Array.from(mockData); // 복사본 생성
            const chunkedMockData = chunkArray(newMockData, windowSize.width, maxItemsPerRow); // 최대 너비에 따라 배열을 나눔 [[],[],[],...] 형태

            const [movedItem] = chunkedMockData[sourceChunkIndex].splice(source.index, 1); // 이전 행에서 아이템을 제거
            chunkedMockData[destChunkIndex].splice(destination.index, 0, movedItem); // 이후 행에서 아이템을 추가

            const flattenedMockData = chunkedMockData.flat(); // 다시 1차원 배열로 변환 후 인덱스 재설정
            flattenedMockData.forEach((item: any, index: any) => {
                item.indexDB = index;
            });
            setMockData(flattenedMockData); // 업데이트
        } else if (type === 'ITEM') {
            // 아이템 이동 로직 - 자식 컴포넌트 (루틴)
            //  자식 Droppable의 아이디는 routine-[Routins_id_] 형태
            const sourceKey = source.droppableId; // 이전 자식 Droppable의 routine-[Routins_id_]
            const destinationKey = destination.droppableId; // 이후 자식 Droppable의 routine-[Routins_id_]

            const _items = JSON.parse(JSON.stringify(mockData)) as typeof mockData;
            const sourceColumn = _items.find((item) => item.dndId === sourceKey.replace('routine-', '')); // 이전 부모 요소(Routins)의 _id_로 routine이 존재하는 Routins 객체 찾기
            const destinationColumn = _items.find((item) => item.dndId === destinationKey.replace('routine-', '')); // 이후 부모 요소(Routins)의 _id_로 routine이 이동 할 Routins 객체 찾기

            if (sourceColumn && destinationColumn) {
                const sourceRoutine = sourceColumn.routineItmes?.splice(source.index, 1); // 이전 부모 요소에서 아이템 제거
                destinationColumn.routineItmes?.splice(destination.index, 0, ...sourceRoutine!); // 이후 부모 요소에서 아이템 추가

                if (sourceColumn.routineItmes) {     // 이전 부모 요소의 indexDB 재설정
                    sourceColumn.routineItmes.forEach((routine, index) => {
                        routine.indexDB = index;
                    });
                }
                if (destinationColumn.routineItmes) {    // 이후 부모 요소의 indexDB 재설정
                    destinationColumn.routineItmes.forEach((routine, index) => {
                        routine.indexDB = index;
                    });
                }
                setMockData(_items);    // 업데이트
            }
        }
    };

    if (!enabled) { // 드래그 앤 드롭 활성화 전에는 렌더링 하지 않음 (오류 방지)
        return null;
    }
    return (
        <div className='flex flex-col mx-auto mt-10'>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={cn(
                    'reveal sticky top-5 z-10 mx-auto rounded-full pb-8 text-zinc-500  ',
                    { 'animate-revealSm': inView },
                )} ref={ref}>
                    <AddRoutines addRoutine={addRoutine} setAddRoutine={setAddRoutine} edit2={edit2}
                        setEdit2={setEdit2} title={title} setTitle={setTitle} description={description}
                        setDescription={setDescription}
                    />
                </div>
                <div className='mx-auto'>
                    {chunkedMockData.map((chunk: Routines[], chunkIndex: number) => (
                        <Droppable droppableId={`row-${chunkIndex}`} direction='horizontal' key={chunkIndex} type="GROUP">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn("flex flex-wrap gap-4 w-full justify-start ", maxItemsPerRow === 1 ? 'py-4' : 'h-[480px] py-1')}
                                >
                                    {chunk.map((Data: Routines, index2: number) => (
                                        <Draggable key={Data.dndId} draggableId={Data.dndId} index={index2} >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="w-[380px]"
                                                >
                                                    <Droppable droppableId={`routine-${Data.dndId}`} type="ITEM">
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.droppableProps}
                                                                onMouseEnter={() => { setHoverIdP(Data.dndId) }} // 호버시 아이디 설정
                                                                onMouseLeave={() => { setHoverIdP('') }} // 호버시 아이디 해제
                                                                className={cn(
                                                                    ' max-w-[380px]  flex flex-col gap-3 rounded-xl p-4 active:ring-1 active:ring-yellow-200 bg-[#1F1F1F] transition-all group duration-700 hover:ring-1 hover:ring-yellow-200',
                                                                    snapshot.isDraggingOver ? 'shadow-lg shadow-gray-400' : '',

                                                                    'h-fit',
                                                                    edit2 && selectedRsId === Data.dndId ? ' ring-1 ring-yellow-200' : ' ring-0 ring-transparent' // 부모 수정 모드일때
                                                                )}
                                                            >
                                                                <EditRoutines
                                                                    hoverIdP={hoverIdP}
                                                                    edit2={edit2} setEdit2={setEdit2} title={title}
                                                                    setTitle={setTitle} description={description}
                                                                    setDescription={setDescription} selectedRsId={selectedRsId}
                                                                    setSelectedRsId={setSelectedRsId} Data={Data}
                                                                />

                                                                <div
                                                                    ref={(el) => { scrollRefs.current[Data.dndId] = el }}
                                                                    className='flex flex-col gap-3 h-full max-h-[285px] overflow-y-auto p-1 '
                                                                > {/**자식 리스트 */}
                                                                    <div className='flex flex-col gap-3  h-full '>
                                                                        {Data.routineItmes?.map((routine: Routine, index: number) => (
                                                                            <Draggable key={routine.dndId} draggableId={routine.dndId} index={index} >
                                                                                {(provided, snapshot) => (
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        onMouseEnter={() => { setHoverId(routine.dndId) }} // 호버시 아이디 설정
                                                                                        onMouseLeave={() => { setHoverId('') }} // 호버시 아이디 해제
                                                                                        className={cn(
                                                                                            "rounded-lg bg-[#1F1F1F] p-4 hover:ring-1 hover:ring-yellow-200  duration-300 transition-all ",
                                                                                            snapshot.isDragging
                                                                                                ? 'bg-opacity-90 shadow-lg shadow-gray-400'
                                                                                                : 'shadow shadow-[#272727]', // 드래그 중일때
                                                                                            edit && selectedRoutineId === routine.dndId ? 'ring-1 ring-yellow-200' : 'ring-0 ring-transparent' // 자식(루틴) 수정 모드일때
                                                                                        )}
                                                                                    >
                                                                                        <EditRoutine
                                                                                            hoverId={hoverId}
                                                                                            edit={edit} setEdit={setEdit} title={title}
                                                                                            setTitle={setTitle} description={description}
                                                                                            setDescription={setDescription}
                                                                                            selectedRoutineId={selectedRoutineId}
                                                                                            setSelectedRoutineId={setSelectedRoutineId}

                                                                                            routineItmes={routine}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                </div>
                                                                <AddRoutine
                                                                    addRoutine={addRoutine} setAddRoutine={setAddRoutine} title={title}
                                                                    setTitle={setTitle} description={description} setDescription={setDescription}
                                                                    selectedRsId={selectedRsId} setSelectedRsId={setSelectedRsId}
                                                                    Data={Data}
                                                                    setScrollToId={setScrollToId}
                                                                />
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}

export default RoutineComponent;
