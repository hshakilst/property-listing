"use client";
import { ChangeEvent, FormEvent, useState } from "react";

type FileUploadProps = {
  id: string | null;
  type: string | null;
  source: string | null;
};

const FileUpload: React.FC<FileUploadProps> = ({ id, type, source }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setUploading(true);

    if (!file) {
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `/api/upload/${id}?type=${type}&source=${source}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      setUploading(false);
      return;
    }

    const data = await response.json();

    if (data?.message) alert(data?.message);

    setUploading(false);
  };

  return (
    <form onSubmit={onSubmit} className="">
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
        onChange={onFileChange}
      />
      <button
        disabled={uploading}
        type="submit"
        className="btn btn-primary ms-4"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default FileUpload;
