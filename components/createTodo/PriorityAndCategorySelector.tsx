import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriorityAndCategorySelectorProps, TodoState } from '@/types/types';

const priorities = ['상', '중', '하'];
const categories = ['개인', '업무', '학습', '기타'];

export default function PriorityAndCategorySelector({ todoState, setTodoState }: PriorityAndCategorySelectorProps) {
    const [initialized, setInitialized] = useState(false);
    // 초기화 로직을 useEffect에서 처리하여 첫 렌더링 시 상태 초기화를 방지
    useEffect(() => {
        setInitialized(true);
    }, [initialized]);

    const handleStateChange = (key: keyof TodoState, value: string) => {
        // 
        if (initialized) { // 초기화가 완료된 후에만 상태 변경
            setTodoState((prevState: TodoState) => ({
                ...prevState,
                [key]: value
            }));
        }
    };
    if (!initialized) {
        // 초기 상태가 완전히 설정될 때까지 컴포넌트를 렌더링하지 않음
        // 이것 때문에 초기 렌더링시 handleStateChange가 실행되는 것을 방지
        return null;
    }
    return (
        <div className="flex flex-row gap-4 ">
            <div className="flex flex-row items-center">
                <Label className="text-16 font-bold text-nowrap">
                    카테고리:
                </Label>
                <Select
                    onValueChange={(value: string) => handleStateChange('category', value)}
                    value={todoState.category}
                >
                    <SelectTrigger className="w-full border-none text-16 font-bold">
                        <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent className="border-none">
                        {categories.map((category) => (
                            <SelectItem className="capitalize" key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-row items-center ">
                <Label className="text-16 font-bold text-nowrap">
                    우선순위:
                </Label>
                <Select
                    onValueChange={(value: string) => { handleStateChange('priority', value); console.log('value:', value, 'todos:', todoState); }}
                    value={todoState.priority}
                >
                    <SelectTrigger className="w-full border-none text-16 font-bold">
                        <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent className="border-none">
                        {priorities.map((priority) => (
                            <SelectItem className="capitalize" key={priority} value={priority}>
                                {priority}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

/** 랜더링 방식에 대해 공부가 더 필요함
    *    상위 컴포넌트에서 값을 {priority: '', category: ''}이렇게 받아오면 handleStateChange가 실행되지 않음
    *    하지만 {priority: '상', category: ''}  이런식을 값이 존재하면 handleStateChange가 실행됨 왜 그런거지?
    *    이유를 알았다!! onValueChange 이놈이 범인임
    *    <Select> 컴포넌트의 values는 초기에 항상 {priority: '', category: ''}값을 가지고 있음
    *    <Select> 이놈도 랜더링을 유발하는 뭔가 있는 것 같음
    *    처음 모든 랜더링시 todoState={priority: '', category: ''}가 기본값임 
    *    그래서 부모컴포넌트에서 {priority: '', category: ''}으로 전달하면 handleStateChange가 실행되지 않음 하지만
    *    {priority: '상', category: ''} 이런식으로 전달하면 handleStateChange가 실행됨 문제는 value값이 '상'이 아니라 '' 이라는 것임 
    *    그 타이밍엔 todoState={priority: '', category: ''} 이런 상태임 이러고 그 후에 부모에서 {priority: '상', category: ''} 이걸 받아옴 
    *    근데 setTodoState이게 실행이 되네 그럼 '상'이 ''으로 바뀜 
    *    - 즉 todoState을 완전히 가져온 후에 랜더링을 하면 select는 {priority: '상', category: ''}이걸 초기 값으로 가지게 되는 거지
    * 
    *    그래서 '상' 값이 setTodoState가 실행되어 ''로 바뀌어 버리는 것임 
    *    해결 책으로 initialized를 사용하여 부모컴포넌트에서 todoState가 완전히 설정되었을 때만 렌더링하도록 함
    *    이렇게 되면 상태 업데이트가 꼬이지 않음
   */