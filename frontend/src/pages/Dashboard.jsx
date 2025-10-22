import { useEffect, useState } from "react";
import api, { setAuthToken } from "../axios";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      api.get("/profiles/me")
        .then((res) => setProfile(res.data))
        .catch((err) => {
          console.error("Profile fetch failed:", err);
          if (err.response?.status === 404) {
            setError("No profile found. Please create one.");
          } else {
            alert("Session expired. Please log in again.");
            window.location.href = "/login";
          }
        });
    } else {
      alert("Please log in first.");
      window.location.href = "/login";
    }
  }, []);

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>{error}</h2>
        <p>
          You can <a href="/create-profile">create your profile here</a>.
        </p>
      </div>
    );
  }

  if (!profile) return <p style={{ padding: "2rem" }}>Loading profile...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {profile.profile_name}</h1>
      <p>Profile ID: {profile.id}</p>
      <p>User ID: {profile.user_id}</p>
    </div>
  );
}