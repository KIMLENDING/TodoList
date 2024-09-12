"use client";
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useMutation } from "convex/react";
import { Id } from '@/convex/_generated/dataModel'

import { useEffect, useState } from "react";
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
import { format } from "date-fns"
import LoaderSpinner from '@/components/LoaderSpinner';
import TagInput from "@/components/createTodo/TagInput";
import AttachmentFile from "@/components/createTodo/AttachmentFile";
import DateTimePickerWithRange from '@/components/createTodo/DateTimePickerWithRange';
import PriorityAndCategorySelector from "@/components/createTodo/PriorityAndCategorySelector";
import Image from 'next/image';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';


interface PageProps {
    params: {
        id: Id<'todos'>;
    };
}

const formSchema = z.object({
    todoTitle: z.string().min(2).max(50),
    todoDescription: z.string().min(0).max(200),
})

const TodoDetail = ({ params }: PageProps) => {
    const todoData = useQuery(api.todos.getTodo, { id: params.id });
    const router = useRouter();
    const [todoState, setTodoState] = useState<TodoState>({
        priority: "",
        category: "",
    });
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    let handleUpload: () => Promise<UploadResult>; // 업로드 핸들러
    const updateTodo = useMutation(api.todos.updateTodo);

    useEffect(() => {
        if (todoData) {
            const todo = todoData;
            if (todo) {
                setTodoState({ priority: todo.priority || '', category: todo.category || '' });
                setTags(todo.tags || []);
                if (todo.dueDate?.from && todo.dueDate?.to) {
                    const fromdate = new Date(todo.dueDate?.from);
                    const todate = new Date(todo.dueDate?.to);
                    setDate({ from: fromdate, to: todate });
                } else {
                    setDate({ from: undefined, to: undefined });
                }
                form.reset({
                    todoTitle: todo.todoTitle, // 받아온 데이터로 폼 필드 업데이트
                    todoDescription: todo.todoDescription,
                });
            }
        }
    }, [todoData]);

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
            if (todoData) {
                const { _creationTime, user, author, authorId, authorImageUrl, ...todo } = todoData;
                console.log(todo);
                console.log(todo.isCompleted);
                try {
                    await updateTodo({
                        ...todo,
                        todoTitle: data.todoTitle,
                        todoDescription: data.todoDescription,
                        dueDate: { from: Number(date?.from), to: Number(date?.to) },
                        tags: tags,
                        category: todoState.category,
                        priority: todoState.priority,
                        attachments: {
                            attachmentUrls: [...(todo?.attachments?.attachmentUrls ?? []), ...urls],
                            attachmentid: [...(todo?.attachments?.attachmentid ?? []), ...storageIds],
                            attachmentTypes: [...(todo?.attachments?.attachmentTypes ?? []), ...types],
                            attachmentNames: [...(todo?.attachments?.attachmentNames ?? []), ...names],
                        },
                        isCompleted: todo.isCompleted,
                        completedAt: todo.completedAt,
                    });
                    toast({ title: 'todo 업데이트 성공' });
                    router.push('/todos');
                } catch (error) {
                    console.error(error);
                    toast({ title: 'todo 업데이트 실패', variant: 'destructive' });
                    setIsLoading(false);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    }
    const handleattach = (attachObj: any): React.ReactNode => {
        const { attachmentUrls, attachmentTypes, attachmentNames, attachmentid } = attachObj;

        // 이미지와 링크를 각각 구분하여 배열로 저장
        const images = attachmentTypes
            .map((type: string, index: number) => (
                type.includes('image') ? (
                    <Image key={`image-${index}`} src={attachmentUrls[index]}
                        alt={attachmentid[index]} width={512} height={512}
                        className="rounded-md h-[256px]" />
                ) : null
            ))
            .filter((image: any) => image !== null);

        const links = attachmentTypes
            .map((type: string, index: number) => (
                !type.includes('image') ? (
                    <Link className='flex hover:underline' key={`link-${index}`} href={attachmentUrls[index]}>
                        {attachmentNames[index]}
                    </Link>
                ) : null
            ))
            .filter((link: any) => link !== null);

        // 이미지와 링크가 없을 때 빈 요소를 반환
        if (images.length === 0 && links.length === 0) {
            return <></>;
        }

        return (
            <div className='flex flex-col gap-2'>
                {/* 이미지 */}
                {images.length > 0 && (
                    <div className=' gap-4 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3'>
                        {images}
                    </div>
                )}
                {/* 링크 */}
                {links.length > 0 && (
                    <div className='flex flex-col gap-2'>
                        {links}
                    </div>
                )}
            </div>
        );
    };

    if (!todoData) return <LoaderSpinner />;

    return (
        <section className="mt-10 w-full flex flex-col gap-4 overflow-y-auto no-scrollbar">
            <div className='h-full' style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                <Card className="w-full "> {/* TODO 수정 max-w-2xl mx-auto*/}
                    <CardHeader className='flex flex-row justify-between'>
                        <CardTitle>TODO 수정</CardTitle>
                        <div className='flex flex-row group'>
                            <div className='text-16 font-bold'>작성일</div>
                            <div className='flex pr-1'>: {format(todoData._creationTime, "y/LL/dd ")} </div>
                            <div className='hidden group-hover:block'>- {format(todoData._creationTime, "hh:mm")}</div>
                        </div>

                    </CardHeader>
                    <CardContent>
                        <Form {...form} >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField // 제목
                                    control={form.control}
                                    name="todoTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-16 font-bold" >제목</FormLabel>
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
                                        <FormItem>
                                            <FormLabel className="text-16 font-bold">일정 내용</FormLabel>
                                            <FormControl>
                                                <Textarea className=" " placeholder="일정 내용" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-red-300" />
                                        </FormItem>
                                    )}
                                />
                                <div className="space-y-4">
                                    <FormLabel className="text-16 font-bold">기간</FormLabel>
                                    <DateTimePickerWithRange date={date} setDate={setDate} />
                                </div>
                                {/* 우선순위, 카테고리 */}
                                <PriorityAndCategorySelector todoState={todoState} setTodoState={setTodoState} />
                                <div className="space-y-2">
                                    <FormLabel className="text-16 font-bold">Tags</FormLabel>
                                    <TagInput tags={tags} setTags={setTags} />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel className="text-16 font-bold">첨부파일</FormLabel>
                                    <AttachmentFile onUploadComplete={async (uploadFunc) => { handleUpload = uploadFunc; }} />
                                </div>
                                <div className='space-y-2' >
                                    <Label className="text-16 font-bold">기존 첨부파일</Label>
                                    <div className='border-black-3 border-2 rounded-sm p-4 overflow-y-auto ' style={{ maxHeight: 'calc(50vh - 10rem)' }}>
                                        {todoData.attachments && handleattach(todoData.attachments)}
                                    </div>
                                </div>
                                <div className="flex w-full h-full items-end justify-end">
                                    <Button type="submit">
                                        {!isLoading ? 'Update' : (
                                            <div className=" flex-center font-medium ">
                                                Updating...
                                                <Loader size={20} className="animate-spin ml-2" />
                                            </div>)}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default TodoDetail