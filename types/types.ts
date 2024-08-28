import { Id } from "@/convex/_generated/dataModel";

export interface UploadResult {
    urls: string[]; // 업로드된 파일의 URL 리스트
    storageIds: Id<"_storage">[]; // 업로드된 파일의 storageId 리스트
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