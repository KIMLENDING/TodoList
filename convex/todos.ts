import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// storageId를 사용하여 파일의 URL을 가져옵니다. 
export const getUrl = mutation({
    args: {
        storageId: v.id('_storage'),
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    }
})
// storageId를 사용하여 파일을 삭제합니다.
export const deleteById = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        return await ctx.storage.delete(args.storageId);
    },
});

// 모든 Todo 항목을 가져오는 쿼리
export const getAllTodos = query({
    handler: async (ctx) => {
        const todos = await ctx.db.query("todos").collect();
        return todos;
    },
});

// _id로 특정 Todo 항목을 가져오는 쿼리
export const getTodo = query({
    args: {
        id: v.id("todos"),
    },
    handler: async (ctx, args) => {
        const todo = await ctx.db.get(args.id);
        return todo;
    }
})

// 유저 로그인시 완료된 Todo 항목을 업데이트하는 뮤테이션
export const updateCompleted = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const todos = await ctx.db
            .query("todos")
            .filter((q) => q.eq(q.field("authorId"), args.userId))
            .collect();
        const startTime = Date.now(); //  처리 시간 계산
        todos.forEach(async (todo) => {
            const { from, to } = todo.dueDate || {};
            const isCompleted = todo.isCompleted;
            if (!from || !to) return;
            if (isCompleted === '진행중') {
                const currentTimestamp = Date.now();
                const totalDuration = to - from;
                // 현재 타임스탬프가 fromTimestamp부터 얼마나 진행되었는지 계산
                const progress = currentTimestamp - from;
                // 백분율 계산 (0% ~ 100%)
                const percentage = Math.round((progress / totalDuration) * 1000) / 10;
                if (percentage >= 100) {
                    // 완료 표시 업데이트 db에 패치 해줘야함
                    await ctx.db.patch(todo._id, { isCompleted: '완료' })
                }
            } else return;
        });
        const endTime = Date.now(); // 처리 시간 계산
        const executionTime = endTime - startTime; // 처리 시간 계산
        console.log(`Execution time: ${executionTime}ms`); // 처리 시간 계산
    }
});

// 특정 사용자의 Todo 항목을 가져오는 쿼리
export const getUserTodos = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const todos = await ctx.db
            .query("todos")
            .filter((q) => q.eq(q.field("authorId"), args.userId))
            .collect();
        return todos;
    },
});

// 새로운 Todo 항목을 생성하는 뮤테이션
export const createTodo = mutation({
    args: {
        todoTitle: v.string(), // todo 제목
        todoDescription: v.optional(v.string()), // todo 내용
        dueDate: v.optional(v.object({ from: v.optional(v.number()), to: v.optional(v.number()) })),
        attachments: v.optional(v.object({
            attachmentUrls: v.optional(v.array(v.string())), // 첨부파일 URL
            attachmentid: v.optional(v.array(v.id('_storage'))), // 첨부파일
            attachmentTypes: v.optional(v.array(v.string())), // 첨부파일 타입
            attachmentNames: v.optional(v.array(v.string())), // 첨부파일 이름
        })),
        priority: v.optional(v.string()), // 우선순위
        category: v.optional(v.string()), // 카테고리
        tags: v.optional(v.array(v.string())), // 태그
        reminder: v.optional(v.number()), // 리마인더 알림설정 (시간)
        repeatType: v.optional(v.string()), //  repeatType: '매일||매주||매달||매년' // 반복 설정
        progress: v.optional(v.number()),   // 진행 상황
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // 사용자 정보 가져오기
        if (!identity) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .collect();

        if (user.length === 0) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const todoId = await ctx.db.insert("todos", {
            ...args,
            user: user[0]._id,
            author: user[0].name,
            authorId: user[0].clerkId,
            authorImageUrl: user[0].imageUrl,
            isCompleted: '진행중',
        });
        return todoId;
    },
});

