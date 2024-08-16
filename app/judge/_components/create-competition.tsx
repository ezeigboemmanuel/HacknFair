"use client";

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
  subTitle: z
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
  return <div>CreateCompetition</div>;
};

export default CreateCompetition;
