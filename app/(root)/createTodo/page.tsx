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
        <section className=" w-full ">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField // 제목
                        control={form.control}
                        name="todoTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>제목</FormLabel>
                                <FormControl>
                                    <Input placeholder="제목" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-300" />
                            </FormItem>
                        )}
                    />
                    <FormField // 내용
                        control={form.control}
                        name="todoDescription"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2.5">
                                <FormLabel className="text-16 font-bold  ">일정 내용</FormLabel>
                                <FormControl>
                                    <Textarea className=" " placeholder="일정 내용" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-300" />
                            </FormItem>
                        )}
                    />
                    {/* 날짜 */}
                    <DateTimePickerWithRange date={date} setDate={setDate} />
                    {/* 우선순위, 카테고리 */}
                    <PriorityAndCategorySelector todoState={todoState} setTodoState={setTodoState} type='create' />
                    {/* 진행상황 */}
                    {/* <div>
                        <Label className="text-nowrap">
                            진행 상황 설정 : {value}%
                        </Label>
                        <Slider defaultValue={value} max={100} step={1} onValueChange={(newValue) => setValue(newValue)} />
                    </div> */}
                    <TagInput tags={tags} setTags={setTags} />
                    <AttachmentFile onUploadComplete={async (uploadFunc) => { handleUpload = uploadFunc; }} />
                    {/* 추가할 것  리마인더  */}
                    <Button type="submit">
                        {!isLoading ? (<div>Submit</div>) : (
                            <div className=" flex-center font-medium ">
                                Uploading
                                <Loader size={20} className="animate-spin ml-2" />
                            </div>)}
                    </Button>
                </form>
            </Form>

        </section>
    )
}
