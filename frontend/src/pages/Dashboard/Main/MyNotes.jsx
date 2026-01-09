import { useQuery } from '@tanstack/react-query';
import { FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import useCallData from '../../../customHooks/useCallData';
import Loader from '../../../Components/Loader/Loader';

const MyNotes = () => {
  const axiosData = useCallData();

  const [editNote, setEditNote] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ================= FETCH NOTES ================= */
  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['my-notes'],
    queryFn: async () => {
      const res = await axiosData.get('/notes/my');
      return res.data.data;
    },
  });

  /* ================= DELETE ================= */
  const handleDelete = async id => {
    try {
      if (!confirm('Delete this note?')) return;
      await axiosData.delete(`/notes/my/${id}`);
      refetch();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed. Try again.');
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editNote) return;

    try {
      let fileUrl = editNote.pdfUrl || '';

      if (pdfFile) {
        setUploading(true);

        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('upload_preset', 'classValut2');
        formData.append('folder', 'classvault/notes');

        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dczr62vlu/raw/upload',
          formData
        );

        fileUrl = res.data.secure_url;
        console.log('Uploaded File URL:', fileUrl);
      }

      // Update note
      await axiosData.patch(`/notes/my/${editNote._id}`, {
        title: editNote.title,
        subject: editNote.subject,
        link: fileUrl,
      });

      console.log('Updated Note:', {
        title: editNote.title,
        pdf: fileUrl,
      });

      setEditNote(null);
      setPdfFile(null);
      setUploading(false);
      refetch();
    } catch (err) {
      console.error('Update failed:', err);
      setUploading(false);
      alert('Update failed. Try again.');
    }
  };

  if (isLoading) return<Loader/>

  return (
    <div className="space-y-6 mt-10">
      <h2 className="text-2xl font-semibold text-white">My Notes</h2>

      {data.length === 0 && <p className="text-gray-400">No notes found</p>}

      {data.map(note => (
        <div
          key={note._id}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-start"
        >
          <div>
            <h4 className="text-white font-medium">{note.title}</h4>
            <p className="text-sm text-gray-400">{note.subject}</p>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                note.approved
                  ? 'bg-green-400/10 text-green-400'
                  : 'bg-yellow-400/10 text-yellow-400'
              }`}
            >
              {note.approved ? 'Approved' : 'Pending'}
            </span>

            {note.pdfUrl && (
              <a
                href={note.pdfUrl}
                target="_blank"
                className="flex items-center gap-1 text-xs text-red-400 hover:underline mt-1"
              >
                <FaFileAlt /> View PDF
              </a>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setEditNote(note)}
              className="cursor-pointer text-blue-400 hover:text-blue-300"
            >
              <FaEdit />
            </button>

            <button
              onClick={() => handleDelete(note._id)}
              className="cursor-pointer text-red-400 hover:text-red-300"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      {/* ================= EDIT MODAL ================= */}
      {editNote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] w-full max-w-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-white text-lg mb-4">Edit Note</h3>

            <input
              className="w-full mb-3 p-2 bg-white/5 text-white rounded"
              value={editNote.title}
              onChange={e =>
                setEditNote({ ...editNote, title: e.target.value })
              }
            />

            <input
              className="w-full mb-3 p-2 bg-white/5 text-white rounded"
              value={editNote.subject}
              onChange={e =>
                setEditNote({ ...editNote, subject: e.target.value })
              }
            />

            {/* FILE */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white hover:border-indigo-400 mb-4">
              <FaFileAlt className="text-indigo-400" />
              <span className="truncate text-sm">
                {pdfFile ? pdfFile.name : 'Replace PDF (optional)'}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={e => setPdfFile(e.target.files[0])}
              />
            </label>

            {uploading && (
              <p className="text-xs text-gray-400 mb-2">Uploading file...</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditNote(null);
                  setPdfFile(null);
                  setUploading(false);
                }}
                className="cursor-pointer text-gray-400"
              >
                Cancel
              </button>

              <button
                disabled={uploading}
                onClick={handleUpdate}
                className="cursor-pointer text-green-400"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNotes;
