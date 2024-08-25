"use client";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MouseEventHandler, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import CommentList from "./comment-list";

interface CommentsProps {
  submissionId: Id<"submissions">;
}
const Comments = ({ submissionId }: CommentsProps) => {
  const router = useRouter();
  const storeComments = useMutation(api.comments.storeComments);
  const updateComment = useMutation(api.comments.updateComment);
  const comments = useQuery(api.comments.get);
  const [comment, setComment] = useState("");
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<Id<"comments">>();
  const user = useQuery(api.users.getCurrentUser);

  if (!user) {
    return;
  }

  if (!comments) {
    return <div>Loading...</div>;
  }

  const handleComments = async () => {
    await storeComments({
      userId: user._id,
      submissionId: submissionId,
      comment: comment,
      createdAt: new Date().toISOString(),
    })
      .then(() => {
        toast.success("Comment submitted successfully.");
        setComment("");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong.");
      });
  };

  const handleEditComment = async (id: Id<"comments"> | undefined) => {
    await updateComment({
      id: id,
      comment: comment,
      createdAt: new Date().toISOString(),
      submissionId: submissionId,
      userId: user._id,
    })
      .then(() => {
        toast.success("Comment updated successfully.");
        setComment("");
        setEdit(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong.");
      });
  };

  return (
    <div>
      <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              Comment (
              {comments
                ?.map((comment) => submissionId.includes(comment.submissionId))
                .filter((item) => item === true).length
                ? comments
                    ?.map((comment) =>
                      submissionId.includes(comment.submissionId)
                    )
                    .filter((item) => item === true).length
                : "0"}
              )
            </h2>
          </div>
          <div className="mb-6">
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows={6}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            {!edit ? (
              <Button onClick={handleComments} type="submit" variant="default">
                Post comment
              </Button>
            ) : (
              <Button
                onClick={() => handleEditComment(id)}
                type="submit"
                variant="default"
              >
                Edit Comment
              </Button>
            )}
          </div>
          {comments?.map(
            (comment) =>
              submissionId == comment.submissionId && (
                <CommentList
                  key={comment._id}
                  id={comment._id}
                  setId={setId}
                  comment={comment.comment}
                  name={comment.commentCreator?.name}
                  createdAt={comment.createdAt}
                  setComment={setComment}
                  setEdit={setEdit}
                  userId={comment.userId}
                />
              )
          )}
        </div>
      </section>
    </div>
  );
};

export default Comments;
