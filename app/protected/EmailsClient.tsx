"use client";

import { useEffect, useState } from "react";

export function EmailsClient({ token }: { token: string }) {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return message.payload.headers.find(h => h.name === name)?.value;
  }

  return (
    <div className="overflow-y-scroll h-screen flex-col gap-2 px-5">
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
            <div key={i} className="py-4 border-b-muted border-b grid grid-cols-3 hover:bg-muted duration-300 cursor-pointer px-5 rounded-lg group">
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
