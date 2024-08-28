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
        todoDescription: v.string(), // todo 내용
        dueDate: v.number(), // 기한
        attachmentUrls: v.optional(v.array(v.string())),
        attachments: v.optional(v.array(v.id("_storage"))),
        priority: v.optional(v.string()), // 우선순위
        category: v.optional(v.string()), // 카테고리
        tags: v.optional(v.array(v.string())), // 태그
        reminder: v.optional(v.number()), // 리마인더 알림설정 (시간)
        // repeat: v.optional(v.boolean()), // 반복 설정
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
            isCompleted: false,
        });
        return todoId;
    },
});

// Todo 항목을 업데이트하는 뮤테이션
export const updateTodo = mutation({
    args: {
        id: v.id("todos"),
        todoTitle: v.optional(v.string()),
        todoDescription: v.optional(v.string()),
        dueDate: v.optional(v.number()),
        attachmentUrls: v.optional(v.array(v.string())),
        attachments: v.optional(v.array(v.id("_storage"))),
        priority: v.optional(v.string()),
        category: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        reminder: v.optional(v.number()),
        // repeat: v.optional(v.boolean()),
        progress: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updateFields } = args;
        await ctx.db.patch(id, updateFields);
    },
});

// Todo 항목의 완료 상태를 토글하는 뮤테이션
export const toggleTodoCompletion = mutation({
    args: { id: v.id("todos") },
    handler: async (ctx, args) => {
        const todo = await ctx.db.get(args.id);
        if (!todo) throw new Error("Todo not found");

        await ctx.db.patch(args.id, {
            isCompleted: !todo.isCompleted,
            completedAt: !todo.isCompleted ? Date.now() : undefined
        });
    },
});

// Todo 항목을 삭제하는 뮤테이션
export const deleteTodo = mutation({
    args: { id: v.id("todos") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Todo 항목을 검색하는 쿼리
export const searchTodos = query({
    args: { search: v.string(), },
    handler: async (ctx, args) => {
        const search = args.search.toLowerCase();

        if (search === "") {
            return await ctx.db.query("todos").order("desc").collect();
        }
        // search_author로 검색
        const authorSearch = await ctx.db
            .query("todos")
            .withSearchIndex("search_author", (q) => q.search('author', args.search))
            .collect();
        if (authorSearch.length > 0) {
            return authorSearch;
        }
        // search_title 로 검색
        const titleSearch = await ctx.db
            .query("todos")
            .withSearchIndex("search_title", (q) => q.search('todoTitle', args.search))
            .collect();

        if (titleSearch.length > 0) {
            return titleSearch;
        }
        // search_Description 로 검색

        return await ctx.db.query("todos").withSearchIndex("search_Description", (q) => q.search('todoDescription', args.search)).collect();
    },
});

// 특정 기간 내의 Todo 항목을 가져오는 쿼리 (새로 추가)
export const getTodosByDateRange = query({
    args: { startDate: v.number(), endDate: v.number() },
    handler: async (ctx, args) => {
        const todos = await ctx.db
            .query("todos")
            .filter((q) =>
                q.and(
                    q.gte(q.field("dueDate"), args.startDate), // 시작일 이상
                    q.lte(q.field("dueDate"), args.endDate) // 종료일 이하
                )
            )
            .collect();
        return todos;
    },
});

// 우선순위별로 Todo 항목을 가져오는 쿼리 (새로 추가)
export const getTodosByPriority = query({
    args: { priority: v.string() },
    handler: async (ctx, args) => {
        const todos = await ctx.db
            .query("todos")
            .filter((q) => q.eq(q.field("priority"), args.priority))
            .collect();
        return todos;
    },
});

// 카테고리별로 Todo 항목을 가져오는 쿼리 (새로 추가)
export const getTodosByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, args) => {
        const todos = await ctx.db
            .query("todos")
            .filter((q) => q.eq(q.field("category"), args.category))
            .collect();
        return todos;
    },
});

// 태그로 Todo 항목을 검색하는 쿼리 (새로 추가)
