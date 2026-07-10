import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import Sidebar from "../components/Sidebar";

export default async function AppLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Not logged in?
    if (!user) {
        redirect("/");
    }

    return (
        <>
        {/* <div className="min-h-screen flex justify-center border-4 border-red-500"> */}
        <div className="min-h-screen flex justify-center">
            <Sidebar/>
            {/* mx-auto would never work below, for margins to work the element would need a constrained width (to kinda push out {like a reference}) */}
            <main className="flex-1">
                <div className="w-full">
                    {children}
                    {modal}
                </div>
            </main>
        </div>
        </>
    );
}