// Todo 항목을 업데이트하는 뮤테이션
export const updateTodo = mutation({
    args: {
        _id: v.id("todos"),
        todoTitle: v.optional(v.string()),
        todoDescription: v.optional(v.string()),
        dueDate: v.optional(v.object({ from: v.optional(v.number()), to: v.optional(v.number()) })),
        attachments: v.optional(v.object({
            attachmentUrls: v.optional(v.array(v.string())), // 첨부파일 URL
            attachmentid: v.optional(v.array(v.id('_storage'))), // 첨부파일
            attachmentTypes: v.optional(v.array(v.string())), // 첨부파일 타입
            attachmentNames: v.optional(v.array(v.string())), // 첨부파일 이름
        })),
        priority: v.optional(v.string()),
        category: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        reminder: v.optional(v.number()),
        repeatType: v.optional(v.string()), //  repeatType: '매일||매주||매달||매년' // 반복 설정
        progress: v.optional(v.number()),
        isCompleted: v.string(), // 완료 여부 // 완료, 진행중, 실패
        completedAt: v.optional(v.number()), // 완료 시간 (시간)
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // 사용자 정보 가져오기

        if (!identity) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .collect();

        if (user.length === 0) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const { _id, ...updateFields } = args;
        await ctx.db.patch(_id, updateFields);
    },
});

// Todo 항목의 완료 상태를 업데이트하는 뮤테이션
export const updateTodoCompletion = mutation({
    args: {
        id: v.id("todos"),
        isCompleted: v.string() // '완료' || '진행중' || '실패'
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // 사용자 정보 가져오기

        if (!identity) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .collect();
        if (user.length === 0) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const todo = await ctx.db.get(args.id);

        if (!todo) throw new Error("Todo not found");
        await ctx.db.patch(args.id, {
            isCompleted: args.isCompleted,
            completedAt: args.isCompleted !== '진행중' ? Date.now() : undefined
        });
    },
});

// Todo 항목을 삭제하는 뮤테이션
export const deleteTodo = mutation({
    args: { id: v.id("todos") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // 사용자 정보 가져오기
        if (!identity) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .collect();
        if (user.length === 0) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const todo = await ctx.db.get(args.id);
        if (!todo) throw new Error("Todo not found");

        // 첨부 파일 삭제
        const attachments = todo.attachments || {};
        const storageIds = attachments.attachmentid || [];
        storageIds.map(async (storageId) => {
            await deleteById(ctx, { storageId });
        })
        await ctx.db.delete(args.id);
    },
});


// Todo 항목을 검색하는 쿼리
export const searchTodos = query({
    args: { search: v.string(), },
    handler: async (ctx, args) => {
        const search = args.search.toLowerCase();
        const identity = await ctx.auth.getUserIdentity(); // 사용자 정보 가져오기

        if (identity === null) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .collect();

        if (user.length === 0) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }

        if (search === "") {
            const todos = await ctx.db
                .query("todos")
                .filter((q) => q.eq(q.field("authorId"), user[0].clerkId))
                .order("desc")
                .collect();
            return todos;
        }

        // search_title 로 검색
        const titleSearch = await ctx.db
            .query("todos")
            .withSearchIndex("search_title", (q) => q.search('todoTitle', args.search))
            .filter((q) => q.eq(q.field("authorId"), user[0].clerkId))
            .collect();

        if (titleSearch.length > 0) {
            return titleSearch;
        }
        // 태그로 검색
        const tagsSearch = await ctx.db.query("todos").filter((q) => q.eq(q.field("authorId"), user[0].clerkId)).collect();
        const tagsResult: any = [];
        tagsSearch.filter((todo) => {
            todo.tags?.map((tag) => {
                if (tag.toLowerCase().includes(search.toLowerCase().trim())) {
                    tagsResult.push(todo);
                }
            });
        });
        if (tagsResult.length > 0) {
            return tagsResult;
        }

        // 완료||진행중||실패 로 검색
        const completedSearch = await ctx.db
            .query("todos")
            .withSearchIndex("search_Completed", (q) => q.search('isCompleted', args.search))
            .filter((q) => q.eq(q.field("authorId"), user[0].clerkId))
            .collect();
        if (completedSearch.length > 0) {
            return completedSearch;
        }
        // search_Description 로 검색
        const search_Description = await ctx.db
            .query("todos")
            .withSearchIndex("search_Description", (q) => q.search('todoDescription', args.search))
            .filter((q) => q.eq(q.field("authorId"), user[0].clerkId))
            .collect();
        return search_Description
    },
});

