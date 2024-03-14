import { Client } from '@elastic/elasticsearch';
import { Employee } from '../entities/Employee';

class SearchService {
    private client: Client;

    constructor() {
        this.client = new Client({ node: 'http://localhost:9200' });
    }

    async indexWithMapping() {
        const indexName = 'employees';
        const indexExists = await this.client.indices.exists({ index: indexName });

        if (indexExists) {
            await this.client.indices.delete({ index: indexName });
            console.log(`Index ${indexName} deleted.`);
        }

        await this.client.indices.create({
            index: indexName,
            mappings: {
                properties: {
                    uuid: { type: 'keyword' },
                    firstName: { type: 'text' },
                    lastName: { type: 'text' },
                    name: {
                        type: 'text',
                        fields: {
                            keyword: {
                                type: 'keyword',
                                ignore_above: 256
                            }
                        }
                    },
                    email: { type: 'keyword' },
                    phoneNumber: { type: 'text' },
                    hireDate: { type: 'date' },
                    jobTitle: { type: 'text' },
                    picture: { type: 'text' },
                    biography: { type: 'text' },
                    departments: {
                        type: 'nested',
                        properties: {
                            uuid: { type: 'keyword' },
                            name: { type: 'text' },
                            role: { type: 'text' }
                        }
                    },
                    projects: {
                        type: 'nested',
                        properties: {
                            uuid: { type: 'keyword' },
                            name: { type: 'text' },
                            role: { type: 'text' }
                        }
                    },
                    skills: {
                        type: 'nested',
                        properties: {
                            uuid: { type: 'keyword' },
                            name: { type: 'text' }
                        }
                    },
                    locations: {
                        type: 'nested',
                        properties: {
                            uuid: { type: 'keyword' },
                            name: { type: 'text' },
                            address: { type: 'text' },
                            city: { type: 'text' },
                            state: { type: 'text' },
                            country: { type: 'text' },
                            zipCode: { type: 'keyword' }
                        }
                    }
                }
            }
        });
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

    async removeEmployeeFromIndex(uuid: string) {
        await this.client.delete({
            index: 'employees',
            id: uuid,
        });
    }

    async searchEmployees(query: string) {
        try {
            const response = await this.client.search({
                query: {
                    prefix: { 'employee.name': query },
                },
            });

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
}

export default SearchService
