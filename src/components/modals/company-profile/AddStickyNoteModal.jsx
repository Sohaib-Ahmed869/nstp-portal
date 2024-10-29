import React, { useState } from 'react'
import { AdminService } from '../../../services';
import showToast from '../../../util/toast';
import { useParams } from 'react-router-dom';

const MAX_CHAR_COUNT = 400; // max characters for notes


const AddStickyNoteModal = () => {
    const { companyId } = useParams();
    const [noteContent, setNoteContent] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [modalLoading, setModalLoading] = useState(false);

    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = 'auto'; // Reset the height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
    };

    const handleStickyNoteInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_CHAR_COUNT) {
            setNoteContent(value);
            setCharCount(value.length);
            adjustTextareaHeight(e.target);
        }
    };

    const postNote = async () => {
        if (noteContent.trim() === '') {
            showToast(false, "Note cannot be empty.");
            return;
        }
        setModalLoading(true);
        //api call to post note
        console.log("Posting note:", noteContent);

        try {
            const response = await AdminService.addTenantNote(companyId, noteContent);
            if (response.error) {
                console.error("Error posting note:", response.error);
                showToast(false, response.error);
                return;
            }
            console.log("Note posted successfully:", response.data.note);
            showToast(true, response.message);
            // fetchAdminNotes();

        } catch (error) {
            console.error("Error posting note:", error);
            showToast(false, "An error occurred while posting note.");
        } finally {
            // Clear the fields
            setNoteContent('');
            setCharCount(0);
            // Close the modal
            document.getElementById('add-note-modal').close();
            setModalLoading(false);
        }
    }

    return (
        <dialog id="add-note-modal" className="modal bg-opacity-0">
            <div className="modal-box bg-opacity-0 shadow-none">
                <h3 className="font-bold text-lg"></h3>
                <div className="rounded-2xl shadow-lg bg-yellow-100 border-t-[10px] border-yellow-300 border-opacity-60">
                    <textarea
                        rows={5}
                        placeholder="Type your note here..."
                        className="my-2 textarea focus:outline-none focus:border-0 focus:ring-0 bg-opacity-0 w-full resize-none"
                        value={noteContent}
                        onChange={handleStickyNoteInputChange}
                        onInput={(e) => adjustTextareaHeight(e.target)}
                    />
                </div>

                <div className="modal-action mt-3 justify-between">
                    <p className="text-right text-sm text-white ml-1 mt-1">{charCount}/{MAX_CHAR_COUNT}</p>
                    <div className="flex gap-2">
                        <button className="btn hover:bg-white shadow-lg" onClick={() => { setNoteContent(''); setCharCount(0); document.getElementById('add-note-modal').close() }}>Cancel</button>
                        <button className={`btn btn-primary bg-light-primary hover:bg-light-primary shadow-lg ${(modalLoading || charCount <= 0) && "btn-disabled"}`}
                            onClick={postNote}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Post Note"}
                        </button>
                    </div>
                </div>

            </div>
        </dialog>

    )
}

export default AddStickyNoteModal
