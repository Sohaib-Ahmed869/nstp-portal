import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { AdminService } from '../../services';

const Blog = () => {
    const [blog, setBlog] = useState({});
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await AdminService.getBlog(id);
                if (response.error) {
                    console.log(response.error);
                    return;
                }
                console.log(response.data.blog);
                const blogData = response.data.blog;

                // Transform the blog data
                const content = blogData.paragraphs.map((paragraph, index) => ({
                    type: "para",
                    content: paragraph
                }));

                // Insert the image at the specified index
                content.splice(blogData.image_index, 0, {
                    type: "image",
                    content: blogData.image,
                    caption: blogData.caption
                });

                const transformedBlog = {
                    id: blogData._id,
                    date: new Date(blogData.date_published).toISOString().split('T')[0], // Format date as YYYY-MM-DD
                    title: blogData.title,
                    content: content
                };

                // Set the transformed blog data
                setBlog(transformedBlog);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [id]);

    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            <div className={`bg-base-100 rounded-lg ring-1 ring-base-200 lg:m-10 md:m-5 max-sm:m-5 max-sm:mx-2 max-sm:p-3 p-10 ${loading && "hidden"}`}>
                <div className="flex flex-col items-start gap-3">
                    <button className="btn btn-secondary " onClick={() => window.history.back()}>
                        <ArrowLeftIcon className="h-5 w-5" />
                        Go back
                    </button>
                    <p className="text-3xl font-semibold">{blog.title}</p>
                    <p className="text-gray-500 text-sm">{"Posted on " + blog.date}</p>
                </div>
                <hr className="my-5 text-gray-200"></hr>
                <div>
                    {blog?.content?.map((item, index) => {
                        if (item.type === 'para') {
                            return <p key={index} className="text-lg my-5">{item.content}</p>
                        }
                        if (item.type === 'image') {
                            return (
                                <div className="flex flex-col items-center">
                                    <img key={index} src={item.content} className="w-full lg:w-2/3 h-auto rounded-xl" alt="Blog Image" />
                                    <p className="text-center text-gray-500 font-bold text-md my-2">{item.caption}</p>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>

        </Sidebar>
    )
}

export default Blog
