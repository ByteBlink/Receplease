import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { FormState } from './form-details';

interface UploadWidgetProps {
  setState: React.Dispatch<React.SetStateAction<FormState>>;
}

const UploadWidget: React.FC<UploadWidgetProps> = ({ setState }) => {
  const [isUploaded, setIsUploaded] = useState(false);
  // USE REFS:
  const cloudinaryRef = useRef<Cloudinary>();
  const widgetRef = useRef<{open: () => void}>({open: () => {}});
  useEffect(() => {
    // Function to initialize the widget
    const initWidget = () => {
      if (window.cloudinary !== undefined) {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: 'dz1qipahy',
            uploadPreset: 'nrvaimia',
            sources: ['local', 'url', 'camera'],
          },
          (
            error: never,
            result: { event: string; info: { secure_url: string } }
          ) => {
            if (result.event === 'success') {
              setState((prevState) => ({
                ...prevState,
                imageUrl: result.info.secure_url,
              }));
              setIsUploaded(true);
            }
          }
        );

      } else {
        console.error('Cloudinary SDK not loaded');
      }
    };

    // Check if Cloudinary SDK is available and then initialize the widget
    if (typeof window !== 'undefined') {
      initWidget();
    }
  }, [setState]);

  return (
    <button
      id='upload_widget_opener'
      className={isUploaded ? 'uploaded' : 'no-fill-btn'}
      onClick={() => widgetRef.current.open()}
    >
      {isUploaded ? 'Photo Uploaded' : 'Upload Recipe Photo'}
    </button>
  );
};

export default UploadWidget;
