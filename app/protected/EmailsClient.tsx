"use client";

import { useEffect, useState } from "react";
import SafeEmailViewer from "./SafeEmailViewer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function EmailsClient({ token }: { token: string }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [messageOpen, setMessageOpen] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const res = await fetch("/api/get-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      console.log(data)
      setMessages(data)
      setLoading(false)
    };

    fetchEmails();
  }, [token]);

  const getValueByName = (name: string, message: []) => {
    return message.payload.headers.find((h: []) => h.name === name)?.value;
  }

  return (
    <div className="overflow-y-scroll h-screen flex-col gap-2 px-5">
        {messages.length > 0 && messageOpen && (
          <div className="fixed left-0 top-0 w-screen overflow-y-scroll h-screen bg-white z-20 py-5 pt-20">
            <div className="px-96 pb-20">
              <p className="text-center text-2xl font-bold mb-20">{getValueByName("Subject", messages[messageOpen])}</p>

              <div className="flex gap-5 justify-center">
                <div>
                  <p>From</p>
                  <p>{getValueByName("From", messages[messageOpen])}</p>
                </div>
                <div>
                  <p>To</p>
                  <p>{getValueByName("To", messages[messageOpen])}</p>
                </div>
              </div>
            </div>

            {messages[messageOpen].payload.parts ? (
              <SafeEmailViewer encodedHtml={messages[messageOpen].payload.parts[1].body.data} />
            ) : (
              <SafeEmailViewer encodedHtml={messages[messageOpen].payload.body.data} />
            )}
            
            <Button className="fixed bottom-3 right-6 w-16 h-16 bg-blue-200 text-black hover:bg-blue-400" onClick={() => setMessageOpen(null)}><X size={30} /></Button>
          </div>
        )}
        

        {!loading && messages.length > 0 && messages.map((msg, i) => {
          const from = getValueByName("From", msg)
          const subject = getValueByName("Subject", msg)

          const sender = { name: "", email: "" }

          const match = from.match(/^(.*)<(.*)>$/);

          if (match) {
            sender.name = match?.[1]?.trim();
            sender.email = match?.[2]?.trim();
          } else {
            sender.name = from.trim();
          }

          const categoryLabel = msg.labelIds.find((id: string) => id.startsWith("CATEGORY_"));
          const label = categoryLabel
            ? categoryLabel.replace("CATEGORY_", "").charAt(0) + categoryLabel.replace("CATEGORY_", "").slice(1).toLowerCase()
            : null;

          let labelColor = ""

          switch (label) {
            case "Promotions":
              labelColor = "bg-yellow-200"
              break;

            case "Updates":
              labelColor = "bg-red-200"
              break;

            case "Social":
              labelColor = "bg-blue-200"
              break;

            case "Personal":
              labelColor = "bg-green-200"
              break;
          
            default:
              break;
          }

          return (
            <div key={i} className="py-4 border-b-muted border-b grid grid-cols-3 hover:bg-muted duration-300 cursor-pointer px-5 rounded-lg group z-10" onClick={() => setMessageOpen(i)}>
              <p>{sender.name}</p>
              <div className="relative w-full overflow-x-auto [mask-image:linear-gradient(to_right,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,black_90%,transparent)]">
                <p className="whitespace-nowrap overflow-x-hidden">{subject}</p>
              </div>

              <div className="flex justify-end items-center">
                <p className={`w-min text-xs ${labelColor} px-2 rounded-lg py-1`}>{label}</p>
              </div>
            </div>
          )
        })}
    </div>
  );
}
