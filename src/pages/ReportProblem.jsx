import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLandmark,
} from "react-icons/fa";
import {
  MdOutlineMyLocation,
  MdOutlineCloudUpload,
  MdClose,
  MdCheckCircle,
} from "react-icons/md";
import { useApp } from "../context/AppContext.jsx";
import { CATEGORIES } from "../data/mockData.js";

const MAX_FILE_SIZE_MB = 5;

export default function ReportProblem() {
  const { currentUser, createComplaint } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [fileError, setFileError] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleFile(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileError("");

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!validTypes.includes(file.type)) {
      setFileError("Only JPG, JPEG and PNG images are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(
        `Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhoto(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setFileError(
        "Geolocation is not supported in this browser."
      );
      return;
    }

    setLocating(true);
    setFileError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setCoords({
          lat: latitude,
          lng: longitude,
        });

        setLocation(
          `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`
        );

        setLocating(false);
      },
      () => {
        setLocating(false);

        setFileError(
          "Could not fetch your location. Please enter it manually."
        );
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitError("");
    setSubmitting(true);

    const result = await createComplaint({
      category,
      title,
      description,
      location,
      lat: coords?.lat,
      lng: coords?.lng,
      photo,
    });

    if (!result.ok) {
      setSubmitError(
        result.error || "Unable to submit complaint."
      );
      setSubmitting(false);
      return;
    }

    setSubmitted(result.data.complaint || result.data);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist px-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

          <MdCheckCircle
            className="mx-auto text-leaf-500"
            size={48}
          />

          <h1 className="mt-4 font-display text-xl font-bold text-ink">
            Complaint submitted successfully.
          </h1>

          <div className="mt-6 space-y-2 rounded-xl bg-mist p-4 text-left text-sm">
            <p>
              <span className="font-semibold">
                Complaint ID:
              </span>{" "}
              {submitted.id}
            </p>

            <p>
              <span className="font-semibold">
                Problem:
              </span>{" "}
              {submitted.category}
            </p>

            <p>
              <span className="font-semibold">
                Location:
              </span>{" "}
              {submitted.location}
            </p>

            <p>
              <span className="font-semibold">
                Status:
              </span>{" "}
              Pending
            </p>

            <p>
              <span className="font-semibold">
                Submitted:
              </span>{" "}
              {submitted.date || "Just now"}
            </p>
          </div>

          <div className="mt-6 flex gap-3">

            <button
              onClick={() =>
                navigate(`/complaint/${submitted.id}`)
              }
              className="flex-1 rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Track Complaint
            </button>

            <button
              onClick={() =>
                navigate("/user-dashboard")
              }
              className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-ink hover:bg-mist"
            >
              Dashboard
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist">

      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">

          <Link
            to="/user-dashboard"
            className="flex items-center gap-2 font-display text-lg font-bold text-brand-700"
          >
            <FaLandmark />
            Jan Seva
          </Link>

        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">

        <h1 className="font-display text-2xl font-bold text-ink">
          Report a Problem
        </h1>

        <p className="mt-1 text-sm text-slate">
          Fill in the details below so a municipal officer can act on it.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-2xl border border-slate-100 bg-white p-6"
        >

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Problem Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Complaint Title
            </label>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Garbage has not been collected for 5 days"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Description
            </label>

            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem in detail..."
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Location
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                required
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Enter your location"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />

              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-brand-500 px-4 text-xs font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-60"
              >
                <MdOutlineMyLocation />

                {locating
                  ? "Locating..."
                  : "Use My Location"}
              </button>

            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Upload Problem Photo
            </label>

            {!photo ? (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-8 text-center hover:border-brand-400">

                <MdOutlineCloudUpload
                  size={28}
                  className="text-brand-500"
                />

                <span className="mt-2 text-sm text-slate">
                  Click to upload a JPG or PNG
                  {" "}
                  (max {MAX_FILE_SIZE_MB}MB)
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFile}
                  className="hidden"
                />

              </label>
            ) : (
              <div className="relative w-fit">

                <img
                  src={photo}
                  alt="Problem preview"
                  className="h-40 rounded-xl object-cover"
                />

                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white"
                >
                  <MdClose size={16} />
                </button>

              </div>
            )}

            {fileError && (
              <p className="mt-2 text-xs font-medium text-rose-500">
                {fileError}
              </p>
            )}
          </div>

          {submitError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-500">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : "Submit Complaint"}
          </button>

        </form>

      </main>
    </div>
  );
}