import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriorityAndCategorySelectorProps, TodoState } from '@/types/types';

const priorities = ['상', '중', '하'];
const categories = ['개인', '업무', '학습', '기타'];

export default function PriorityAndCategorySelector({ todoState, setTodoState, type }: PriorityAndCategorySelectorProps) {

    const [initialized, setInitialized] = useState(false);
    // 초기화 로직을 useEffect에서 처리하여 첫 렌더링 시 상태 초기화를 방지
    useEffect(() => {
        if (!initialized && todoState.category && todoState.priority) {
            setInitialized(true);
        }
        if (type === 'create') {
            setInitialized(true);
        }
    }, [todoState, initialized, type]);

    const handleStateChange = (key: keyof TodoState, value: string) => {
        if (initialized) {
            setTodoState((prevState: TodoState) => ({
                ...prevState,
                [key]: value
            }));
        }
    };

    if (!initialized) {
        // 초기 상태가 완전히 설정될 때까지 컴포넌트를 렌더링하지 않음
        return null;
    }

    return (
        <div className="flex flex-row gap-4 ">
            <div className="flex flex-row items-center">
                <Label className="text-nowrap">
                    카테고리:
                </Label>
                <Select
                    onValueChange={(value: string) => handleStateChange('category', value)}
                    value={todoState.category}
                >
                    <SelectTrigger className="w-full border-none">
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
                <Label className="text-nowrap">
                    우선순위:
                </Label>
                <Select
                    onValueChange={(value: string) => handleStateChange('priority', value)}
                    value={todoState.priority}
                >
                    <SelectTrigger className="w-full border-none">
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