import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']); //  /sign-in, sign-up, / 경로를 정의합니다.
// const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']); // 모든 하위 경로를 포함하는 경로를 정의합니다.
// const isAdminRoute = createRouteMatcher(['/admin(.*)']); // 모든 하위 경로를 포함하는 경로를 정의합니다.

export default clerkMiddleware((auth, req) => {
    // [ /sign-in, sign-up, / ]경로 이외의 모든 경로에 대해 로그인한 사용자에게만 액세스를 허용합니다.
    if (!isPublicRoute(req)) auth().protect();

    /**
     * 예시 코드
     * if (isAdminRoute(req)) auth().protect({ role: 'org:admin' }); // org:admin 역할을 가진 사용자에게만 액세스를 허용합니다.
     * if (isDashboardRoute(req)) auth().protect(); // 로그인한 사용자에게만 액세스를 허용합니다.
    */
});

export const config = {
    matcher: [
        //     // next로 시작하는 경로를 제외
        // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        //     // api, trpc로 시작하는 경로를 제외
        // '/(api|trpc)(.*)',
        "/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)" //  _next, api, trpc 경로를 제외 위의 둘을 합친 것 위쪽이 좀 더 자세함
    ],
};