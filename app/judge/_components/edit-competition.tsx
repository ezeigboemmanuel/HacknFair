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
import { useRouter } from "next/navigation";
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
  subtitle: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
  about: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  requirements: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  prices: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  judgingCriteria: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
});

interface EditCompetitionProps {
  title: string;
  subtitle: string;
  initialDeadline: string;
  about: string;
  requirements: string | undefined;
  prices: string | undefined;
  judgingCriteria: string | undefined;
  imageURL: string;
  fairId: Id<"fairs">;
  fmrStorageId: Id<"_storage">;
}

const EditCompetition = ({
  title,
  subtitle,
  about,
  initialDeadline,
  fairId,
  imageURL,
  judgingCriteria,
  prices,
  fmrStorageId,
  requirements,
}: EditCompetitionProps) => {
  const updateFair = useMutation(api.fairs.updateFair);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      subtitle,
      about,
      judgingCriteria,
      prices,
      requirements,
    },
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(imageURL);
  const [deadline, setDeadline] = useState(initialDeadline);

  const router = useRouter();

  const user = useQuery(api.users.getCurrentUser);

  const generateUploadUrl = useMutation(api.fairs.generateUploadUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (selectedImages.length === 0) {
      await updateFair({
        id: fairId,
        title: data.title,
        subtitle: data.subtitle,
        imageUrl,
        about: data.about,
        deadline,
        storageId: fmrStorageId,
        requirements: data.requirements,
        prices: data.prices,
        judgingCriteria: data.judgingCriteria,
        format: "image",
      }).catch((error) => {
        console.log(error);
        alert("Update fair error");
      });

      router.push(`/judge/${user?._id}`);
    }

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

        await updateFair({
          id: fairId,
          title: data.title,
          subtitle: data.subtitle,
          imageUrl,
          storageId,
          about: data.about,
          deadline,
          requirements: data.requirements,
          prices: data.prices,
          judgingCriteria: data.judgingCriteria,
          format: "image",
        })
          .then(() => {
            toast.success("Fair updated successfully!");
            router.push(`/judge/${user?._id}`);
          })
          .catch((error) => {
            console.log(error);
            toast.error("Update fair error");
          });
      })
    );
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
      >
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold">
            Banner Image
          </label>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="rounded-lg w-full max-h-72 object-cover object-center mt-2 border border-gray-300"
            />
          )}
        </div>
        <div className="mt-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
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
          name="subtitle"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="text-gray-800 font-semibold">
                Subtitle
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="I will do something amazing"
                  {...field}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
              </FormControl>
              <FormDescription className="text-gray-500 mt-1">
                Enter your subtitle
              </FormDescription>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <div className="mb-6 mt-4">
          <label className="block text-gray-800 font-semibold">Date</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

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
                About the fair.
              </FormDescription>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="text-gray-800 font-semibold">
                Requirements
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="I will do something amazing"
                  {...field}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
              </FormControl>
              <FormDescription className="text-gray-500 mt-1">
                Enter the requirements.
              </FormDescription>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prices"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="text-gray-800 font-semibold">
                Prices
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="I will do something amazing"
                  {...field}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
              </FormControl>
              <FormDescription className="text-gray-500 mt-1">
                Enter the prices.
              </FormDescription>
              <FormMessage className="text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="judgingCriteria"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="text-gray-800 font-semibold">
                Judging Criteria
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="I will do something amazing"
                  {...field}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
              </FormControl>
              <FormDescription className="text-gray-500 mt-1">
                Enter the judging criteria
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
          Edit Fair
        </Button>
      </form>
    </Form>
  );
};

export default EditCompetition;
