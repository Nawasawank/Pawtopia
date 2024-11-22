import React, { useState, useEffect } from 'react';
import Navbar from '../components/admin_navbar.jsx';
import api from '../api.js';
import PetOverlay from '../components/PetOverlay.jsx';
import '../styles/ClientManagePage.css';

const ClientManagementPage = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null); // Selected client for overlay
  const [clientPets, setClientPets] = useState([]); // Pets of the selected client
  const [showPetOverlay, setShowPetOverlay] = useState(false);
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
      setClientPets(response.data.pets || []); // Access the pets array directly
      setShowPetOverlay(true); // Show the overlay once pets are fetched
    } catch (error) {
      console.error('Error fetching pets:', error);
      setClientPets([]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page when searching
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No clients found.</td>
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
        />
      )}
    </div>
  );
};

export default ClientManagementPage;
