import { Client } from '@elastic/elasticsearch';

class SearchService {
    private client: Client;

    constructor() {
        this.client = new Client({ node: 'http://localhost:9200' });
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
