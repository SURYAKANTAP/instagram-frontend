"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PhotoCameraBack, Movie, Book, ArrowBack } from '@mui/icons-material';
import api from '../lib/api';
import { useFeed } from '../context/FeedContext';

const CONTENT_TYPES = { POST: 'Post', REEL: 'Reel', STORY: 'Story' };

// --- COMPONENT DEFINITIONS ARE NOW OUTSIDE THE MAIN COMPONENT ---

const SelectionScreen = ({ onSelect }) => (
  <div className="text-center">
    <h2 className="text-xl font-bold mb-6">Create</h2>
    <div className="grid grid-cols-3 gap-4">
      <OptionBox type={CONTENT_TYPES.POST} icon={<PhotoCameraBack />} onSelect={onSelect} />
      <OptionBox type={CONTENT_TYPES.REEL} icon={<Movie />} onSelect={onSelect} />
      <OptionBox type={CONTENT_TYPES.STORY} icon={<Book />} onSelect={onSelect} />
    </div>
  </div>
);

const OptionBox = ({ type, icon, onSelect }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onSelect(type)}
    className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg aspect-square"
  >
    {icon}
    <span className="mt-2 font-semibold">{type}</span>
  </motion.button>
);

const UploadForm = ({
  creationType,
  onBack,
  file,
  previewUrl,
  handleFileChange,
  caption,
  setCaption,
  error,
  uploading,
  handleSubmit
}) => (
  <div>
    <div className="flex items-center border-b border-gray-700 pb-4 mb-4">
      <button onClick={onBack} className="mr-4">
        <ArrowBack />
      </button>
      <h2 className="text-xl font-bold">Create new {creationType}</h2>
    </div>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-800 rounded-lg min-h-[20rem]">
        {previewUrl ? (
          file && file.type.startsWith('video/') ? (
            <video src={previewUrl} controls className="w-full h-full object-contain rounded-lg" />
          ) : (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
          )
        ) : (
          <label htmlFor="file-upload" className="cursor-pointer text-center">
            <PhotoCameraBack sx={{ fontSize: 60 }} className="text-gray-500 mb-4" />
            <p className="text-blue-500 font-semibold">Select from computer</p>
          </label>
        )}
        <input id="file-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
      </div>
      <div className="w-full md:w-1/2">
        <textarea
          placeholder="Write a caption..."
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:outline-none text-white min-h-[10rem] overflow-y-auto resize-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  </div>
);


// --- MAIN PAGE COMPONENT ---
export default function CreatePage() {
  const [creationType, setCreationType] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { addPost, addReel, addStory } = useFeed();

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleBack = () => {
    setCreationType(null);
    setFile(null);
    setPreviewUrl(null);
    setCaption('');
    setError('');
  };
  
  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setError('');
    setUploading(true);

    try {
      // STEP 1: Get the secure signature from our backend
      const signatureResponse = await api.get('/upload/signature');
      const { signature, timestamp, api_key, cloud_name } = signatureResponse.data;

      // STEP 2: Upload the file directly to Cloudinary using the signature
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', api_key);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      
      const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;
      const cloudinaryResponse = await fetch(cloudinaryEndpoint, {
        method: 'POST',
        body: formData,
      });
      const cloudinaryData = await cloudinaryResponse.json();
      const mediaUrl = cloudinaryData.secure_url;

      if (!mediaUrl) {
        throw new Error('Cloudinary upload failed.');
      }

      // STEP 3: Save the returned URL to our backend
      let response;
      switch (creationType) {
        case CONTENT_TYPES.POST:
          response = await api.post('/posts', { caption, media: mediaUrl });
          addPost(response.data);
          break;
        case CONTENT_TYPES.REEL:
          response = await api.post('/reels', { caption, video: mediaUrl });
          addReel(response.data);
          break;
        case CONTENT_TYPES.STORY:
          response = await api.post('/stories', { media: mediaUrl });
          addStory(response.data);
          break;
        default:
          throw new Error('Invalid content type');
      }
      
      router.push('/'); // Redirect home on success
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create content.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full py-8 px-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl p-6">
        {!creationType ? (
          <SelectionScreen onSelect={setCreationType} />
        ) : (
          <UploadForm
            creationType={creationType}
            onBack={handleBack}
            file={file}
            previewUrl={previewUrl}
            handleFileChange={handleFileChange}
            caption={caption}
            setCaption={setCaption}
            error={error}
            uploading={uploading}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}




