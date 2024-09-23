import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 루틴 가져오기 
export const getUserRoutines = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity(); // 사용자 정보 가져오기
        if (!identity) {
            throw new ConvexError("User not found");
        }
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .collect();
        if (user.length === 0) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }
        const routines = await ctx.db
            .query("routines")
            .filter((q) => q.eq(q.field("authorId"), user[0].clerkId))
            .collect();
        return routines;
    },
});
// 루틴 덮어쓰기 {mockData}
export const setRoutines = mutation({
    args: {
        mockData: v.array(v.object({
            dndId: v.string(),
            indexDB: v.number(),
            title: v.string(),
            description: v.string(),
            type: v.array(v.string()),
            routineItmes: v.array(v.object({
                dndId: v.string(),
                indexDB: v.number(),
                title: v.string(),
                description: v.string(),
                completed: v.boolean(),
            })),
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // 사용자 정보 가져오기
        if (!identity) {
            throw new ConvexError("User not found");
        }
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .collect();
        if (user.length === 0) {
            throw new ConvexError('사용자 정보가 없습니다.');
        }

        const routines = await ctx.db
            .query("routines")
            .filter((q) => q.eq(q.field("authorId"), user[0].clerkId))
            .collect();
        routines.map(async (routine) => { // 루틴 삭제
            await ctx.db.delete(routine._id);
        });
        for (const routine of args.mockData) {
            await ctx.db.insert("routines", {
                user: user[0]._id,
                authorId: user[0].clerkId,
                dndId: routine.dndId,
                indexDB: routine.indexDB,
                title: routine.title,
                description: routine.description,
                type: routine.type,
                routineItmes: routine.routineItmes,
            });
        }
    },
});


