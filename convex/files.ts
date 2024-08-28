import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
    args: {

    },
    handler: async (ctx, args) => {
        // use `args` and/or `ctx.auth` to authorize the user
        // ...

        // Return an upload URL
        const uploadUrl = await ctx.storage.generateUploadUrl();
        return uploadUrl //업로드 URL 생성
    },
});
