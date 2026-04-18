// src/components/ImageUpload.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface Props {
  value: string;          // current image URL
  onChange: (url: string) => void;
  label?: string;
  getToken: () => Promise<string>;  // returns Firebase ID token for auth
}

type UploadState = "idle" | "uploading" | "done" | "error";

export default function ImageUpload({ value, onChange, label = "Image", getToken }: Props) {
  const [state,    setState]   = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    // Validate client-side first
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (JPG, PNG, WebP).");
      setState("error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("Image must be smaller than 8MB.");
      setState("error");
      return;
    }

    setState("uploading");
    setProgress(10);
    setErrorMsg("");

    try {
      // Step 1: get signed upload params from our API route
      const token = await getToken();
      const sigRes = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!sigRes.ok) {
        const err = await sigRes.json();
        throw new Error(err.error ?? "Could not get upload credentials.");
      }

      const { uploadUrl, cloudName: _cn, apiKey, timestamp, signature, folder } = await sigRes.json();
      void _cn;
      setProgress(30);

      // Step 2: upload directly to Cloudinary from the browser
      const formData = new FormData();
      formData.append("file",      file);
      formData.append("api_key",   apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder",    folder);

      // Use XMLHttpRequest so we can track upload progress
      const url = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(30 + Math.round((e.loaded / e.total) * 60));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            // Use f_auto,q_auto for automatic format and quality optimisation
            const optimised = data.secure_url.replace(
              "/upload/",
              "/upload/f_auto,q_auto,w_800/"
            );
            resolve(optimised);
          } else {
            reject(new Error("Upload failed. Please try again."));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload."));
        xhr.send(formData);
      });

      setProgress(100);
      setState("done");
      onChange(url);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message ?? "Upload failed.");
      setState("error");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function clearImage() {
    onChange("");
    setState("idle");
    setProgress(0);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="label">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative mb-3 w-full aspect-[4/3] max-w-xs rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="320px" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full text-xs flex items-center justify-center transition-colors"
            title="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload zone */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            state === "uploading"
              ? "border-[#25D366] bg-green-50"
              : state === "error"
              ? "border-red-300 bg-red-50"
              : "border-gray-200 hover:border-[#25D366] hover:bg-green-50/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {state === "uploading" ? (
            <div className="space-y-2">
              <p className="text-sm text-[#128C4C] font-medium">Uploading… {progress}%</p>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#25D366] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : state === "error" ? (
            <div>
              <p className="text-sm text-red-500 mb-1">⚠️ {errorMsg}</p>
              <p className="text-xs text-gray-400">Click to try again</p>
            </div>
          ) : (
            <div>
              <p className="text-2xl mb-2">📷</p>
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag an image here
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 8MB</p>
            </div>
          )}
        </div>
      )}

      {/* Manual URL fallback */}
      <div className="mt-2">
        <p className="text-xs text-gray-400 mb-1">
          Or paste an image URL directly:
        </p>
        <input
          type="url"
          value={value}
          onChange={(e) => { onChange(e.target.value); setState("idle"); }}
          placeholder="https://…"
          className="field text-xs"
        />
      </div>
    </div>
  );
}
