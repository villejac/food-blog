import Head from "next/head";
import styles from "@/styles/Home.module.css";
// for static posts from lib/posts.js
import { getAllPosts } from "@/lib/posts";
// import Image from "next/image";
import Link from "next/link";
import { request } from "@/lib/datocms";
import { Image } from "react-datocms";

const HOMEPAGE_QUERY = `
query MyQuery {
  allArticles {
    author {
      name
    }
    content {
      value
    }
    coverImage {
      responsiveImage {
        aspectRatio
        alt
        base64
        height
        bgColor
        sizes
        src
        srcSet
        title
        webpSrcSet
        width
      }
    }
    excerpt
    id
    publishDate
    slug
    title
  }
}`;
export async function getStaticProps() {
  const data = await request({
    query: HOMEPAGE_QUERY,
  });
  return {
    props: { data },
  };
}

export default function Home(props) {
  // for static posts from lib/posts.js
  // const posts = getAllPosts();
  const data = props.data;
  const posts = data.allArticles;
  return (
    <div className={styles.container}>
      <Head>
        <title>Cooking w/ Ville</title>
        <meta name="description" content="Cooking w/ Ville" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div>
        <h1 className="mb-12 mt-12 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Cooking w/{" "}
          <span className="text-blue-600 dark:text-blue-500">Ville</span>
        </h1>
      </div>
      <div>
        {posts.map((post) => {
          return <BlogPostPreview key={post.id} post={post} />;
        })}
      </div>
    </div>
  );
}

const BlogPostPreview = ({ post }) => {
  const { title, coverImage, publishDate, excerpt, author } = post;
  return (
    <div className="max-w-md mb-20">
      {/* Nextjs Image */}
      {/* <Image
        src={coverImage.url}
        alt={title}
        width="0"
        height="0"
        sizes="100vw"
        className="w-full h-auto"
        placeholder="blur"
        blurDataURL={coverImage.url}
      /> */}
      <Image data={coverImage.responsiveImage} />
      <Link href={`/blog/${post.slug}`}>
        <h2 className="mt-7 mb-2 text-4xl font-extrabold dark:text-white hover:text-sky-700 dark:hover:text-sky-700">
          {title}
        </h2>
      </Link>
      <div className="mb-5 text-gray-500">{publishDate}</div>
      <TextElement>{excerpt}</TextElement>
      <div className="text-sm font-bold text-blue-500 lg:text-sm dark:text-gray-400">
        {author.name}
      </div>
    </div>
  );
};

export const TextElement = ({ children }) => {
  return (
    <p className="mb-4 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
      {children}
    </p>
  );
};
