import EmployeeService from '../services/Employee.service.js';

const EmployeeController = {
    async getEmployeesByService(req, res) {
        try {
            const { serviceId } = req.params;
            const { role } = req.user;  
            console.log(serviceId);

            const employees = await EmployeeService.getEmployeeEachService(serviceId, role); 

            if (employees.error) {
                return res.status(500).json({ error: employees.error });
            }

            res.status(200).json(employees);
        } catch (error) {
            console.error(`Error in EmployeeController: ${error.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async updateEmployee(req, res) {
        try {
            const { employeeId } = req.params;
            const updateData = req.body;
            console.log(updateData)
            const { role } = req.user; 

            const result = await EmployeeService.updateEmployee(employeeId, updateData, role);  

            if (result.error) {
                return res.status(500).json({ error: result.error });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error(`Error in EmployeeController.updateEmployee: ${error.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async addEmployee(req, res) {
        try {
            const employeeData = req.body;
            const { role } = req.user;  // Extract role from req.user

            const result = await EmployeeService.addEmployee(employeeData, role);  // Pass role to the service

            if (result.error) {
                return res.status(500).json({ error: result.error });
            }

            res.status(201).json(result);
        } catch (error) {
            console.error(`Error in EmployeeController.addEmployee: ${error.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async deleteEmployee(req, res) {
        try {
            const { employeeId } = req.params;
            const { role } = req.user;  // Extract role from req.user
            console.log(employeeId);

            const result = await EmployeeService.deleteEmployee(employeeId, role);  // Pass role to the service

            if (result.error) {
                return res.status(500).json({ error: result.error });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error(`Error in EmployeeController.deleteEmployee: ${error.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

export default EmployeeController;
