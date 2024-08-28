"use client"

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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

import { addDays, format, set } from "date-fns"
import { CalendarIcon, Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label";
import { useState } from "react";
import TagInput from "@/components/TagInput";
import { Slider } from "@/components/ui/slider"

import AttachmentFile from "@/components/AttachmentFile";
import PriorityAndCategorySelector from "@/components/PriorityAndCategorySelector";
import { TodoState, UploadResult } from "@/types/types";

const formSchema = z.object({
  todoTitle: z.string().min(2).max(50),
  todoDescription: z.string().min(2).max(200),
  dateRange: z.object({
    from: z.date({
      required_error: "시작 날짜를 선택해주세요.",
    }),
    to: z.date({
      required_error: "종료 날짜를 선택해주세요.",
    }),
  }),
})

export default function Home() {
  const [todoState, setTodoState] = useState<TodoState>({
    priority: "",
    category: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [value, setValue] = useState([50]);
  const [isLoading, setIsLoading] = useState(false);
  let handleUpload: () => Promise<UploadResult>; // 업로드 핸들러
  const createTodo = useMutation(api.todos.createTodo);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todoTitle: "",
      todoDescription: "",
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 0),
      },
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (handleUpload) {
      const { urls, storageIds } = await handleUpload();
      try {
        await createTodo({
          ...todoState,
          todoTitle: data.todoTitle,
          todoDescription: data.todoDescription,
          dueDate: Number(data.dateRange.to),
          tags: tags,
          progress: value[0],
          attachmentUrls: urls,
          attachments: storageIds,
        });
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
    <section>
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
          <FormField // 날짜 범위
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>기간 선택</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "LLL dd, y")} -{" "}
                              {format(field.value.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field.value.from, "LLL dd, y")
                          )
                        ) : (
                          <span>날짜 범위를 선택하세요</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  날짜 범위를 선택하세요.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 우선순위, 카테고리 */}
          <PriorityAndCategorySelector todoState={todoState} setTodoState={setTodoState} />
          {/* 진행상황 */}
          <div>
            <Label className="text-nowrap">
              진행 상황 설정 : {value}%
            </Label>
            <Slider defaultValue={value} max={100} step={1} onValueChange={(newValue) => setValue(newValue)} />
          </div>
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
