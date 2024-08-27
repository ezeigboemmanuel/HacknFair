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
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
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
});

interface EditCompetitionProps {
  title: string;
  subtitle: string;
  initialDeadline: string;
  initialAbout: string;
  initialRequirements: string;
  initialPrices: string;
  initialJudgingCriteria: string;
  imageURL: string;
  fairId: Id<"fairs">;
  fmrStorageId: Id<"_storage">;
}

const EditCompetition = ({
  title,
  subtitle,
  initialAbout,
  initialDeadline,
  fairId,
  imageURL,
  initialJudgingCriteria,
  initialPrices,
  fmrStorageId,
  initialRequirements,
}: EditCompetitionProps) => {
  const updateFair = useMutation(api.fairs.updateFair);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title,
      subtitle,
    },
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(imageURL);
  const [deadline, setDeadline] = useState(initialDeadline);
  const [about, setAbout] = useState<string>(initialAbout);
  const [req, setReq] = useState<string>(initialRequirements);
  const [price, setPrice] = useState<string>(initialPrices);
  const [judcri, setJudcri] = useState<string>(initialJudgingCriteria);

  const router = useRouter();

  const user = useQuery(api.users.getCurrentUser);

  const generateUploadUrl = useMutation(api.fairs.generateUploadUrl);

  // Creates a new editor instance with some initial content.
  const aboutEditor = useCreateBlockNote();
  const reqEditor = useCreateBlockNote();
  const priceEditor = useCreateBlockNote();
  const judcriEditor = useCreateBlockNote();

  // For initialization; on mount, convert the initial Markdown to blocks and replace the default editor's content
  useEffect(() => {
    async function loadInitialHTML() {
      const aboutBlocks = await aboutEditor.tryParseMarkdownToBlocks(about);
      aboutEditor.replaceBlocks(aboutEditor.document, aboutBlocks);
      const reqBlocks = await reqEditor.tryParseMarkdownToBlocks(req);
      reqEditor.replaceBlocks(reqEditor.document, reqBlocks);
      const priceBlocks = await priceEditor.tryParseMarkdownToBlocks(price);
      priceEditor.replaceBlocks(priceEditor.document, priceBlocks);
      const judcriBlocks = await judcriEditor.tryParseMarkdownToBlocks(judcri);
      judcriEditor.replaceBlocks(judcriEditor.document, judcriBlocks);
    }
    loadInitialHTML();
  }, [aboutEditor, reqEditor, priceEditor, judcriEditor]);

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

    if (selectedImages.length === 0) {
      await updateFair({
        id: fairId,
        title: data.title,
        subtitle: data.subtitle,
        imageUrl,
        about: about,
        deadline,
        storageId: fmrStorageId,
        requirements: req,
        prices: price,
        judgingCriteria: judcri,
        format: "image",
      })
        .then(() => {
          toast.success("Fair updated successfully!");
          router.push(`/judge/${user?._id}`);
        })
        .catch((error) => {
          console.log(error);
          toast.success("Update fair error");
        });
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
          about: about,
          deadline,
          requirements: req,
          prices: price,
          judgingCriteria: judcri,
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
          <label className="block text-gray-800 font-semibold">Deadline</label>
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
            defaultValue={initialAbout}
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
          Edit Fair
        </Button>
      </form>
    </Form>
  );
};

export default EditCompetition;
