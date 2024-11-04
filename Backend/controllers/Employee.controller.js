import EmployeeService from '../services/Employee.service.js';

const EmployeeController = {
    async getEmployeesByService(req, res) {
        try {
            const { serviceId } = req.params;
            console.log(serviceId)
            const employees = await EmployeeService.getEmployeeEachService(serviceId);

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

            const result = await EmployeeService.updateEmployee(employeeId, updateData);

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

            const result = await EmployeeService.addEmployee(employeeData);

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

            const result = await EmployeeService.deleteEmployee(employeeId);

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
