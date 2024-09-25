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
        mockData: v.optional(v.array(v.object({
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
                createdAt: v.number(),
                completedDate: v.array(v.number()),
            })),
            updateAt: v.number(),
        }))),
    },
    handler: async (ctx, args) => {
        if (!args.mockData) { // 받아온 데이터가 없을 경우
            return;
        }
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
                updateAt: routine.updateAt,
            });
        }
    },
});

// 서버에서 하루에 한번 루틴의 완료 여부를 초기화
export const resetRoutines = mutation({
    args: { routeId: v.string() },
    handler: async (ctx, args) => {
        if (args.routeId === '/routine') {
            console.log('루틴 페이지 입니다.');
            return;
        }
        const now = new Date(); // 당일 날짜 가져오기 yyyy/mm/dd-00:00:00
        // const updateDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime(); // 서버 시간 계산 해야 할 듯
        // console.log(updateDate);
        const options = { timeZone: 'Asia/Seoul' };
        const formatter = new Intl.DateTimeFormat('ko-KR', options);
        const [year, month, day] = formatter.format(now).split('. ').map(Number);

        // 오늘 날짜의 00:00으로 설정된 한국 시간대 Date 객체 생성
        const kstMidnightToday = new Date(Date.UTC(year, month - 1, day - 1, 15, 0, 0)); // UTC로 변환을 위해 9시간을 빼줌
        const updateDate = kstMidnightToday.getTime();
        console.log(updateDate);
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

        if (routines.length === 0) {
            return console.log('루틴 정보가 없습니다.');
        }
        for (const routine of routines) {
            // 루틴의 완료 여부를 초기화
            if (routine.updateAt < updateDate) { // 하루에 한번 업데이트
                if (routine.routineItmes) {
                    for (const r of routine.routineItmes) {
                        r.completed = false;
                    }
                }
                // 루틴의 완료 여부를 초기화한 루틴을 업데이트
                await ctx.db.patch(routine._id, {
                    ...routine,
                    updateAt: updateDate, // 루틴 업데이트 날짜를 오늘 날짜로 업데이트 
                    routineItmes: routine.routineItmes,
                });

            }
        }


    },
});



