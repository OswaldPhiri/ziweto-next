// src/components/ImageUpload.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface Props {
  value: string; // current image URL
  onChange: (url: string) => void;
  label?: string;
  getToken: () => Promise<string>; // returns Firebase ID token for auth
}

type UploadState = "idle" | "uploading" | "done" | "error";
type Mode = "upload" | "link";

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  getToken,
}: Props) {
  const [mode, setMode] = useState<Mode>(value && !value.includes("cloudinary") ? "link" : "upload");
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [resolving, setResolving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-resolve Pinterest links
  const handleUrlChange = async (url: string) => {
    const trimmed = url.trim();
    onChange(trimmed);

    if (trimmed.includes("pin.it") || trimmed.includes("pinterest.com/pin")) {
      setResolving(true);
      setErrorMsg("");
      try {
        const res = await fetch(`/api/resolve-link?url=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (data.url) {
          onChange(data.url);
        } else if (data.error) {
          setErrorMsg(data.error);
        }
      } catch {
        setErrorMsg("Failed to resolve link.");
      } finally {
        setResolving(false);
      }
    }
  };

  async function uploadFile(file: File) {
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
      const token = await getToken();
      const sigRes = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!sigRes.ok) {
        const err = await sigRes.json();
        throw new Error(err.error ?? "Could not get upload credentials.");
      }

      const {
        uploadUrl,
        cloudName: _cn,
        apiKey,
        timestamp,
        signature,
        folder,
      } = await sigRes.json();
      void _cn;
      setProgress(30);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

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
            const optimised = data.secure_url.replace(
              "/upload/",
              "/upload/f_auto,q_auto,w_800/"
            );
            resolve(optimised);
          } else {
            reject(new Error("Upload failed. Check if Cloudinary keys are set in .env.local"));
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label mb-0">{label}</label>
        {!value && (
          <div className="flex bg-gray-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                mode === "upload" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setMode("link")}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                mode === "link" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Link
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      {value && (
        <div className="group relative w-full aspect-[4/3] max-w-sm rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="400px" unoptimized />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-lg flex items-center justify-center transition-all scale-90 group-hover:scale-100"
            title="Remove image"
          >
            ✕
          </button>
          <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <p className="text-[10px] text-gray-500 font-mono truncate">{value}</p>
          </div>
        </div>
      )}

      {/* Main UI */}
      {!value && mode === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            state === "uploading"
              ? "border-[#25D366] bg-green-50"
              : state === "error"
              ? "border-red-300 bg-red-50"
              : "border-gray-200 hover:border-[#25D366] hover:bg-green-50/20"
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
            <div className="py-4 px-2 max-w-xs mx-auto space-y-3">
              <p className="text-sm text-[#128C4C] font-semibold">Uploading your photo…</p>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#25D366] rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,211,102,0.4)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400">{progress}% complete</p>
            </div>
          ) : state === "error" ? (
            <div className="py-2">
              <p className="text-sm text-red-500 font-medium mb-1 flex items-center justify-center gap-1">
                <span>⚠️</span> {errorMsg}
              </p>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setMode("link"); }}
                className="text-xs text-[#128C4C] font-bold hover:underline"
              >
                Use a link instead →
              </button>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform">
                📷
              </div>
              <p className="text-sm font-semibold text-gray-700">
                Click to upload or drag photo here
              </p>
              <p className="text-[11px] text-gray-400 mt-1">High quality JPG or PNG (Max 8MB)</p>
            </div>
          )}
        </div>
      )}

      {!value && mode === "link" && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-wider italic">
            Paste a Direct Link
          </p>
          <input
            type="url"
            autoFocus
            value={resolving ? "Resolving link..." : value}
            disabled={resolving}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={`field font-mono text-xs placeholder:italic ${resolving ? 'animate-pulse text-gray-400 bg-gray-100' : ''}`}
          />
          <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
            Tip: Upload to <a href="https://imgbb.com" target="_blank" rel="noopener" className="text-[#128C4C] font-bold hover:underline">imgbb.com</a>, copy the 
            <span className="text-gray-600 font-semibold"> Direct Link</span>, and paste it here.
          </p>
        </div>
      )}
    </div>
  );
}

