import { Client } from '@elastic/elasticsearch';
import { Employee } from '../entities/Employee';

class SearchService {
    private client: Client;

    constructor() {
        this.client = new Client({ node: 'http://localhost:9200' });
    }

    async indexEmployees(employees: Employee[]) {
        for (const employee of employees) {
            const employeeData = {
                id: employee.uuid,
                firstName: employee.firstName,
                lastName: employee.lastName,
                name: employee.name,
                email: employee.email,
                phoneNumber: employee.phoneNumber,
                hireDate: employee.hireDate,
                jobTitle: employee.jobTitle,
                picture: employee.picture,
                biography: employee.biography,
                departments: employee.employeeDepartments?.map((ed) => ({
                    id: ed.department.uuid,
                    name: ed.department.name,
                    role: ed.role,
                })),
                projects: employee.employeeProjects?.map((ep) => ({
                    id: ep.project.uuid,
                    name: ep.project.name,
                    role: ep.role,
                })),
                skills: employee.employeeSkills?.map((es) => ({
                    id: es.skill.uuid,
                    name: es.skill.name,
                })),
                locations: employee.employeeLocations?.map((el) => ({
                    id: el.location.uuid,
                    name: el.location.name,
                    address: el.location.address,
                    city: el.location.city,
                    state: el.location.state,
                    country: el.location.country,
                    zipCode: el.location.zipCode,
                })),
            };

            await this.client.index({
                index: 'employees',
                document: employeeData,
            });
        }
    }

    async searchEmployees(query: string) {
        const result = await this.client.search({
            index: 'employees',
            body: {
                query: {
                    multi_match: {
                        query: query,
                        fields: [
                            'name',
                            'jobTitle',
                            'department',
                            'location'
                        ],
                    },
                },
            },
        });
        return result.body.hits.hits.map((hit) => hit._source);
    }

    async filterEmployeesByDepartment(department: string) {
    }
}

export default SearchService
