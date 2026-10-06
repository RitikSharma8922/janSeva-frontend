import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLandmark } from "react-icons/fa";
import {
  MdOutlineMyLocation,
  MdOutlineCloudUpload,
  MdClose,
  MdCheckCircle,
} from "react-icons/md";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

import { useApp } from "../context/AppContext.jsx";
import { CATEGORIES } from "../data/mockData.js";

import "leaflet/dist/leaflet.css";

const MAX_FILE_SIZE_MB = 5;

const defaultCenter = [26.4499, 80.3319];

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ coords, onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  if (!coords) return null;

  return (
    <Marker
      position={[coords.lat, coords.lng]}
      icon={markerIcon}
    />
  );
}

async function getAddressFromCoordinates(lat, lng) {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to find address");
  }

  const data = await response.json();

  return data.display_name || "";
}

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
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);

  const [submitted, setSubmitted] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [addressLoading, setAddressLoading] = useState(false);

  async function selectLocation(latitude, longitude) {
    const newCoords = {
      lat: latitude,
      lng: longitude,
    };

    setCoords(newCoords);
    setLocationError("");
    setAddressLoading(true);

    try {
      const address = await getAddressFromCoordinates(
        latitude,
        longitude
      );

      if (address) {
        setLocation(address);
      } else {
        setLocation(
          `Location near ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        );
      }
    } catch (error) {
      console.error("Address lookup error:", error);

      setLocation(
        `Location near ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      );

      setLocationError(
        "Address could not be found automatically. You can enter it manually."
      );
    } finally {
      setAddressLoading(false);
    }
  }

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
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        await selectLocation(latitude, longitude);

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

  async function handleMapClickLocation(latitude, longitude) {
    await selectLocation(latitude, longitude);
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

    if (!location.trim()) {
      setLocationError(
        "Please enter or select a complaint address."
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
                Status:
              </span>{" "}
              {submitted.status || "Pending"}
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
                placeholder="Click map or use your current location"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />

              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating || addressLoading}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-brand-500 px-4 text-xs font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-60"
              >

                <MdOutlineMyLocation size={18} />

                {locating
                  ? "Locating..."
                  : addressLoading
                  ? "Finding..."
                  : "Use My Location"}

              </button>

            </div>

            {/* OPENSTREETMAP */}

            <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">

              <MapContainer
                center={
                  coords
                    ? [coords.lat, coords.lng]
                    : defaultCenter
                }
                zoom={coords ? 17 : 12}
                scrollWheelZoom={true}
                style={{
                  width: "100%",
                  height: "350px",
                }}
              >

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker
                  coords={coords}
                  onSelect={handleMapClickLocation}
                />

              </MapContainer>

            </div>

            <p className="mt-2 text-xs text-slate-500">
              Click anywhere on the map to select the complaint location.
              The address will be detected automatically.
            </p>

            {addressLoading && (
              <p className="mt-2 text-xs font-medium text-brand-600">
                Finding your address...
              </p>
            )}

            {coords && (
              <div className="mt-2 rounded-lg bg-mist p-3 text-xs text-slate-600">

                <p className="font-semibold text-ink">
                  Selected Location
                </p>

                <p className="mt-1">
                  {location || "Finding address..."}
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
            disabled={submitting || addressLoading}
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
