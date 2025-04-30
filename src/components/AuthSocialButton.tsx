import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  title: string; 
  icon: IconType;
  onClick: () => void;
}

export default function AuthSocialButton({
  title,
  icon: Icon,
  onClick,
}: AuthSocialButtonProps) {
  return (
    <button 
      title={title}
      type="button"
      onClick={onClick}  
      className="
        inline-flex
        w-full
        justify-center
        rounded-md
        bg-white
        px-4
        py-2
        text-gray-500
        shadow-sm
        ring-1
        ring-inset
        ring-gray-300
        hover:bg-gray-50
        focus:outline-offset-0
      "
    >
      <Icon/>
    </button>
  )
}
