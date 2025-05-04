"use client";
import useConversation from "@/src/hooks/useConversation";
import axios from "axios";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";
import { useState } from "react";
import DeleteConversationButton from "./DeleteConversationButton";
import { User } from "@prisma/client";
import SettingsModal from "./SettingsModal";
import ImageUploadModal from "./ImageUploadModal";

interface FormProps {
  otherUsers: User[]
}

export default function Form({otherUsers}: FormProps) {
  const [showConversationSettings, setShowConversationSettings] =
    useState<boolean>(false);
  const [showImageUpload, setShowImageUpload] = useState<boolean>(false);
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      messages: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };
  return (
    <div
      className="
      py-4
      px-4
      bg-white
      border-t
      flex
      items-center
      gap-2
      lg:gap-4
      w-full
    "
    >
      <IoSettingsOutline
        size={30}
        className="text-gray-400 cursor-pointer hover:text-gray-600"
        onClick={() => setShowConversationSettings((prev) => !prev)}
      />
      {showConversationSettings && (
        <>
          <div
            onClick={() => setShowConversationSettings(false)}
            className="bg-black/50 fixed inset-0 z-40"
          ></div>
          {/* <div className="absolute z-50 right-[50%] top-[50%] bg-white rounded-md w-24 border">
            <DeleteConversationButton />
          </div> */}
          <SettingsModal otherUsers={otherUsers}/>
        </>
      )}

      <HiPhoto
        size={30}
        className="text-theme-green cursor-pointer hover:text-green-800"
        onClick={() => setShowImageUpload(true)}
      />
      {showImageUpload && (
        <ImageUploadModal onClose={() => setShowImageUpload(false)} />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />

        <button
          title="Send Button"
          type="submit"
          className="
            rounded-full
            p-2
            bg-theme-green
            cursor-pointer
            hover:bg-green-800
            transition
            rotate-90
          "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
}
