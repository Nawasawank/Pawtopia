import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import api from "../api";
import "../styles/ProfilePage.css";
import ContactSection from "../components/ContactSection";
import { FaTrashAlt } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 

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
    health_condition_id: "",
  });
  const [deletedPets, setDeletedPets] = useState([]); // Track deleted pets
  const [imageKey, setImageKey] = useState(0);
  const navigate = useNavigate();

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
    updatedPets[index][field] = field === "health_condition_id" ? parseInt(value, 10) || null : value;
    setPets(updatedPets);
  };

  const handleDeletePetFrontend = (pet) => {
    setPets((prevPets) => prevPets.filter((p) => p !== pet));
    if (!pet.isNew) {
      setDeletedPets((prev) => [...prev, pet]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
  
      // Update user info
      await api.put("/api/update/info", userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update existing pets
      for (const pet of pets) {
        if (!pet.isNew) {
          const petData = {
            name: pet.name,
            type: pet.type,
            gender: pet.gender,
            weight: pet.weight,
            health_condition_id: pet.health_condition_id || null,
          };
  
          await api.put(`/api/update/pet/${pet.pet_id}`, petData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }
  
      // Add new pets
      for (const pet of pets.filter((pet) => pet.isNew)) {
        const { isNew, ...petData } = pet;
        await api.post("/api/pet/add", petData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      // Delete removed pets
      for (const pet of deletedPets) {
        await api.delete(`/api/pets/delete/${pet.pet_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      // Refetch user info to refresh state with updated data
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
      setPets(data.pets); // Update the pets with the latest data from the backend
  
      alert("Changes saved successfully!");
      setEditMode(false);
      setShowAddPetForm(false);
      setNewPet({
        name: "",
        type: "",
        gender: "",
        weight: "",
        health_condition_id: "",
      });
      setDeletedPets([]);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };
  

  const handleAddPetClick = () => {
    if (
      !newPet.name.trim() ||
      !newPet.type.trim() ||
      !newPet.gender.trim() ||
      !newPet.weight.trim() ||
      isNaN(newPet.weight) ||
      !newPet.health_condition_id
    ) {
      alert("All fields are required and weight must be a valid number.");
      return;
    }

    setPets((prev) => [
      ...prev,
      { ...newPet, isNew: true },
    ]);

    setNewPet({
      name: "",
      type: "",
      gender: "",
      weight: "",
      health_condition_id: "",
    });

    setShowAddPetForm(false);
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
        
        // Refresh the page
        window.location.reload();
    } catch (error) {
        console.error("Error updating profile picture:", error);
        alert("Failed to update profile picture. Please try again.");
    }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/"); // Redirect to the login page or homepage
};


  

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-page__container">
        <div className="profile-page__header">
          <label htmlFor="profile-image-upload">
          <img
              key={imageKey} // Use imageKey to force re-render
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

        <h2 className="profile-page__pets-heading">Pet Details</h2>
        {pets.map((pet, index) => (
          <div key={index} className="profile-page__pet-card">
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
              <div className="radio-container">
                <label>
                  <input
                    type="radio"
                    name={`gender-${index}`}
                    value="Female"
                    checked={pet.gender === "Female"}
                    disabled={!editMode}
                    onChange={(e) =>
                      handlePetChange(index, "gender", e.target.value)
                    }
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name={`gender-${index}`}
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
                  value={pet.health_condition_id || ""}
                  onChange={(e) =>
                    handlePetChange(index, "health_condition_id", e.target.value)
                  }
                >
                  <option value="">Select Health Condition</option>
                  <option value="1">Cancer</option>
                  <option value="2">Diabetes</option>
                  <option value="3">Kidney Disease</option>
                  <option value="4">Heart Disease</option>
                  <option value="5">Respiratory Infection</option>
                  <option value="6">None</option>
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
                onClick={() => handleDeletePetFrontend(pet)}
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
        ))}

        {editMode && (
          <>
            {showAddPetForm && (
              <div className="profile-page__add-pet profile-page__pet-card">
                <div className="profile-page__pet-field">
                  <label>Name:</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={newPet.name}
                    onChange={(e) =>
                      setNewPet((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="profile-page__pet-field">
                  <label>Type:</label>
                  <input
                    type="text"
                    placeholder="Type"
                    value={newPet.type}
                    onChange={(e) =>
                      setNewPet((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="profile-page__pet-field">
                  <label>Gender:</label>
                  <div className="radio-container">
                    <label>
                      <input
                        type="radio"
                        name="newPetGender"
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
                    <label>
                      <input
                        type="radio"
                        name="newPetGender"
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
                </div>
                <div className="profile-page__pet-field">
                  <label>Weight:</label>
                  <input
                    type="text"
                    placeholder="Weight"
                    value={newPet.weight}
                    onChange={(e) =>
                      setNewPet((prev) => ({
                        ...prev,
                        weight: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="profile-page__pet-field">
                  <label>Health Condition:</label>
                  <select
                    value={newPet.health_condition_id}
                    onChange={(e) =>
                      setNewPet((prev) => ({
                        ...prev,
                        health_condition_id: parseInt(e.target.value, 10),
                      }))
                    }
                  >
                    <option value="">Select Health Condition</option>
                    <option value="1">Cancer</option>
                    <option value="2">Diabetes</option>
                    <option value="3">Kidney Disease</option>
                    <option value="4">Heart Disease</option>
                    <option value="5">Respiratory Infection</option>
                    <option value="6">None</option>
                  </select>
                </div>
                <button
                  className="profile-page__add-pet-btn"
                  onClick={handleAddPetClick}
                >
                  Add Pet to List
                </button>
              </div>
            )}
            <div className="profile-page__buttons">
              <button
                className="profile-page__add-pet-btn"
                onClick={() => setShowAddPetForm(!showAddPetForm)}
              >
                {showAddPetForm ? "Cancel Adding Pet" : "Add Pet"}
              </button>
              <button
                className="profile-page__save-btn"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
            
          </>
        )}<div className="profile-page__logout-section">
        <button className="profile-page__logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
      </div>
      <ContactSection />
    </div>
    
  );
};

export default ProfilePage;
