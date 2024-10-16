import React, { useState, useEffect, useContext } from 'react'
import Sidebar from '../../components/Sidebar';
import { PencilSquareIcon, EllipsisVerticalIcon, EyeIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import NSTPLoader from '../../components/NSTPLoader';

const Blogs = () => {

    const [blogsList, setBlogsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBlog, setNewBlog] = useState({});
    const [selectedBlogId, setSelectedBlogId] = useState(null); //selected id for edit or delete
    const [dropdownOpen, setDropdownOpen] = useState(null); // state to manage dropdown visibility
    const navigate = useNavigate()
    useEffect(() => {
        //simulate api call to load blogs
        setTimeout(() => {
            setLoading(false);
            setBlogsList([
                {
                    id: 1,
                    date: '2022-05-25',
                    title: 'Blog 1',
                    content: [
                        {
                            type: "para",
                            content: "This is the  paragraph 1 content of blog 1"
                        },
                        {
                            type: "image",
                            content: "https://static.desygner.com/wp-content/uploads/sites/13/2022/05/04141642/Free-Stock-Photos-01.jpg"
                        },
                        {
                            type: "para",
                            content: "This is the  paragraph 2 content of blog 1"
                        },
                        {
                            type: "para",
                            content: "This is the  paragraph 3 content of blog 1"
                        }
                    ]
                },
                {
                    id: 2,
                    date: '2022-05-26',
                    title: 'Blog 2',
                    content: [
                        {
                            type: "image",
                            content: "https://static.desygner.com/wp-content/uploads/sites/13/2022/05/04141642/Free-Stock-Photos-01.jpg"
                        },
                        {
                            type: "para",
                            content: "This is the  paragraph 1 content of blog 1"
                        },

                        {
                            type: "para",
                            content: "This is the  paragraph 2 content of blog 1"
                        },
                        {
                            type: "para",
                            content: "This is the  paragraph 3 content of blog 1"
                        }
                    ]
                },
            ]);
        }
            , 2000);

    }, []);

    return (
        <Sidebar>
            {loading && <NSTPLoader />}
            <div className={`bg-base-100 rounded-lg ring-1 ring-base-200 lg:m-10 md:m-5 max-sm:m-5 max-sm:mx-2 max-sm:p-3 p-10 ${loading && "hidden"}`}>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">Manage Blog Posts</p>
                    <Link to="create" className="btn btn-primary text-base-100">
                        <PencilSquareIcon className="size-6" />
                        Write New Blog Post</Link>
                </div>
                <hr className="my-5 text-gray-200"></hr>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {blogsList.map(blog => (
                        <div key={blog.id} className="card bg-white shadow-md rounded-lg overflow-visible">
                            <img src={blog.content.find(item => item.type === 'image').content} alt="Blog Thumbnail" className="w-full h-48 object-cover rounded-t-lg " />
                            <div className="p-4  overflow-visible">
                                <div className="flex justify-between items-center overflow-visible">
                                    <h2 className="text-xl font-semibold">{blog.title}</h2>
                                   
                                    <div className="relative z-50">
                                        <button
                                            className="btn btn-ghost btn-circle"
                                            onClick={() => setDropdownOpen(dropdownOpen === blog.id ? null : blog.id)}
                                        >
                                            <EllipsisVerticalIcon className="h-6 w-6" />
                                        </button>
                                        {dropdownOpen === blog.id && (
                                            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 absolute right-0 mt-2">
                                                <li>
                                                    <button className="flex items-center gap-2" onClick={() => navigate('/admin/blogs/' + blog.id)} >
                                                        <EyeIcon className="h-5 w-5" />
                                                        View
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="flex items-center gap-2">
                                                        <TrashIcon className="h-5 w-5" />
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-2">{blog.content.find(item => item.type === 'para').content.split(' ').slice(0, 10).join(' ')}...</p>
                                <p className="text-gray-600 text-sm">{blog.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Sidebar>
    )
}

export default Blogs
