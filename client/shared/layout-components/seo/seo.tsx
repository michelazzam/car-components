import React from "react";
import Head from "next/head";
import favicon from "../../../public/assets/images/brand-logos/thermobox-nobg.png";

const Seo = ({ title }: any) => {
  let i = `ThermoBox`;

  return (
    <Head>
      <title>{i}</title>
      <div className="hidden">{title}</div>
      <link href={favicon.src} rel="icon"></link>
      <meta name="description" content="Thermoboc - APOS" />
      <meta name="author" content="Spruko Technologies Private Limited" />
      <meta
        name="keywords"
        content="system, pos, apos, Thermobox, Thermobox - APOS"
      ></meta>
    </Head>
  );
};

export default Seo;
