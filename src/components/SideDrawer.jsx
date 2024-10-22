import React from 'react'

const SideDrawer = ({children, drawerContent}) => {
  return (
    <div className="drawer drawer-end">
  <input id="sticky-notes" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    {children}
  </div>
  <div className="drawer-side">
    <label htmlFor="sticky-notes" aria-label="close sidebar" className="drawer-overlay"></label>
    <div className="menu  bg-opacity-10 text-base-content min-h-full w-[30rem] p-5 pr-10">
        {/** scrollable div for content    */ }
        <div className="overflow-y-auto h-full">
          {drawerContent.map((note) => (
            <div key={note.id} className="rounded-2xl shadow-lg mb-4 bg-yellow-100 border-t-[10px] border-yellow-300 border-opacity-60">
            <div className="card-body">
              <p className="font-semibold text-lg">{note.adminName}</p>
              <p className="text-xs text-gray-500">{note.date}</p>
              <p className="text-sm">{note.note}</p>
            </div>
          </div>
          ))}

        </div>
    </div>
  </div>
</div>
  )
}

export default SideDrawer
