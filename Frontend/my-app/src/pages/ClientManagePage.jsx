import React, { useState, useEffect } from 'react';
import Navbar from '../components/admin_navbar.jsx';
import PetOverlay from '../components/PetOverlay.jsx';
import ConfirmDeleteOverlay from '../components/ConfirmDeleteOverlay.jsx';
import api from '../api.js';
import '../styles/ClientManagePage.css';

const ClientManagementPage = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientPets, setClientPets] = useState([]);
  const [showPetOverlay, setShowPetOverlay] = useState(false);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const clientsPerPage = 10;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/allUsers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClients(response.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    }
  };

  const fetchPetsByUserId = async (userId) => {
    try {
      const response = await api.get(`/api/pet/AllPet/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setClientPets(response.data.pets || []);
      setShowPetOverlay(true);
    } catch (error) {
      console.error('Error fetching pets:', error);
      setClientPets([]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const confirmDeleteClient = (client) => {
    setClientToDelete(client);
    setShowDeleteOverlay(true);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      await api.delete(`/api/deleteUserAndPets/${clientToDelete.user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      fetchClients();
      setShowDeleteOverlay(false);
      setClientToDelete(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      await api.delete(`/pets/delete/${petId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Refresh pet list after deletion
      fetchPetsByUserId(selectedClient.user_id);
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.firstName.toLowerCase().includes(searchQuery) ||
    client.lastName.toLowerCase().includes(searchQuery) ||
    client.email.toLowerCase().includes(searchQuery)
  );

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePetAmountClick = (client) => {
    setSelectedClient(client);
    fetchPetsByUserId(client.user_id);
  };

  return (
    <div className="client-management-wrapper">
      <Navbar />
      <h1 className="page-title">Client Management</h1>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search Customer Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <table className="client-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Tel</th>
            <th>Email</th>
            <th>Pet Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.length > 0 ? (
            currentClients.map((client) => (
              <tr key={client.user_id}>
                <td>{client.user_id}</td>
                <td>{client.firstName}</td>
                <td>{client.lastName}</td>
                <td>{client.tel}</td>
                <td>{client.email}</td>
                <td
                  className="pet-amount clickable"
                  onClick={() => handlePetAmountClick(client)}
                >
                  {client.pet_count}
                </td>
                <td className="action-icons">
                  <button
                    className="action-button"
                    onClick={() => confirmDeleteClient(client)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No clients found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <a
            key={i + 1}
            href="#"
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i + 1);
            }}
          >
            {i + 1}
          </a>
        ))}
      </div>

      {showPetOverlay && selectedClient && (
        <PetOverlay
          clientName={`${selectedClient.firstName} ${selectedClient.lastName}`}
          pets={clientPets}
          onClose={() => setShowPetOverlay(false)}
          onDeletePet={handleDeletePet}
        />
      )}

      {showDeleteOverlay && (
        <ConfirmDeleteOverlay
          message="Are you sure you want to delete this client and their pets?"
          onConfirm={handleDeleteClient}
          onCancel={() => setShowDeleteOverlay(false)}
        />
      )}
    </div>
  );
};

export default ClientManagementPage;