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
import { useMutation, useQuery } from "convex/react";
import { Ellipsis } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "./ui/badge";

interface CommentListProps {
  comment: string;
  name: string | undefined;
  createdAt: string;
  setComment: (value: string) => void;
  setEdit: (value: boolean) => void;
  id: Id<"comments">;
  setId: (value: Id<"comments">) => void;
  userId: Id<"users">;
  submissionUserId: Id<"users">;
}
const CommentList = ({
  comment,
  name,
  createdAt,
  setComment,
  setEdit,
  setId,
  id,
  userId,
  submissionUserId
}: CommentListProps) => {
  const deleteComment = useMutation(api.comments.deleteComment);
  const user = useQuery(api.users.getCurrentUser);
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
    <article className="p-3 md:p-6 text-base bg-white rounded-lg dark:bg-gray-900">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex md:items-center flex-col md:flex-row">
          <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
            {name}{userId == submissionUserId && <Badge variant="default" className="ml-2">Author</Badge>}
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            <time dateTime="2022-02-08" title="February 8th, 2022">
              {formatDate(createdAt)}
            </time>
          </p>
        </div>

        {userId == user?._id && <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(id)} className="text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>}
      </footer>
      <p className="text-gray-600 dark:text-gray-400 text-base">{comment}</p>
    </article>
  );
};

export default CommentList;
