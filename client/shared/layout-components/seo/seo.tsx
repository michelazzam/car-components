// src/shared/layout-components/seo/seo.tsx
import React from "react";
import Head from "next/head";
import favicon from "../../../public/assets/images/ams.ico";

interface SeoProps {
  title: string;
  description?: string;
  author?: string;
  keywords?: string;
}

const Seo: React.FC<SeoProps> = ({
  title,
  description = "Car Components",
  author = "Car Components",
  keywords = "system, pos, apos, Car Components, Car Components - APOS",
}) => (
  <Head>
    <title>{title}</title>
    <link rel="icon" href={favicon.src} />
    <meta name="description" content={description} />
    <meta name="author" content={author} />
    <meta name="keywords" content={keywords} />
  </Head>
);

export default Seo;
