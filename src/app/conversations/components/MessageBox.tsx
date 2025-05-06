"use client";
import Avatar from "@/src/components/Avatar";
import { FullMessageType } from "@/src/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface MessageBoxProps {
  isLast: boolean;
  data: FullMessageType;
}

export default function MessageBox({ isLast, data }: MessageBoxProps) {
  const session = useSession();

  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email != data?.sender?.email)
    .map((user) => user.name)
    .join(", "); // will yield something like anusha, lucas akshay, afra

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2");

  const body = clsx("flex flex-col gap-2", isOwn && "items-end");

  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-theme-green text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-sm text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={message}>
          {data.image ? (
            <Image
              alt="image"
              height={288}
              width={288}
              src={data.image}
              className="
            object-cover
            cursor-pointer
            hover:scale-110
            transition
            translate
          "
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
            text-xs
            font-light
            text-gray-500
          "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
}
