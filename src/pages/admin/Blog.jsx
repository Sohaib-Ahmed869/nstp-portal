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
                const blog = response.data.blog;
                // setBlog(blog);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();

        // setTimeout(() => {
        //     setLoading(false);
        //     setBlog({
        //         id: 1,
        //         date: '2022-05-25',
        //         title: 'Blog 1',
        //         content: [
                   
        //             {
        //                 type: "para",
        //                 content: "Elit aenean elementum consectetur leo semper ipsum leo. Sit porttitor nisi vivamus aenean tellus vendor lorem. Sit nisi. Ipsum lorem aenean vendor semper tellus elementum lorem sed. Lorem. Aenean nisi lorem semper nisi vendor tellus leo. Nisi sed consectetur dolor ipsum aenean. Leo ipsum consectetur. Semper vivamus elit. Lorem vivamus sit elit eiusmod semper vendor sed. Elit sit elementum lorem. Vivamus vendor sit leo semper. Sed. Semper tellus consectetur vivamus tellus aenean. Elementum tellus consectetur elit vivamus. Semper consectetur sit porttitor. Leo eiusmod vivamus. Elementum ipsum tellus elit consectetur semper. Vendor semper vivamus ipsum eiusmod leo. Vivamus vendor tellus aenean."
        //             },
        //             {
        //                 type: "image",
        //                 content: "https://static.desygner.com/wp-content/uploads/sites/13/2022/05/04141642/Free-Stock-Photos-01.jpg",
        //                 caption: "A pile of stones represents balance and serenity."
        //             },
        //             {
        //                 type: "para",
        //                 content: "Elit aenean elementum consectetur leo semper ipsum leo. Sit porttitor nisi vivamus aenean tellus vendor lorem. Sit nisi. Ipsum lorem aenean vendor semper tellus elementum lorem sed. Lorem. Aenean nisi lorem semper nisi vendor tellus leo. Nisi sed consectetur dolor ipsum aenean. Leo ipsum consectetur. Semper vivamus elit. Lorem vivamus sit elit eiusmod semper vendor sed. Elit sit elementum lorem. Vivamus vendor sit leo semper. Sed. Semper tellus consectetur vivamus tellus aenean. Elem."
        //             },
        //             {
        //                 type: "para",
        //                 content: "This is the  paragraph 3 content of blog 1"
        //             }
        //         ]
        //     });
        // }

        //     , 2000);
    }, []);

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
