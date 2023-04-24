// import Image from "next/image";
// import { getAllSlugs, getPostData } from "@/lib/posts";
import styles from "@/styles/BlogPost.module.css";
import { TextElement } from "../index";
import Link from "next/link";
import { request } from "@/lib/datocms";
import { Image, StructuredText } from "react-datocms";


export default function BlogPost(props) {
    // const { postData } = props;
    const postData = props.postData;
    console.log(postData);
  return (
    <div className={styles.container}>
        <div className="max-w-2xl mb-20 mt-12">
            {/* Nextjs image */}
            {/* <Image
                src={postData.coverImage}
                alt={postData.title}
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto"
                placeholder="blur"
                blurDataURL={postData.coverImage}
            /> */}
            <Image data={postData.coverImage.responsiveImage} />
            <h2 className="mt-7 mb-2 text-4xl font-extrabold dark:text-white">
                {postData.title}
            </h2>
            <p className="mb-5 text-gray-500 ">{postData.author.name} / {postData.publishDate}</p>
            {/* <TextElement>{postData.content}</TextElement> */}
            <StructuredText data={postData.content} renderBlock={({ record }) => {
                switch(record.__typename) {
                    case 'ImageRecord':
                        return <Image data={record.image.responsiveImage} />;
                    default:
                        return null;
                }
            }} />
            <Link href="/"><p className="mt-12 text-lg inline-block hover:text-sky-700">⬅️  Back to blogs</p></Link>
        </div>
    </div>
  )
}

const PATHS_QUERY = `
query MyQuery {
    allArticles {
      slug
    }
  }
`;

// For data from lib/posts.js
// export const getStaticPaths = () => {
//     const paths = getAllSlugs();
//     return {
//         paths,
//         fallback: false,
//     };
// };
export const getStaticPaths = async () => {
    const slugQuery = await request({
        query: PATHS_QUERY,
    });

    let paths = [];
    slugQuery.allArticles.map((article) => {
        paths.push(`/blog/${article.slug}`);
    });

    return {
        paths,
        fallback: false,
    };
};


const ARTICLE_QUERY = `
query MyQuery($slug: String) {
    article(filter: {slug: {eq: $slug}}) {
      author {
        name
      }
      content {
        value
        blocks {
            __typename
            ... on ImageRecord {
                id
                image {
                    responsiveImage {
                        width
                        webpSrcSet
                        title
                        srcSet
                        src
                        sizes
                        height
                        bgColor
                        base64
                        aspectRatio
                        alt
                    }
                }
            }
        }
      }
      coverImage {
        responsiveImage {
          width
          webpSrcSet
          title
          srcSet
          src
          sizes
          height
          bgColor
          base64
          aspectRatio
          alt
        }
      }
      id
      publishDate
      slug
      title
    }
  }
`;
// For data from lib/posts.js
// export const getStaticProps = ({ params }) => {
//     const postData = getPostData(params.slug);
//     return {
//         props: {
//             postData,
//         },
//     };
// };
export const getStaticProps = async ({ params }) => {
    const post = await request({
        query: ARTICLE_QUERY,
        variables: { slug: params.slug },
    });

    return {    
        props: {
            postData: post.article,
        },
    };
};