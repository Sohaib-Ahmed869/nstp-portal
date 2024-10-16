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

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState([]);
    const [hasImage, setHasImage] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    const addParagraph = () => {
        const newContent = {
            type: "para",
            content: "",
            id: Date.now(), // Unique ID for each paragraph
        };
        setContent([...content, newContent]);
    };

    const addImage = () => {
        setModalLoading(true);
        setTimeout(() => {
            const dummyImageUrl = "https://static.desygner.com/wp-content/uploads/sites/13/2022/05/04141642/Free-Stock-Photos-01.jpg";
            setContent([...content, {
                type: "image",
                content: dummyImageUrl,
                id: Date.now()
            }]);
            setHasImage(true);
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
    const handleCreate = () => {
        if (title.trim() === '') {
            showToast(false, 'Please enter a title for the blog post');
            return;
        }
        if (content.length <= 0 || content.every(item => item.content.trim() === '')) {
            showToast(false, 'Please add some content to the blog post');
            return;
        }
        setCreateLoading(true);
        const blogPost = {
            title,
            content: content.map(({ type, content }) => ({ type, content }))
        };
        console.log('Created Blog Post:', blogPost);
        setTimeout(() => {
            //Handle successful upload api call
            setCreateLoading(false);
            showToast(true, 'Blog post created successfully');
            //reset the form 
            setTitle('');
            setContent([]);
            setHasImage(false);
        }, 2000);
        // In real implementation, handle api call to create blog post
        
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
                        className="w-full text-4xl font-bold border-b-2 border-gray-200 focus:outline-none focus:border-primary mb-8 bg-transparent"
                    />
                </div>

                <div className="space-y-6">
                    {content.map((item, index) => (
                        <div key={item.id} className="w-full relative">
                            {item.type === 'para' ? (
                                <div className="space-y-2">
                                    <textarea
    className="textarea-blog w-full min-h-[100px] p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                                <div className="w-full aspect-video relative">
                                    <img
                                        src={item.content}
                                        alt="Blog content"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
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
                    <div className="flex gap-3">
                        <ArrowUpTrayIcon className="h-6 w-6 text-primary" />
                        <h3 className="font-bold text-lg">
                            Upload image for this blog
                        </h3>
                    </div>
                    <p className="py-4">This image will also act as the feature image. Note: you may only upload one image per blog.</p>

                    <input
                        type="file"
                        className="file-input file-input-bordered file-input-primary w-full max-w-xs" />

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
                            className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
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