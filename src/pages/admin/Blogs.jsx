import React, { useState, useEffect, useContext } from 'react'
import Sidebar from '../../components/Sidebar';
import { PencilSquareIcon, EllipsisVerticalIcon, EyeIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import NSTPLoader from '../../components/NSTPLoader';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import { AdminService } from '../../services';
import showToast from '../../util/toast';

const Blogs = () => {

    const [blogsList, setBlogsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newBlog, setNewBlog] = useState({});
    const [selectedBlogId, setSelectedBlogId] = useState(null); //selected id for edit or delete
    const [dropdownOpen, setDropdownOpen] = useState(null); // state to manage dropdown visibility
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await AdminService.getBlogs();
                if (response.error) {
                    console.log(response.error);
                    return;
                }
                console.log(response.data.blogs);
                const blogs = response.data.blogs.map(blog => {
                    const content = blog.paragraphs.map((paragraph, index) => ({
                        type: "para",
                        content: paragraph
                    }));

                    // Insert the image at the specified index
                    content.splice(blog.image_index, 0, {
                        type: "image",
                        content: blog.image,
                        caption: blog.caption
                    });

                    // Handle invalid date
                    let formattedDate;
                    try {
                        formattedDate = new Date(blog.date_published).toISOString().split('T')[0];
                    } catch (error) {
                        console.error('Invalid date:', blog.date_published);
                        formattedDate = 'Invalid date';
                    }

                    return {
                        id: blog._id,
                        date: formattedDate, // Format date as YYYY-MM-DD
                        title: blog.title,
                        content: content
                    };
                });
                setBlogsList(blogs);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    const [blogIdToDelete, setBlogIdToDelete] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const deleteBlog = async (blogId) => {
        console.log('Deleting blog:', blogId);
        setModalLoading(true);

        try {

            const response = await AdminService.deleteBlog(blogId);
            if (response.error) {
                console.error(response.error);
                showToast(false, response.error);
                return;
            }
            
            setBlogsList(blogsList.filter(blog => blog.id !== blogId));
            showToast(true, response.message);

        } catch (error) {
            console.error(error);
            showToast(false, 'Failed to delete blog');
        } finally {
            document.getElementById('delete-blog-modal').close();
            setModalLoading(false);
        }
    }

    return (
        <Sidebar>
            {/** Confirmation modal for deletion */}
            <DeleteConfirmationModal 
                id={"delete-blog-modal"} 
                title={"Delete Blog"} 
                message={"This action cannot be undone. It will also remove the blog from the NSTP website permanently."} 
                onConfirm={() => deleteBlog(blogIdToDelete)} 
                modalLoading={modalLoading} 
            />

            {loading && <NSTPLoader />}
            <div className={`bg-base-100 rounded-lg ring-1 ring-base-200 lg:m-10 md:m-5 max-sm:m-5 max-sm:mx-2 max-sm:p-3 p-10 ${loading && "hidden"}`}>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">Manage Blog Posts</p>
                    <Link to="create" className="btn btn-primary text-base-100">
                        <PencilSquareIcon className="size-6" />
                        Write New Blog Post</Link>
                </div>
                <hr className="my-5 text-gray-200"></hr>
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 2xl:gap-10 gap-4 lg:gap-16">
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
                                                    <button className="flex items-center gap-2" onClick={() => {setBlogIdToDelete(blog.id); document.getElementById('delete-blog-modal').showModal() } }>
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
