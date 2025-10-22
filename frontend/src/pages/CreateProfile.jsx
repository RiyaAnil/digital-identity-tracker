import { useState } from "react";
import api, { setAuthToken } from "../axios";

export default function CreateProfile() {
  const [profileName, setProfileName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.post("/profiles/create", { profile_name: profileName })
      .then(() => {
        alert("Profile created!");
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        console.error("Profile creation failed:", err);
        alert("Error creating profile");
      });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter profile name"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          required
        />
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}