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
  const imageInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const storeFair = useMutation(api.fair.storeFair);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !subtitle || !imageUrl) {
      alert("Please fill out all fields");
      return;
    }

    await storeFair({
      title,
      subtitle,
      imageUrl,
    });

    alert("Banner submitted successfully!");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label className="block text-gray-700">Banner Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring"
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
