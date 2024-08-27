// create a clerk user -> info -> users.create
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix"; // npm install svix


const handleClerkWebhook = httpAction(async (ctx, request) => {
    const event = await validateRequest(request);  // validateRequest 함수를 사용하여 요청을 확인합니다.
    if (!event) {
        return new Response("Error occured", { status: 400, });
    }
    switch (event.type) {
        case "user.created": // intentional fallthrough
            await ctx.runMutation(internal.users.createUser, {
                name: event.data.first_name!,
                email: event.data.email_addresses[0].email_address,
                imageUrl: event.data.image_url,
                clerkId: event.data.id,
            });
            break;
        case "user.updated":
            await ctx.runMutation(internal.users.updateUser, {
                clerkId: event.data.id,
                imageUrl: event.data.image_url,
                email: event.data.email_addresses[0].email_address,
            });
            break;
        case "user.deleted":
            await ctx.runMutation(internal.users.deleteUser, {
                clerkId: event.data.id as string,
            });
            break;

        default: {
            console.log("ignored Clerk webhook event", event.type);
        }
    }
    return new Response(null, { status: 200, });
});

const http = httpRouter();
http.route({
    path: "/clerk", //TODO: Clerk 웹훅 엔드포인트
    method: "POST",
    handler: handleClerkWebhook,
});

async function validateRequest(
    req: Request
): Promise<WebhookEvent | undefined> {
    // TODO: CLERK_WEBHOOK_SECRET 환경 변수를 설정하세요.
    /**
     * TODO: CLERK 웹훅을 클릭하고 거기에서 
     * TODO: 엔드포인트 URL을 설정하고, 
     * TODO: 설정방법은 백엔드주소 NEXT_PUBLIC_CONVEX_URL + Clerk 웹훅 엔드포인트
     * TODO: 예시 "https://fine-porcupine-963.convex.site/clerk"
     */
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!; // Clerk 웹훅 시크릿을 가져옵니다.
    if (!webhookSecret) {
        throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }
    const payloadString = await req.text(); // 요청의 본문을 가져옵니다.
    const headerPayload = req.headers; // 요청의 헤더를 가져옵니다.

    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id")!,
        "svix-timestamp": headerPayload.get("svix-timestamp")!,
        "svix-signature": headerPayload.get("svix-signature")!,
    }; // svix 헤더를 가져옵니다.

    const wh = new Webhook(webhookSecret);
    let evt: Event | null = null;
    try {
        evt = wh.verify(payloadString, svixHeaders) as Event;
    } catch (_) {
        console.log("error verifying");
        return;
    }

    return evt as unknown as WebhookEvent;
}

export default http;