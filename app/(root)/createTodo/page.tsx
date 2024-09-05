"use client"

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';;
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { DateRange } from "react-day-picker"
import { TodoState, UploadResult } from "@/types/types";

import AttachmentFile from "@/components/createTodo/AttachmentFile";
import TagInput from "@/components/createTodo/TagInput";
import PriorityAndCategorySelector from "@/components/createTodo/PriorityAndCategorySelector";
import DateTimePickerWithRange from '@/components/createTodo/DateTimePickerWithRange';
const formSchema = z.object({
    todoTitle: z.string().min(2).max(50),
    todoDescription: z.string().min(0).max(200),
})

export default function CreateTodo() {
    const [todoState, setTodoState] = useState<TodoState>({
        priority: "",
        category: "",
    });
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const [tags, setTags] = useState<string[]>([]);
    const [value, setValue] = useState([0]);
    const [isLoading, setIsLoading] = useState(false);
    let handleUpload: () => Promise<UploadResult>; // 업로드 핸들러
    const createTodo = useMutation(api.todos.createTodo);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            todoTitle: "",
            todoDescription: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
        if (handleUpload) {
            const { urls, storageIds, types, names } = await handleUpload();
            try {
                await createTodo({
                    ...todoState,
                    todoTitle: data.todoTitle,
                    todoDescription: data.todoDescription,
                    dueDate: { from: Number(date?.from), to: Number(date?.to) },
                    tags: tags,
                    progress: value[0],
                    attachments: {
                        attachmentUrls: urls,
                        attachmentid: storageIds,
                        attachmentTypes: types,
                        attachmentNames: names,
                    }
                });
                form.reset();
                setTodoState({ priority: "", category: "" });
                setDate({ from: undefined, to: undefined });
                setTags([]);
                setValue([0]);

                toast({ title: 'todo생성 성공' });
            } catch (error) {
                console.error(error);
                toast({ title: 'todo생성 실패', variant: 'destructive' });
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <section className="mt-10 pb-10 w-full flex flex-col gap-4 overflow-y-auto no-scrollbar">
            <div className='h-full' style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>TODO 작성</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="todoTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-16 font-bold">제목</FormLabel>
                                            <FormControl>
                                                <Input placeholder="제목" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-300" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="todoDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-16 font-bold">설명</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="설명" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-300" />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-2">
                                    <FormLabel className="text-16 font-bold">기간</FormLabel>
                                    <DateTimePickerWithRange date={date} setDate={setDate} />
                                </div>
                                <PriorityAndCategorySelector
                                    todoState={todoState}
                                    setTodoState={setTodoState}
                                    type="create"
                                />
                                <div className="space-y-2">
                                    <FormLabel>Tags</FormLabel>
                                    <TagInput tags={tags} setTags={setTags} />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>첨부파일</FormLabel>
                                    <AttachmentFile onUploadComplete={async (uploadFunc) => { handleUpload = uploadFunc; }} />
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <div className=" flex-center font-medium ">
                                            Creating...
                                            <Loader size={20} className="animate-spin ml-2" />
                                        </div>) : 'Create Todo'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
