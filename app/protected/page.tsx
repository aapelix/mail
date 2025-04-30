import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Inbox, SquarePen } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { EmailsClient } from "./EmailsClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { signOutAction } from "../actions";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!user || !session) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-row overflow-y-hidden h-screen">
      
      <nav className="h-screen bg-muted w-80 p-4">
        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 hover:bg-muted-foreground/10 rounded-lg px-2 py-1 duration-300">
                <img className="w-8 h-8 rounded-full" src={user.user_metadata.picture} />
                <p className="font-semibold">{user.user_metadata.name}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white px-4 py-3 rounded-lg ml-4 border-muted-foreground/10 mt-2 shadow-sm">
              <DropdownMenuLabel>
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="px-4 bg-red-200 hover:bg-red-400 py-2 rounded-lg duration-300 cursor-pointer text-center font-bold mt-4" onClick={signOutAction}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <div className="px-8 py-4">
        <p className="font-semibold mb-3 px-10 flex gap-4"> <Inbox color="#f87171" /> Inbox</p>
        <EmailsClient token={session.provider_token} />
      </div>
    </div>
  );
}
