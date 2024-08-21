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
import { FormEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

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
  about: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
});

const MakeSubmission = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      email: "",
      about: "",
    },
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const params = useParams();
  const router = useRouter();

  const storeSubmission = useMutation(api.submissions.storeSubmission);

  const generateUploadUrl = useMutation(api.submissions.generateUploadUrl);

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
    const postUrl = await generateUploadUrl();

    if (!imageUrl) {
      alert("Please input an Image");
      return;
    }
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
    await storeSubmission({
      title: data.title,
      email: data.email,
      imageUrl,
      userId: user._id,
      fairId: fair.map((item) => item._id)[0],
      storageId: storageIds,
      about: data.about,
      format: "image",
    })
      .then(() => {
        toast.success("Project submitted successfully!");
        router.push(`/${fair.map((item) => item._id)[0]}`);
      })
      .catch((error) => {
        console.log(error);
        toast.error("You can upload only 5 images");
      });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
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
                  placeholder="I will do something amazing"
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
                  placeholder="I will do something amazing"
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

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="text-gray-800 font-semibold">
                About
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="I will do something amazing"
                  {...field}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
              </FormControl>
              <FormDescription className="text-gray-500 mt-1">
                About your project.
              </FormDescription>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="default"
          className="mt-6 w-full py-3 font-semibold rounded-lg"
        >
          Submit your project
        </Button>
      </form>
    </Form>
  );
};

export default MakeSubmission;
