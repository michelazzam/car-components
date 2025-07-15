// src/shared/layout-components/seo/seo.tsx
import React from "react";
import Head from "next/head";
import favicon from "../../../public/assets/images/ams.ico";
import { getProjectConfig } from "@/lib/projectConfig";

interface SeoProps {
  title: string;
  description?: string;
  author?: string;
  keywords?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description, author, keywords }) => {
  const config = getProjectConfig();

  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href={favicon.src} />
      <meta name="description" content={description || config.description} />
      <meta name="author" content={author || config.author} />
      <meta name="keywords" content={keywords || config.keywords} />
    </Head>
  );
};

export default Seo;
