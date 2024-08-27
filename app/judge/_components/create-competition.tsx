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
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
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
  subtitle: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters.",
    }),
});

const CreateCompetition = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
    },
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [deadline, setDeadline] = useState("");

  const router = useRouter();

  const storeFair = useMutation(api.fairs.storeFair);

  const generateUploadUrl = useMutation(api.fairs.generateUploadUrl);

  const user = useQuery(api.users.getCurrentUser);

  const [about, setAbout] = useState<string>("");
  const [req, setReq] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [judcri, setJudcri] = useState<string>("");

  // Creates a new editor instance with some initial content.
  const aboutEditor = useCreateBlockNote();
  const reqEditor = useCreateBlockNote();
  const priceEditor = useCreateBlockNote();
  const judcriEditor = useCreateBlockNote();

  const onAboutChange = async () => {
    // Converts the editor's contents from Block objects to Markdown and store to state.
    const about = await aboutEditor.blocksToMarkdownLossy(aboutEditor.document);
    setAbout(about);
  };

  const onReqChange = async () => {
    // Converts the editor's contents from Block objects to Markdown and store to state.
    const req = await reqEditor.blocksToMarkdownLossy(reqEditor.document);
    setReq(req);
  };

  const onPricesChange = async () => {
    // Converts the editor's contents from Block objects to Markdown and store to state.
    const price = await priceEditor.blocksToMarkdownLossy(priceEditor.document);
    setPrice(price);
  };

  const onJudcriChange = async () => {
    // Converts the editor's contents from Block objects to Markdown and store to state.
    const judcri = await judcriEditor.blocksToMarkdownLossy(
      judcriEditor.document
    );
    setJudcri(judcri);
  };

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

        await storeFair({
          title: data.title,
          subtitle: data.subtitle,
          imageUrl,
          storageId,
          about: about,
          deadline,
          requirements: req,
          prices: price,
          judgingCriteria: judcri,
          format: "image",
        })
          .then(() => {
            toast.success("Fair created successfully!");
            router.push(`/judge/${user?._id}`);
          })
          .catch((error) => {
            console.log(error);
            toast.error("Create fair error");
          });
          console.log("in promise")
      })
      
    );
    console.log("clicked")
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
          <label className="block text-gray-800 font-semibold text-sm">
            Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        <div className="mb-6 mt-4">
          <label className="block text-gray-800 font-semibold text-sm mb-2">
            About the fair
          </label>
          <BlockNoteView
            editor={aboutEditor}
            onChange={onAboutChange}
            className="border rounded-lg py-4"
          />
        </div>

        <div className="mb-6 mt-4">
          <label className="block text-gray-800 font-semibold text-sm mb-2">
            Requirements
          </label>
          <BlockNoteView
            editor={reqEditor}
            onChange={onReqChange}
            className="border rounded-lg py-4"
          />
        </div>

        <div className="mb-6 mt-4">
          <label className="block text-gray-800 font-semibold text-sm mb-2">
            Prices
          </label>
          <BlockNoteView
            editor={priceEditor}
            onChange={onPricesChange}
            className="border rounded-lg py-4"
          />
        </div>

        <div className="mb-6 mt-4">
          <label className="block text-gray-800 font-semibold text-sm mb-2">
            Judging Criteria
          </label>
          <BlockNoteView
            editor={judcriEditor}
            onChange={onJudcriChange}
            className="border rounded-lg py-4"
          />
        </div>

        <Button
          type="submit"
          variant="default"
          className="mt-6 w-full py-3 font-semibold rounded-lg"
        >
          Create Fair
        </Button>
      </form>
    </Form>
  );
};

export default CreateCompetition;
