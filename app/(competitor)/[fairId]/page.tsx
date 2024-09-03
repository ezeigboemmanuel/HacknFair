import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import FairPage from "./_components/fairpage";



export async function generateMetadata({ params }: { params: { fairId: Id<"fairs"> } }) {
  const fair = await fetchQuery(api.fairs.getSingleFair, {
    id: params.fairId,
  });

  return {
    metadataBase: new URL("https://hacknfair.vercel.app"),
    title: fair?.map((item) => item.title)[0],
    description: fair?.map((item) => item.subtitle)[0],
    openGraph: {
      title: fair?.map((item) => item.title)[0],
      description: fair?.map((item) => item.subtitle)[0],
      url: `https://hacknfair.vercel.app/${fair?.map((item) => item._id)[0]}`,
      siteName: "HacknFair",
      images: [
        {
          url: fair?.map((item) => item.imageUrl),
        },
      ],
    },
  };
}

const page = async ({ params }: { params: { fairId: Id<"fairs"> } }) => {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <FairPage params={params} />
    </div>
  );
};

export default page;
