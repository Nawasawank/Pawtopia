import React, { useState, useEffect } from 'react';
import Navbar from '../components/admin_navbar.jsx';
import Emp_Overlay from '../components/Emp_Overlay.jsx';
import api from '../api';
import '../styles/Employee.css';

const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  useEffect(() => {
    if (selectedService) {
      fetchEmployees(selectedService);
    }
  }, [selectedService]);

  const fetchEmployees = async (serviceId) => {
    try {
      const response = await api.get(`/api/employees/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEmployees(response.data || []);
      setCurrentPage(1); // Reset to the first page when employees are fetched
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
        console.log(employeeData)
      await api.post('/api/employees', employeeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchEmployees(selectedService);
      setShowAddOverlay(false);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleUpdateEmployee = async (employeeId, employeeData) => {
    try {
      await api.put(`/api/employees/update/${employeeId}`, employeeData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchEmployees(selectedService);
      setShowEditOverlay(false);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
        console.log(employeeId)
      await api.delete(`/api/delete/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchEmployees(selectedService);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(employees.length / employeesPerPage);

  return (
    <div className="employee-management-container">
      <Navbar />

      <h1 className="page-title">Employee Management</h1>

      <div className="service-selection">
        <div className="select-container">
          <label>Select Service:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">-- Select a Service --</option>
            <option value="1">Grooming</option>
            <option value="2">Swimming</option>
            <option value="3">Vaccination</option>
            <option value="4">Pet Park</option>
          </select>
        </div>
        <button className="add-employee-button" onClick={() => setShowAddOverlay(true)}>
          ➕ Add Employee
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length > 0 ? (
            currentEmployees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_id}</td>
                <td>{employee.first_name}</td>
                <td>{employee.last_name}</td>
                <td>{employee.email}</td>
                <td className="action-icons">
                  <button className="action-button" onClick={() => { setCurrentEmployee(employee); setShowEditOverlay(true); }}>✏️</button>
                  <button className="action-button" onClick={() => handleDeleteEmployee(employee.employee_id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
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

      {showAddOverlay && (
        <Emp_Overlay
          title="Add Employee"
          onClose={() => setShowAddOverlay(false)}
          onSubmit={(data) => handleAddEmployee(data)}
        />
      )}

      {showEditOverlay && currentEmployee && (
        <Emp_Overlay
          title="Edit Employee"
          employee={currentEmployee}
          onClose={() => setShowEditOverlay(false)}
          onSubmit={(data) => handleUpdateEmployee(currentEmployee.employee_id, data)}
        />
      )}
    </div>
  );
};

export default EmployeeManagementPage;
