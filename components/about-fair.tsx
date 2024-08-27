import { AspectRatio } from "./ui/aspect-ratio";
import { marked } from "marked";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AboutFairProps {
  title: string;
  subtitle: string;
  deadline: string | undefined;
  imageUrl: string;
  about: string;
  requirements: string | undefined;
  prices: string | undefined;
  judgingCriteria: string | undefined;
  name?: string;
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
  name,
}: AboutFairProps) => {
  return (
    <div className="mt-5">
      <h1 className="font-bold break-normal text-3xl md:text-5xl">{title}</h1>
      <h3 className="italic text-gray-500">{subtitle}</h3>
      <p className="mt-2 mb-2 text-sm">Created by: {name}</p>
      <p className="mt-2 mb-2 text-sm">Deadline: {deadline}</p>
      <AspectRatio ratio={16 / 9}>
        <img src={imageUrl} className="object-cover w-full h-full" />
      </AspectRatio>

      <h2 className="my-6 font-semibold text-2xl">About</h2>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              style={{ fontWeight: "bold", fontSize: "28px", margin: "16px 0" }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              style={{ fontWeight: "bold", fontSize: "24px", margin: "14px 0" }}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              style={{ fontWeight: "bold", fontSize: "20px", margin: "12px 0" }}
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              style={{ fontSize: "16px", lineHeight: "1.6", margin: "10px 0" }}
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              style={{ color: "#1a0dab", textDecoration: "underline" }}
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong style={{ fontWeight: "bold" }} {...props} />
          ),
          em: ({ node, ...props }) => (
            <em style={{ fontStyle: "italic" }} {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              style={{
                borderLeft: "4px solid #ccc",
                paddingLeft: "16px",
                color: "#666",
                margin: "16px 0",
                fontStyle: "italic",
              }}
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              style={{ listStyleType: "disc", marginLeft: "40px" }}
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              style={{ listStyleType: "decimal", marginLeft: "40px" }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li style={{ marginBottom: "8px" }} {...props} />
          ),
          table: ({ node, ...props }) => (
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                margin: "20px 0",
              }}
              {...props}
            />
          ),
          thead: ({ node, ...props }) => (
            <thead style={{ backgroundColor: "#f5f5f5" }} {...props} />
          ),
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr: ({ node, ...props }) => (
            <tr style={{ borderBottom: "1px solid #ddd" }} {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              style={{
                padding: "12px 15px",
                textAlign: "left",
                fontWeight: "bold",
              }}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              style={{ padding: "12px 15px", textAlign: "left" }}
              {...props}
            />
          ),
          img: ({ node, ...props }) => (
            <img
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                margin: "10px 0",
              }}
              {...props}
            />
          ),
          code: ({ node, ...props }) => (
            <code
              style={{
                backgroundColor: "#f5f5f5",
                padding: "2px 4px",
                borderRadius: "4px",
                fontSize: "14px",
              }}
              {...props}
            />
          ),
          pre: ({ node, ...props }) => (
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "16px",
                borderRadius: "8px",
                overflowX: "auto",
                margin: "20px 0",
              }}
              {...props}
            />
          ),
        }}
      >
        {about}
      </ReactMarkdown>
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
