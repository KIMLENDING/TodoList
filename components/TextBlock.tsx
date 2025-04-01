import Link from "next/link";
import TodoControls from "./TodoCompletion"
import { Badge } from "./ui/badge"
import { Id } from '@/convex/_generated/dataModel';
type TextBlockProps = {
  todoTitle: string;
  isCompleted: string;
  _id: Id<'todos'>;
}

const TextBlock = ({ todoTitle, isCompleted, _id }: TextBlockProps) => (
  <li className="mx-2 flex flex-col rounded-[18px] bg-white-1 p-6 pb-7 font-medium">
    <Link href={`/dashboard/todos/${_id}`}>
      <h2 className="mb-2 text-xl font-extrabold text-zinc-800">{todoTitle}</h2>
    </Link>
    <div>
      <Badge variant={isCompleted !== '완료' ? (isCompleted === '진행중' ? "secondary" : "destructive") : "completed"}>
        {isCompleted}
      </Badge>
    </div>
  </li>
)

export default TextBlock
