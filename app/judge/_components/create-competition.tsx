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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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

const CreateCompetition = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      about: "",
      requirements: "",
      prices: "",
      judgingCriteria: "",
    },
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [deadline, setDeadline] = useState("");

  const storeFair = useMutation(api.fair.storeFair);

  const generateUploadUrl = useMutation(api.fair.generateUploadUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImages(Array.from(e.target.files || []));
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const postUrl = await generateUploadUrl();

    // if (!title || !subtitle || !imageUrl) {
    //   alert("Please fill out all fields");
    //   return;
    // }

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
        // Step 3: Save the newly allocated storage id to the database
        await storeFair({
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
        }).catch((error) => {
          console.log(error);
          alert("Maximum 5 files reached.");
        });
      })
    );

    alert("Banner submitted successfully!");
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="mb-4">
          <label className="block text-gray-700">Banner Image</label>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="rounded-lg w-full max-h-72 object-cover object-center"
            />
          )}
        </div>
        <div className="mt-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="I will do something amazing" {...field} />
              </FormControl>
              <FormDescription>
                Craft a keyword-rich Gig title to attract potential buyers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input placeholder="I will do something amazing" {...field} />
              </FormControl>
              <FormDescription>
                Craft a keyword-rich Gig subtitle to attract potential buyers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring"
          />
        </div>

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Input placeholder="I will do something amazing" {...field} />
              </FormControl>
              <FormDescription>
                Craft a keyword-rich about to attract potential buyers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Input placeholder="I will do something amazing" {...field} />
              </FormControl>
              <FormDescription>
                Craft a keyword-rich requirement to attract potential buyers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prices</FormLabel>
              <FormControl>
                <Input placeholder="I will do something amazing" {...field} />
              </FormControl>
              <FormDescription>
                Craft a keyword-rich about to attract potential buyers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="judgingCriteria"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judging Criteria</FormLabel>
              <FormControl>
                <Input placeholder="I will do something amazing" {...field} />
              </FormControl>
              <FormDescription>
                Craft a keyword-rich criteria to attract potential buyers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </Form>
  );
};

export default CreateCompetition;