// 특정 기간 내의 Todo 항목을 가져오는 쿼리 (새로 추가)
export const getTodosByDateRange = query({
    args: { dueDate: v.object({ from: v.number(), to: v.number() }) },
    handler: async (ctx, args) => {
        const todos = await ctx.db
            .query("todos")
            .filter((q) =>
                args.dueDate?.from
                    ? q.and(
                        q.gte(q.field("dueDate.from"), args.dueDate.from), // from 이상
                        args.dueDate?.to
                            ? q.lte(q.field("dueDate.from"), args.dueDate.to) // to 이하
                            : true // to가 없으면 무시
                    )
                    : true // from이 없으면 무시
            )
            .collect();
        return todos;
    },
});

// 우선순위별로 Todo 항목을 가져오는 쿼리 (새로 추가)
export const getTodosByPriority = query({
    args: { priority: v.string(), userId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const todos = await ctx.db
            .query("todos")
            .filter((q) => q.eq(q.field("authorId"), args.userId))
            .filter((q) => q.eq(q.field("priority"), args.priority))
            .collect();
        return todos;
    },
});

// 카테고리별로 Todo 항목을 가져오는 쿼리 (새로 추가)
export const getTodosByCategory = query({
    args: { priority: v.optional(v.string()), category: v.optional(v.string()), userId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        // userId가 없으면 빈 배열 반환
        if (!args.userId) return [];

        // 기본 필터 (userId 필터링)
        let query = ctx.db.query("todos").filter((q) => q.eq(q.field("authorId"), args.userId));

        // category만 있을 경우 필터링 추가
        if (args.category && !args.priority) {
            query = query.filter((q) => q.eq(q.field("category"), args.category));
        }

        // priority만 있을 경우 필터링 추가
        if (args.priority && !args.category) {
            query = query.filter((q) => q.eq(q.field("priority"), args.priority));
        }

        // category와 priority 모두 있을 경우 필터링 추가
        if (args.category && args.priority) {
            query = query.filter((q) =>
                q.and(
                    q.eq(q.field("category"), args.category),
                    q.eq(q.field("priority"), args.priority)
                )
            );
        }

        // 최종 결과 반환
        return await query.collect();
    },
});

// 사용자 아이디로 실패 완료 진행중 개수 가져오는 쿼리
export const getTodoCount = query({
    args: { userId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.userId) return { completed: 0, inProgress: 0, failed: 0 };
        const todos = await ctx.db
            .query("todos")
            .filter((q) => q.eq(q.field("authorId"), args.userId))
            .collect();
        const completed = todos.filter((todo) => todo.isCompleted === '완료').length;
        const inProgress = todos.filter((todo) => todo.isCompleted === '진행중').length;
        const failed = todos.filter((todo) => todo.isCompleted === '실패').length;
        return { completed, inProgress, failed };
    },
});


// 생성일 별 작성한 Todo 항목을 가져오는 쿼리 (하루치 데이터)
export const getTodosByDay = query({
    args: {
        date: v.optional(v.object({
            from: v.optional(v.number()),
            to: v.optional(v.number())
        })),
        userId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        if (!args.userId) return [];
        const todos = await ctx.db
            .query("todos")
            .filter((q) => q.eq(q.field("authorId"), args.userId))
            .collect();

        if (todos.length === 0) return [];
        if (!args.date?.from || !args.date?.to) return [];

        const filteredTodos = todos.filter((todo) => {
            const a = todo._creationTime;
            if (args.date?.from && args.date?.to) {
                if (a >= args.date.from && a <= args.date.to) {
                    return true;
                }
            }
            return false;
        });
        return filteredTodos;
    },
});

