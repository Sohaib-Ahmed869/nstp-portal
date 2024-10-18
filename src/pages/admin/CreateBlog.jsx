import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
    PhotoIcon,
    TrashIcon,
    CheckBadgeIcon,
    Bars3BottomLeftIcon,
    ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import showToast from '../../util/toast';
import { AdminService } from '../../services';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState([]);
    const [hasImage, setHasImage] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [caption, setCaption] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // State for image URL
    const [imageIndex, setImageIndex] = useState(0);
    const [imageFile, setImageFile] = useState(null); // State for image file

    const addParagraph = () => {
        const newContent = {
            type: "para",
            content: "",
            id: Date.now(), // Unique ID for each paragraph
        };
        setContent([...content, newContent]);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addImage = () => {
        if (!imageFile || !caption.trim()) {
            showToast(false, 'Please provide both an image and a caption.');
            return;
        }
        setModalLoading(true);

        setTimeout(() => {
            setImageIndex(content.length); // Set image index to the current number of paragraphs
            setContent([...content, {
                type: "image",
                content: imageUrl, // Use the actual image URL
                caption,
                id: Date.now()
            }]);
            setHasImage(true);
            setCaption('');
            setImageUrl(''); // Reset image URL
            setModalLoading(false);
            document.getElementById("upload-image-modal").close();
        }, 1000);
        // In real implementation, handle file upload
    };

    const updateParagraph = (id, value) => {
        setContent(content.map(item =>
            item.id === id ? { ...item, content: value } : item
        ));
    };

    const deleteContent = (id) => {
        setContent(content.filter(item => item.id !== id));
        if (content.find(item => item.id === id).type === 'image') {
            setHasImage(false);
        }
    };

    const handleCreate = async () => {
        if (title.trim() === '') {
            showToast(false, 'Please enter a title for the blog post');
            return;
        }
        if (content.length <= 0 || content.every(item => item.content.trim() === '')) {
            showToast(false, 'Please add some content to the blog post');
            return;
        }
        if (content.some(item => item.type === 'para' && item.content.trim() === '')) {
            showToast(false, 'Paragraphs cannot be empty');
            return;
        }
        setCreateLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        content.forEach((item, index) => {
            if (item.type === 'para') {
                formData.append('paragraphs', item.content);
            }
            if (item.type === 'image') {
                formData.append('image', imageFile);
                formData.append('caption', item.caption);
                formData.append('imageIndex', imageIndex);
            }
        });

        // Log FormData entries
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await AdminService.addBlog(formData);
            if (response.error) {
                console.log(response.error);
                showToast(false, response.error);
                return;
            }

            setCreateLoading(false);
            showToast(true, response.message);
        } catch (error) {
            console.log(error);
            showToast(false, 'An error occurred. Please try again.');
        } finally {
            setTitle('');
            setContent([]);
            setHasImage(false);
            setImageIndex(0);
            setCreateLoading(false);
        }

        // setTimeout(() => {
        //     // Handle successful upload API call
        //     setCreateLoading(false);
        //     showToast(true, 'Blog post created successfully');
        //     // Reset the form
        //     setTitle('');
        //     setContent([]);
        //     setHasImage(false);
        //     setImageIndex(0);
        // }, 2000);
        // // In real implementation, handle API call to create blog post
    };

    const adjustTextareaHeight = (e) => {
        e.target.style.height = 'auto'; // Reset the height
        e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scroll height
    };

    return (
        <Sidebar>
            <div className="bg-base-100 rounded-lg ring-1 ring-base-200 lg:m-10 md:m-5 max-sm:m-5 max-sm:mx-2 max-sm:p-3 p-10">
                <div className="flex flex-col items-center">
                    <input
                        type="text"
                        placeholder="Enter Blog Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-4xl font-bold border-b-2 border-t-0 border-l-0 border-r-0 border-gray-300 focus:border-none focus:ring-2 focus:rounded-lg focus:ring-primary mb-8 bg-transparent"
                    />
                </div>

                <div className="space-y-6">
                    {content.map((item, index) => (
                        <div key={item.id} className="w-full relative">
                            {item.type === 'para' ? (
                                <div className="space-y-2">
                                    <textarea
                                        className="textarea-blog focus:border-0 border-gray-200 w-full min-h-[100px] p-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter your paragraph..."
                                        value={item.content}
                                        onChange={(e) => {
                                            updateParagraph(item.id, e.target.value);
                                            adjustTextareaHeight(e);
                                        }}
                                        onInput={adjustTextareaHeight} // Ensure height is adjusted on input
                                    />
                                </div>
                            ) : (
                                <div className="w-full ring-1 ring-gray-200 rounded-lg pt-5 flex flex-col items-center">
                                    <img
                                        src={item.content}
                                        alt="Blog content"
                                        className="w-full max-w-screen-md  h-auto object-cover rounded-lg"
                                    />
                                    <p className="text-center font-sm text-gray-500 font-bold my-2">{item.caption}</p>
                                </div>
                            )}
                            <button
                                className="absolute top-2 right-2 btn btn-outline btn-sm btn-error btn-circle"
                                onClick={() => deleteContent(item.id)}
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}

                    <div className="flex gap-4 mb-8">
                        <button
                            className="btn btn-primary text-base-100"
                            onClick={addParagraph}
                        >
                            <Bars3BottomLeftIcon className="h-5 w-5" />
                            Add Paragraph
                        </button>

                        {!hasImage && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => { document.getElementById("upload-image-modal").showModal(); }}
                            >
                                <PhotoIcon className="h-5 w-5" />
                                Add Image
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        className={`btn btn-primary text-base-100 ${(content.length <= 0 || createLoading) && "btn-disabled"}`}
                        onClick={handleCreate}
                    >
                        {createLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <CheckBadgeIcon className="h-5 w-5" />
                        )}
                        {createLoading ? "Please wait..." : "Create Blog Post"}
                    </button>
                </div>

            </div>

            <dialog
                id="upload-image-modal"
                className="modal"
            >
                <div className="modal-box">
                    <div className="flex gap-3 items-center">
                        <PhotoIcon className="size-8 text-primary" />
                        <h3 className="font-bold text-lg">
                            Upload image for this blog
                        </h3>
                    </div>
                    <p className="py-4">This image will also act as the feature image. Note: you may only upload one image per blog.</p>

                    <input
                        type="file"
                        className="file-input file-input-bordered file-input-primary focus:border-0 w-full max-w-xs"
                        onChange={handleFileChange} 
                    />

                    <input type="text" placeholder="Caption" className="mt-3 input input-bordered w-full" value={caption} onChange={(e) => setCaption(e.target.value)} />

                    <div className="modal-action">
                        <button
                            className={`btn mr-2 ${modalLoading && "btn-disabled"}`}
                            onClick={() => {
                                document.getElementById("upload-image-modal").close();
                            }}
                        >
                            Close
                        </button>
                        <button
                            className={`btn btn-primary text-base-100 ${(modalLoading )&& "btn-disabled"}`}
                            onClick={() => { addImage(); }}
                        >
                            {modalLoading && (
                                <span className="loading loading-spinner"></span>
                            )}
                            {modalLoading ? "Please wait..." : "Upload Image"}
                        </button>
                    </div>
                </div>
            </dialog>

        </Sidebar>
    );
};

export default CreateBlog;