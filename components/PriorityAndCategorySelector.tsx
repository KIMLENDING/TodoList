import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriorityAndCategorySelectorProps, TodoState } from '@/types/types';



const prioritys = ['상', '중', '하'];
const categorys = ['개인', '업무', '학습', '기타'];

export default function PriorityAndCategorySelector({ todoState, setTodoState }: PriorityAndCategorySelectorProps) {
    const handleStateChange = (key: keyof TodoState, value: string) => {
        setTodoState((prevState: TodoState) => ({
            ...prevState,
            [key]: value
        }));
    };

    return (
        <div className="flex flex-row gap-5 border border-red-400">
            <div className="flex flex-row items-center border border-red-400">
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
                        {prioritys.map((priority) => (
                            <SelectItem className="capitalize" key={priority} value={priority}>
                                {priority}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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
                        {categorys.map((category) => (
                            <SelectItem className="capitalize" key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}