import { TagInputProps } from '@/types/types';
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';



const TagInput: React.FC<TagInputProps> = ({ initialTags = [], tags, setTags }) => {
    const [tagInput, setTagInput] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const newTag = tagInput
                .split('#')
                .filter(tag => tag.trim() !== '')
                .map(tag => tag.trim());
            const updatedTags = [...new Set([...tags, ...newTag])];
            setTags(updatedTags);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
    };

    return (
        <div className="w-full ">
            <div className="mb-4">
                <input
                    type="text"
                    value={tagInput}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder="태그 입력 (예: #중요 #프로젝트 #회의)"
                    className="w-full px-3 py-2 border rounded-md"
                />
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="ml-1 text-blue-600 hover:text-blue-800">
                            &times;
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagInput;