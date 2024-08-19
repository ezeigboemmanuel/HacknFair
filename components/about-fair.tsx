interface AboutFairProps {
  title: string;
  subtitle: string;
  deadline: string | undefined;
  imageUrl: string;
  about: string;
  requirements: string | undefined;
  prices: string | undefined;
  judgingCriteria: string | undefined;
}

const AboutFair = ({
  title,
  subtitle,
  deadline,
  imageUrl,
  about,
  requirements,
  prices,
  judgingCriteria,
}: AboutFairProps) => {
  return (
    <div className="mt-5">
      <h1 className="font-bold break-normal text-3xl md:text-5xl">{title}</h1>
      <h3 className="italic text-gray-500">{subtitle}</h3>
      <p className="mt-2 mb-2 text-sm">Deadline: {deadline}</p>
      <img src={imageUrl} />
      <h2 className="my-6 font-semibold text-xl">About</h2>
      <p>{about}</p>
      <h2 className="my-6 font-semibold text-xl">Requirements</h2>
      <p>{requirements}</p>
      <h2 className="my-6 font-semibold text-xl">Prices</h2>
      <p>{prices}</p>
      <h2 className="my-6 font-semibold text-xl">Judging Criteria</h2>
      <p>{judgingCriteria}</p>
    </div>
  );
};

export default AboutFair;
