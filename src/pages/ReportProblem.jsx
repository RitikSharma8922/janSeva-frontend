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
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

import { useApp } from "../context/AppContext.jsx";
import { CATEGORIES } from "../data/mockData.js";

const MAX_FILE_SIZE_MB = 5;

const mapContainerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "12px",
};

const defaultCenter = {
  lat: 26.4499,
  lng: 80.3319,
};

export default function ReportProblem() {
  const { currentUser, createComplaint } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [photo, setPhoto] = useState(null);

  const [fileError, setFileError] = useState("");
  const [locationError, setLocationError] = useState("");
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
      setFileError(
        "Only JPG, JPEG and PNG images are allowed."
      );
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
      setLocationError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const newCoords = {
          lat: latitude,
          lng: longitude,
        };

        setCoords(newCoords);

        setLocation(
          `Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`
        );

        setLocating(false);
      },
      (error) => {
        console.error("Location error:", error);

        setLocating(false);

        setLocationError(
          "Could not fetch your location. Please allow location permission and try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  function handleMapClick(event) {
    if (!event.latLng) return;

    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    const newCoords = {
      lat: latitude,
      lng: longitude,
    };

    setCoords(newCoords);

    setLocation(
      `Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`
    );

    setLocationError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitError("");

    if (!coords) {
      setLocationError(
        "Please select your complaint location on the map or click 'Use My Location'."
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await createComplaint({
        category,
        title,
        description,
        location,
        lat: coords.lat,
        lng: coords.lng,
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
    } catch (error) {
      console.error(error);

      setSubmitError(
        "Unable to connect to server. Please try again."
      );

      setSubmitting(false);
    }
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
                Latitude:
              </span>{" "}
              {submitted.lat ?? coords?.lat}
            </p>

            <p>
              <span className="font-semibold">
                Longitude:
              </span>{" "}
              {submitted.lng ?? coords?.lng}
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

          {/* CATEGORY */}

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

          {/* TITLE */}

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

          {/* DESCRIPTION */}

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

          {/* LOCATION */}

          <div>

            <label className="mb-1 block text-sm font-medium text-ink">
              Complaint Location
            </label>

            <div className="flex gap-2">

              <input
                type="text"
                required
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Select location on map"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />

              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-brand-500 px-4 text-xs font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-60"
              >

                <MdOutlineMyLocation size={18} />

                {locating
                  ? "Locating..."
                  : "Use My Location"}

              </button>

            </div>

            {/* GOOGLE MAP */}

            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">

              {loadError ? (
                <div className="flex h-[350px] items-center justify-center bg-slate-50 p-5 text-center text-sm text-rose-500">
                  Google Maps could not be loaded.
                  Please check your Google Maps API key.
                </div>
              ) : !isLoaded ? (
                <div className="flex h-[350px] items-center justify-center bg-slate-50 text-sm text-slate-500">
                  Loading Google Map...
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={coords || defaultCenter}
                  zoom={coords ? 16 : 12}
                  onClick={handleMapClick}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                  }}
                >
                  {coords && (
                    <Marker
                      position={coords}
                    />
                  )}
                </GoogleMap>
              )}

            </div>

            <p className="mt-2 text-xs text-slate-500">
              Click anywhere on the map to select the complaint location.
            </p>

            {coords && (
              <div className="mt-2 rounded-lg bg-mist p-3 text-xs text-slate-600">

                <p>
                  <span className="font-semibold">
                    Latitude:
                  </span>{" "}
                  {coords.lat.toFixed(6)}
                </p>

                <p>
                  <span className="font-semibold">
                    Longitude:
                  </span>{" "}
                  {coords.lng.toFixed(6)}
                </p>

              </div>
            )}

            {locationError && (
              <p className="mt-2 text-xs font-medium text-rose-500">
                {locationError}
              </p>
            )}

          </div>

          {/* PHOTO */}

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

          {/* SUBMIT ERROR */}

          {submitError && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-500">
              {submitError}
            </p>
          )}

          {/* SUBMIT */}

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