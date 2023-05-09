import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description: string;
  indexPage: boolean;
  canonicalPathname: string;
};

export const Seo = (props: SeoProps) => {
  return (
    <Helmet>
      <title>{`${props.title} - JayCloud`}</title>
      <meta name="description" content={props.description} />
      {!props.indexPage && <meta name="robots" content="noindex" />}
      <link rel="canonical" href={location.origin + props.canonicalPathname} />
    </Helmet>
  );
};
