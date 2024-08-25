"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Ellipsis } from "lucide-react";
import toast from "react-hot-toast";

interface CommentListProps {
  comment: string;
  name: string | undefined;
  createdAt: string;
  setComment: (value: string) => void;
  setEdit: (value: boolean) => void;
  id: Id<"comments">;
  setId: (value: Id<"comments">) => void;
}
const CommentList = ({
  comment,
  name,
  createdAt,
  setComment,
  setEdit,
  setId,
  id,
}: CommentListProps) => {
  const deleteComment = useMutation(api.comments.deleteComment);
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = () => {
    setComment(comment);
    setEdit(true);
    setId(id);
  };

  const handleDelete = (id: Id<"comments">) => {
    deleteComment({ id: id }).then(() => {
      toast.success("Comment deleted successfully.");
    });
  };
  return (
    <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            {name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time dateTime="2022-02-08" title="February 8th, 2022">
              {formatDate(createdAt)}
            </time>
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(id)} className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>
      <p className="text-gray-500 dark:text-gray-400">{comment}</p>
    </article>
  );
};

export default CommentList;
