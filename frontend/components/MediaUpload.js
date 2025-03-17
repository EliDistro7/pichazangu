import { ImagePlus, Video } from "lucide-react";


// components/MediaUpload.js
const MediaUpload = ({ selectedFiles, selectedType, captions, onFileChange, onCaptionChange, onMediaUpload, isUploading, uploadProgress }) => (
    <div className="flex flex-col items-center mb-6 gap-4">
      <div className="flex gap-4">
        <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
          <ImagePlus className="w-5 h-5 mr-2" />
          <span>Add Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e, "image")} multiple />
        </label>
  
        <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
          <Video className="w-5 h-5 mr-2" />
          <span>Add Video</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => onFileChange(e, "video")} multiple />
        </label>
      </div>
  
      {selectedFiles.length > 0 && (
        <div className="flex flex-col w-full max-w-md mt-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex flex-col items-center gap-2 mb-2">
              {selectedType === "image" ? (
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <video controls className="w-full h-32 object-cover rounded-lg">
                  <source src={URL.createObjectURL(file)} type={file.type} />
                </video>
              )}
              <span className="truncate w-2/3">{file.name}</span>
              <input
                type="text"
                placeholder="Add a caption (optional)"
                value={captions[index] || ""}
                onChange={(e) => onCaptionChange(e, index)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
          <button
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            onClick={onMediaUpload}
            disabled={isUploading}
          >
            {isUploading ? `Uploading... (${uploadProgress}%)` : "Upload Media"}
          </button>
        </div>
      )}
    </div>
  );
  
  export default MediaUpload;