import Employee from '../models/Employee.model.js';

const EmployeeService = {
    async getEmployeeEachService(serviceId, role) {
        try {
            const employeesForService = await Employee.findEmployeesWithServices(serviceId, role);

            if (!employeesForService || employeesForService.length === 0) {
                throw new Error(`No employees found for service ID: ${serviceId}`);
            }

            return employeesForService;
        } catch (error) {
            console.error(`Error fetching employees for service: ${error.message}`);
            return { error: 'Error fetching employees for service' };
        }
    },

    async updateEmployee(employeeId, updateData, role) {
        try {
            const result = await Employee.updateEmployee(employeeId, updateData, role);  // Pass role to the model

            if (!result) {
                throw new Error(`Employee with ID ${employeeId} could not be updated`);
            }

            return { message: "Employee information and service assignment updated successfully" };
        } catch (error) {
            console.error(`Error updating employee with ID ${employeeId}: ${error.message}`);
            return { error: 'Error updating employee information' };
        }
    },

    async addEmployee(employeeData, role) {
        try {
            const result = await Employee.addEmployeeAndService(employeeData, role);  // Pass role to the model

            if (result.error) {
                throw new Error('Error adding new employee');
            }

            return result;
        } catch (error) {
            console.error(`Error adding employee: ${error.message}`);
            return { error: 'Error adding new employee' };
        }
    },

    async deleteEmployee(employeeId, role) {
        try {
            const result = await Employee.deleteEmployee(employeeId, role);  // Pass role to the model

            if (!result.affectedRows) {
                throw new Error(`Employee with ID ${employeeId} not found or could not be deleted`);
            }

            return { message: `Employee with ID ${employeeId} deleted successfully` };
        } catch (error) {
            console.error(`Error deleting employee with ID ${employeeId}: ${error.message}`);
            return { error: 'Error deleting employee' };
        }
    }
};

export default EmployeeService;
