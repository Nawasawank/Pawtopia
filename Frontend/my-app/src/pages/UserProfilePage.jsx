import React, { useState, useEffect } from "react"; 
import Navbar from "../components/navbar";
import api from "../api";
import "../styles/ProfilePage.css";
import ContactSection from '../components/ContactSection';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [pets, setPets] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    gender: "",
    weight: "",
    health_condition: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        const profileImageUrl = `${api.defaults.baseURL}${data.image}`;
        setUserInfo({
          ...data,
          image: profileImageUrl,
        });
        setPets(data.pets);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePetChange = (index, field, value) => {
    const updatedPets = [...pets];
    updatedPets[index][field] = value;
    setPets(updatedPets);
  };

  const handleAddPet = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post("/api/pet/add", newPet, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch updated pets list
      const response = await api.get("/api/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data.pets);

      alert("Pet added successfully!");
      setShowAddPetForm(false);
      setNewPet({
        name: "",
        type: "",
        gender: "",
        weight: "",
        health_condition: "",
      });
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/pets/delete/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPets(pets.filter((pet) => pet.pet_id !== petId));
      alert("Pet deleted successfully!");
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");
      const response = await api.put("/api/upload-photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedImageUrl = `${api.defaults.baseURL}${response.data.image}`;
      setUserInfo((prev) => ({ ...prev, image: updatedImageUrl }));

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture. Please try again.");
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-page__container">
        {/* Profile Header */}
        <div className="profile-page__header">
          <label htmlFor="profile-image-upload">
            <img
              src={userInfo?.image || "/default-avatar.png"}
              alt="User Profile"
              className="profile-page__avatar clickable"
            />
          </label>
          <h2 className="profile-page__greeting">
            Hi! {userInfo?.firstName || "User"}
          </h2>
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            style={{ display: "none" }}
          />
          <button
            className="profile-page__edit-btn"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* User Information */}
        <div className="profile-page__info">
          <div className="profile-page__info-row">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={userInfo?.firstName || ""}
              readOnly={!editMode}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-page__info-row">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={userInfo?.lastName || ""}
              readOnly={!editMode}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-page__info-row">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userInfo?.email || ""}
              readOnly={!editMode}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-page__info-row">
            <label>Tel:</label>
            <input
              type="tel"
              name="tel"
              value={userInfo?.tel || ""}
              readOnly={!editMode}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Pet Information */}
        <h2 className="profile-page__pets-heading">Pet Details</h2>
        {pets.map((pet, index) => (
          <div key={pet.pet_id} className="profile-page__pet-card">
            <div className="profile-page__pet-field">
              <label>Name:</label>
              <input
                type="text"
                value={pet.name}
                readOnly={!editMode}
                onChange={(e) => handlePetChange(index, "name", e.target.value)}
              />
            </div>
            <div className="profile-page__pet-field">
              <label>Type:</label>
              <input
                type="text"
                value={pet.type}
                readOnly={!editMode}
                onChange={(e) => handlePetChange(index, "type", e.target.value)}
              />
            </div>
            <div className="profile-page__pet-field">
              <label>Gender:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Female"
                    checked={pet.gender === "Female"}
                    disabled={!editMode}
                    onChange={(e) =>
                      handlePetChange(index, "gender", e.target.value)
                    }
                  />
                  Female
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    value="Male"
                    checked={pet.gender === "Male"}
                    disabled={!editMode}
                    onChange={(e) =>
                      handlePetChange(index, "gender", e.target.value)
                    }
                  />
                  Male
                </label>
              </div>
            </div>
            <div className="profile-page__pet-field">
              <label>Weight:</label>
              <input
                type="text"
                value={pet.weight}
                readOnly={!editMode}
                onChange={(e) =>
                  handlePetChange(index, "weight", e.target.value)
                }
              />
            </div>
            <div className="profile-page__pet-field">
              <label>Health Condition:</label>
              {editMode ? (
                <select
                  value={pet.health_condition || ""}
                  onChange={(e) =>
                    handlePetChange(index, "health_condition", e.target.value)
                  }
                >
                  <option value="">None</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Heart Disease">Heart Disease</option>
                  <option value="Respiratory Infection">
                    Respiratory Infection
                  </option>
                  <option value="Cancer">Cancer</option>
                  {/* Add more options as needed */}
                </select>
              ) : (
                <input
                  type="text"
                  value={pet.health_condition || "None"}
                  readOnly
                />
              )}
            </div>

            {editMode && (
              <button
                className="profile-page__delete-btn"
                onClick={() => handleDeletePet(pet.pet_id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}

        {editMode && (
          <>
            {showAddPetForm ? (
              <div className="profile-page__add-pet">
                <h3>Add New Pet</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={newPet.name}
                  onChange={(e) =>
                    setNewPet((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <input
                  type="text"
                  placeholder="Type"
                  value={newPet.type}
                  onChange={(e) =>
                    setNewPet((prev) => ({ ...prev, type: e.target.value }))
                  }
                />
                <div>
                  <label>
                    <input
                      type="radio"
                      value="Female"
                      checked={newPet.gender === "Female"}
                      onChange={(e) =>
                        setNewPet((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                    />
                    Female
                  </label>
                  <label style={{ marginLeft: "10px" }}>
                    <input
                      type="radio"
                      value="Male"
                      checked={newPet.gender === "Male"}
                      onChange={(e) =>
                        setNewPet((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                    />
                    Male
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Weight"
                  value={newPet.weight}
                  onChange={(e) =>
                    setNewPet((prev) => ({ ...prev, weight: e.target.value }))
                  }
                />
                <select
                  value={newPet.health_condition}
                  onChange={(e) =>
                    setNewPet((prev) => ({
                      ...prev,
                      health_condition: e.target.value,
                    }))
                  }
                >
                  <option value="">None</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Heart Disease">Heart Disease</option>
                  <option value="Respiratory Infection">
                    Respiratory Infection
                  </option>
                  <option value="Cancer">Cancer</option>
                  {/* Add more options as needed */}
                </select>
                <button onClick={handleAddPet}>Add Pet</button>
              </div>
            ) : (
              <button
                className="profile-page__add-pet-btn"
                onClick={() => setShowAddPetForm(true)}
              >
                Add Pet
              </button>
            )}
          </>
        )}
      </div>
      <ContactSection />
    </div>
  );
};

export default ProfilePage;
