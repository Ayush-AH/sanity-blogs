import { client } from "@/sanity/lib/client";
import Link from "next/link";
import React from "react";

// Dummy blog data
const blogs = [
  {
    id: 1,
    title: "Understanding React Hooks",
    description: "A beginner's guide to React Hooks and how to use them effectively.",
    image: "https://source.unsplash.com/400x250/?react,code",
  },
  {
    id: 2,
    title: "Next.js for Beginners",
    description: "Learn how to build fast and SEO-friendly React apps with Next.js.",
    image: "https://source.unsplash.com/400x250/?nextjs,web",
  },
  {
    id: 3,
    title: "Tailwind CSS Basics",
    description: "Design beautiful and responsive UI quickly with Tailwind CSS.",
    image: "https://source.unsplash.com/400x250/?css,design",
  },
];
export const allPostsQuery = `*[_type == "post"]{
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


const BlogPage = ({posts}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MyBlog</h1>
          <ul className="flex gap-6">
            <li><a href="#" className="hover:text-gray-400">Home</a></li>
            <li><a href="#" className="hover:text-gray-400">Blog</a></li>
            <li><a href="#" className="hover:text-gray-400">About</a></li>
            <li><a href="#" className="hover:text-gray-400">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className=" py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Our Latest Blogs</h2>
          <p className="text-gray-600">Explore our latest articles on web development, design, and tech.</p>
        </div>
      </section>

      {/* Blog Cards */}
      <section className="flex-1 container mx-auto p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog._id}
              className="bg-gray border border-amber-100 shadow-lg rounded-lg overflow-hidden"
            >
              <img src={blog.image} alt={blog.alt} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-600">{blog.bodyText}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;



export async function getStaticProps() {
const posts = await client.fetch(allPostsQuery);
  return {
    props: {posts},
    revalidate: 60,
  };
}