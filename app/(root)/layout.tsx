import LeftSidebar from "@/components/Layout/LeftSidebar";
import RightSidebar from "@/components/Layout/RightSidebar";
import MobileNav from "@/components/Layout/MobileNav";
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image";
import Link from "next/link";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative flex flex-col">
            <main className="relatice flex bg-slate-300">
                <LeftSidebar />
                <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14 ">
                    <div className=" flex w-full flex-col max-sm:px-4"> {/**mx-auto max-w-5xl 추가 하면 하위 컴포넌트가 중앙으로 정해지긴 하는 데 화면이 크면 여백이 많이 생김 */}
                        <div className="flex pt-4 h-16 items-center justify-between md:hidden ">
                            <Link href='/' className='flex cursor-pointer items-center  '>
                                <div className='border-2 rounded-md'>
                                    <Image src='/icons/logo.svg' alt='menu icon' width={42} height={42} />
                                </div>
                            </Link>
                            <MobileNav />
                        </div>
                        <div className="w-full flex items-center flex-col md:pb-14 " >
                            <Toaster />
                            {children}
                        </div>
                    </div>
                </section>
                <RightSidebar />
            </main>
        </div>
    );
}
