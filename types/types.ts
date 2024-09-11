import { Id } from "@/convex/_generated/dataModel";
import { DateRange } from "react-day-picker";

export interface Todo {
    todo: {
        _id: Id<'todos'>;
        user: Id<'users'>;
        todoTitle: string;
        todoDescription?: string;
        dueDate?: {
            from?: number;
            to?: number;
        };
        author: string;
        authorId: string;
        authorImageUrl: string;

        attachments?: {
            attachmentUrls?: string[];
            attachmentid?: Id<'_storage'>[];
            attachmentTypes?: string[];
            attachmentNames?: string[];
        };

        priority?: string;
        category?: string;
        tags?: string[];

        reminder?: number;
        repeatType?: string;
        progress?: number;

        isCompleted: string;
        completedAt?: number;
        _creationTime: number;
    }
};

export interface EmptyStateProps {
    title: string;
    search?: boolean;
    buttonText?: string;
    buttonLink?: string;
}

export interface UploadResult {
    urls: string[]; // 업로드된 파일의 URL 리스트
    storageIds: Id<"_storage">[]; // 업로드된 파일의 storageId 리스트
    types: string[]; // 업로드된 파일의 타입 리스트
    names: string[]; // 업로드된 파일의 이름 리스트
}
export interface TodoState {
    priority: string;
    category: string;
}

export interface PriorityAndCategorySelectorProps {
    todoState: TodoState;
    setTodoState: React.Dispatch<React.SetStateAction<TodoState>>;
}
export interface AttachmentFileProps {
    onUploadComplete: (uploadFunc: () => Promise<UploadResult>) => Promise<void>;
}

export interface TagInputProps {
    initialTags?: string[];
    tags: string[];
    setTags: (tags: string[]) => void;
}

export interface DateTimePickerWithRangeProps {
    date: DateRange | undefined
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
    checked?: boolean
}