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
                uuid: employee.uuid,
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
                    uuid: ed.department.uuid,
                    name: ed.department.name,
                    role: ed.role,
                })),
                projects: employee.employeeProjects?.map((ep) => ({
                    uuid: ep.project.uuid,
                    name: ep.project.name,
                    role: ep.role,
                })),
                skills: employee.employeeSkills?.map((es) => ({
                    uuid: es.skill.uuid,
                    name: es.skill.name,
                })),
                locations: employee.employeeLocations?.map((el) => ({
                    uuid: el.location.uuid,
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
                id: employee.uuid,
                document: {
                    employee: employeeData,
                },
            });
        }
    }

    async searchEmployees(query: string) {
        console.log(query);
        try {

            const response = await this.client.search({
                query: {
                    prefix: { 'employee.name': query },
                },
            });
            console.log(response);

            // const result = await this.client.search({
            //     index: 'employees',
            //     query: {
            //         multi_match: {
            //             query: query,
            //             fields: [
            //                 'employee.name',
            //                 'employee.jobTitle',
            //                 'employee.departments.name',
            //                 'employee.locations.name'
            //             ],
            //             type: 'best_fields',
            //         },
            //     },
            // });
            // console.log(result);

            if (response.hits && response.hits.hits.length > 0) {
                // @ts-ignore
                return response.hits.hits.map((hit) => hit._source.employee);
            } else {
                return []
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    // async filterEmployeesByDepartment(department: string) {
    // }
}

export default SearchService
