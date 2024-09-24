import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

// query({}): 쿼리를 생성합니다.
// internalMutation({}): 내부 뮤테이션을 생성합니다.
//.query('테이블'): 테이블의 데이터를 조회합니다.
//.collect(): 데이터를 배열로 반환합니다.
//.unique(): 데이터를 반환합니다.
//.filter((q)=> q.eq(field('필드 이름'), 필드에 해당하는 값)): 데이터를 필터링합니다.
//.patch(): 데이터를 업데이트합니다.
//.delete(): 데이터를 삭제합니다.
//.insert(): 데이터를 추가합니다.

/**
 * clerkId를 사용하여 사용자를 조회합니다.
 */
export const getUserById = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .filter((q) => q.eq(q.field('clerkId'), args.clerkId))
            .unique();
        if (!user) {
            throw new ConvexError('User not found');
        }
        return user;
    },
});

/**
 * 사용자 생성 {name, email, imageUrl, clerkId}
 */
export const createUser = internalMutation({
    args: {
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),

    }, handler: async (ctx, args) => {
        await ctx.db.insert("users", { // users 테이블에 데이터 추가
            name: args.name,
            email: args.email,
            imageUrl: args.imageUrl,
            clerkId: args.clerkId,
        })

    }
})

/**
 * 사용자 업데이트 {clerkId, imageUrl, email}
 */
export const updateUser = internalMutation({
    args: {
        clerkId: v.string(),
        imageUrl: v.string(),
        email: v.string(),
    }, handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")// users 테이블에서 clerkId와 일치하는 데이터 찾기
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        await ctx.db.patch(user._id, {
            imageUrl: args.imageUrl,
            email: args.email,
        });

        const todo = await ctx.db
            .query("todos")
            .filter((q) => q.eq(q.field("authorId"), user.clerkId))
            .collect();

        await Promise.all(
            todo.map(async (p) => {
                await ctx.db.patch(p._id, {
                    authorImageUrl: args.imageUrl,
                });
            })
        );
    },
});


/**
 * 사용자 삭제 {clerkId}
 */
export const deleteUser = internalMutation({
    args: {
        clerkId: v.string(),
    }, handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .unique();
        if (!user) {
            throw new Error("User not found");
        }
        await ctx.db.delete(user._id);
    }
})