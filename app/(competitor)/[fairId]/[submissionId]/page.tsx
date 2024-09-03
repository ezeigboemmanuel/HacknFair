import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import SubmissionPage from "../_components/submissionpage";

export async function generateMetadata({
  params,
}: {
  params: { submissionId: Id<"submissions">, fairId: Id<"fairs"> };
}) {
  const fair = await fetchQuery(api.fairs.getSingleFair, {
    id: params.fairId as Id<"fairs">,
  });
  const singleSubmission = await fetchQuery(
    api.submissions.getSingleSubmission,
    {
      id: params.submissionId,
    }
  );

  return {
    metadataBase: new URL("https://hacknfair.vercel.app"),
    title: singleSubmission?.map((item) => item.title)[0],
    description: singleSubmission?.map((item) => item.about)[0],
    openGraph: {
      title: singleSubmission?.map((item) => item.title)[0],
      description: singleSubmission?.map((item) => item.about)[0],
      url: `https://hacknfair.vercel.app/${fair?.map((item) => item._id)[0]}/${singleSubmission?.map((item) => item._id)[0]}`,
      siteName: "HacknFair",
      images: [
        {
          url: singleSubmission?.map((item) => item.imageUrls).map((url) => url)[0],
        },
      ],
    },
  };
}

const page = ({ params }: { params: { submissionId: Id<"submissions"> } }) => {
  return (
    <div className="mx-2">
      <SubmissionPage params={params} />
    </div>
  );
};

export default page;
