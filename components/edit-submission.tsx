"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  email: z
    .string()
    .min(5, {
      message: "Email must be at least 5 characters.",
    })
    .max(100, {
      message: "Email must not be longer than 100 characters.",
    }),
});

interface EditSubmissionProps {
  title: string;
  initialAbout: string;
  email: string;
  id: Id<"submissions">;
  fmrStorageIds: Id<"_storage">[];
}
const EditSubmission = ({
  title,
  initialAbout,
  email,
  id,
  fmrStorageIds,
}: EditSubmissionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      email,
    },
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [about, setAbout] = useState<string>(initialAbout);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  const updateSubmission = useMutation(api.submissions.updateSubmission);

  const generateUploadUrl = useMutation(api.submissions.generateUploadUrl);

  // Creates a new editor instance with some initial content.
  const aboutEditor = useCreateBlockNote();

  // For initialization; on mount, convert the initial Markdown to blocks and replace the default editor's content
  useEffect(() => {
    async function loadInitialHTML() {
      const aboutBlocks = await aboutEditor.tryParseMarkdownToBlocks(about);
      aboutEditor.replaceBlocks(aboutEditor.document, aboutBlocks);
    }
    loadInitialHTML();
  }, [aboutEditor]);

  const onAboutChange = async () => {
    // Converts the editor's contents from Block objects to Markdown and store to state.
    const about = await aboutEditor.blocksToMarkdownLossy(aboutEditor.document);
    setAbout(about);
  };
  const imageInput = useRef<HTMLInputElement>(null);

  const user = useQuery(api.users.getCurrentUser);
  const fair = useQuery(api.fairs.getSingleFair, {
    id: params.fairId as Id<"fairs">,
  });

  if (!user || !fair) {
    return;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSelectedImages(Array.from(e.target.files || []));
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    const postUrl = await generateUploadUrl();

    if (selectedImages.length === 0) {
      await updateSubmission({
        id: id,
        title: data.title,
        email: data.email,
        imageUrl,
        userId: user._id,
        fairId: fair.map((item) => item._id)[0],
        storageId: fmrStorageIds,
        about: about,
        format: "image",
      })
        .then(() => {
          toast.success("Project updated successfully!");
          router.back();
        })
        .catch((error) => {
          console.log(error);
          toast.error("Update fair error");
        });
    } else {
      const storageIds: Id<"_storage">[] = [];
      await Promise.all(
        selectedImages.map(async (image) => {
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": image.type },
            body: image,
          });

          const json = await result.json();

          if (!result.ok) {
            throw new Error(`Upload failed: ${JSON.stringify(json)}`);
          }
          const { storageId } = json;

          storageIds.push(storageId);
        })
      );
      setSelectedImages([]);
      imageInput.current!.value = "";
      await updateSubmission({
        id: id,
        title: data.title,
        email: data.email,
        imageUrl,
        userId: user._id,
        fairId: fair.map((item) => item._id)[0],
        storageId: storageIds,
        about: about,
        format: "image",
      })
        .then(() => {
          toast.success("Project updated successfully!");
          router.back();
        })
        .catch((error) => {
          console.log(error);
          toast.error("You can upload only 5 images");
        });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg max-w-2xl mx-auto"
      >
        <div className="mb-6">
          <p>You are submitting to:</p>
          <img
            src={fair?.map((item) => item.imageUrl)[0]}
            alt="Preview"
            className="rounded-lg w-full max-h-72 object-cover object-center mt-2 border border-gray-300"
          />
        </div>
        <p className="text-sm font-semibold text-gray-800">
          Add up to 5 images:
        </p>
        <div className="mt-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInput}
            multiple
            className="cursor-pointer p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="mt-6">
              <FormLabel className="text-gray-800 font-semibold">
                Title
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your title"
                  {...field}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
              </FormControl>
              <FormDescription className="text-gray-500 mt-1">
                Enter your title
              </FormDescription>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="text-gray-800 font-semibold">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
              </FormControl>
              <FormDescription className="text-gray-500 mt-1">
                Enter your email
              </FormDescription>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <div className="mb-6 mt-4">
          <label className="block text-gray-800 font-semibold text-sm mb-2">
            About your project
          </label>
          <BlockNoteView
            editor={aboutEditor}
            defaultValue={initialAbout}
            onChange={onAboutChange}
            className="border rounded-lg py-4"
          />
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={loading}
          className="mt-3 w-full py-3 font-semibold rounded-lg bg-[#4eb645] hover:bg-[#33a828]"
        >
          Update your project
        </Button>
      </form>
    </Form>
  );
};

export default EditSubmission;
