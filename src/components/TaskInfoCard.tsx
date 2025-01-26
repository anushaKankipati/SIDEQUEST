import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TaskInfoCardProps {
  title: string;
  body: any;
}

export default function TaskInfoCard({ title, body }: TaskInfoCardProps) {
  return (
    <div className="p-4 flex flex-col bg-gray-100 rounded-md">
      <div className="flex justify-evenly align-center">
        <h1 className="text-2xl">{title}</h1>
        <FontAwesomeIcon icon={faPencil} />
      </div>
      <div className="mt-2">{body}</div>
    </div>
  );
}
