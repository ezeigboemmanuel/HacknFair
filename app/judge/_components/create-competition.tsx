"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { FormEvent, useRef, useState } from "react";
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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const storeFair = useMutation(api.fair.storeFair);

  const generateUploadUrl = useMutation(api.fair.generateUploadUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImages(Array.from(e.target.files || []));
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postUrl = await generateUploadUrl();

    if (!title || !subtitle || !imageUrl) {
      alert("Please fill out all fields");
      return;
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
        // Step 3: Save the newly allocated storage id to the database
        await storeFair({
          title,
          subtitle,
          imageUrl,
          storageId,
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
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-gray-700">Banner Image</label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer w-fit bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200 hover:border-zinc-400 focus:border-zinc-400 focus:bg-zinc-200"
          disabled={selectedImages.length !== 0}
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-4 rounded-lg max-h-64"
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Subtitle</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateCompetition;
