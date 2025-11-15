import { client } from "@/sanity/lib/client";
import Link from "next/link";
import React from "react";

const allPostsQuery = `*[_type == "post"]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "bodyText": body[].children[].text,
  "author": author->name,
  "categories": categories[]->title,
  "image": mainImage.asset->url,
  "alt": mainImage.alt
} | order(publishedAt desc)`;
const singlePostQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  publishedAt,
  "bodyText": array::join(body[].children[].text, " "),
  "author": author->name,
  "categories": categories[]->title,
  "image": mainImage.asset->url,
  "alt": mainImage.alt
}`;

const BlogDetails = ({ post }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">MyBlog</Link>
        </div>
      </nav>

      {/* Banner */}
      <div className="w-full h-[60vh] overflow-hidden">
        <img
          src={post.image}
          alt={post.alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container bg-gray-900 mx-auto px-6 md:px-80 py-12 ">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <p>✍️ {post.author}</p>
          <p>🗓️ {new Date(post.publishedAt).toDateString()}</p>
        </div>

        <p className="text-lg leading-relaxed text-gray-700">{post.bodyText}</p>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetails;

// ======== STATIC PATHS (pre-generate pages) ========
export async function getStaticPaths() {
  const posts = await client.fetch(allPostsQuery);

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

// ======== STATIC PROPS (fetch data for each slug page) ========
export async function getStaticProps({ params }) {
  const post = await client.fetch(singlePostQuery, { slug: params.slug });

  return {
    props: {
      post,
    },
  };
}
