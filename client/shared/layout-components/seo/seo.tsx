import React from "react";
import Head from "next/head";
import favicon from "../../../public/assets/images/ams.ico";

const Seo = ({ title }: any) => {
  let i = `Car Components`;

  return (
    <Head>
      <title>{i}</title>
      <div className="hidden">{title}</div>
      <link href={favicon.src} rel="icon"></link>
      <meta name="description" content="Car Components" />
      <meta name="author" content="Car Components" />
      <meta
        name="keywords"
        content="system, pos, apos, Car Components, Car Components - APOS"
      ></meta>
    </Head>
  );
};

export default Seo;
