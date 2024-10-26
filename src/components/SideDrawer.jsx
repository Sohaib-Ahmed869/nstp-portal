import React, {useEffect, useState} from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import { AdminService } from '../services';
import showToast from '../util/toast';
import { useParams } from 'react-router-dom';

const SideDrawer = ({ children, drawerContent, setDrawerContent }) => {
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const { companyId } = useParams();
  const handleDelete = async () => {
    console.log(noteIdToDelete)
    setModalLoading(true);
    
    try {
      const response = await AdminService.deleteTenantNote(companyId, noteIdToDelete);
      console.log(response);
      if (response.error) {
        console.log(response.error);
        showToast(false, response.error);
        return;
      }

      console.log(response.message);
      
      // remove the note from the drawer content
      const newDrawerContent = drawerContent.filter((note) => note.id !== noteIdToDelete);
      setDrawerContent(newDrawerContent);
      document.getElementById('delete-note-modal').close();
      showToast(true, response.message);
      
    } catch (error) {
      console.error(error);
      showToast(false, 'An error occurred. Please try again.');
    } finally {
      setNoteIdToDelete(null);
      setModalLoading(false);
    }
  }

  useEffect(() => {}, [drawerContent]);

  return (
    <div className="drawer drawer-end">
      <DeleteConfirmationModal
        id="delete-note-modal"
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        onConfirm={handleDelete}
        modalLoading={modalLoading}
      />
      <input id="sticky-notes" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="sticky-notes" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu bg-opacity-10 text-base-content min-h-full w-[30rem] p-5 pr-10">
          {/** scrollable div for content */}
          <div className="overflow-y-auto h-full">
            {drawerContent.length > 0 ? drawerContent.map((note) => (
              <div key={note.id} className="relative rounded-2xl shadow-lg mb-4 bg-yellow-100 border-t-[10px] border-yellow-300 border-opacity-60">
                {note.isEditable && (
                  <button
                    className="absolute top-4 right-4 btn btn-error btn-outline btn-sm btn-circle"
                    aria-label="Delete note"
                    onClick={() =>{ setNoteIdToDelete(note.id); document.getElementById('delete-note-modal').showModal(); }}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
                <div className="card-body">
                  <p className="font-semibold text-lg">{note.adminName}</p>
                  <p className="text-xs text-gray-500">{note.date}</p>
                  <p className="text-sm">{note.note}</p>
                </div>
              </div>
            )) : 
            <div key="no-notes-info" className="relative rounded-2xl shadow-lg mb-4 bg-base-100 ">
            <div className="card-body">
              <p className="font-semibold text-lg">No Notes</p>
              <p className="text-sm">There are no notes added yet for this particular tenant.</p>
            </div>
          </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;