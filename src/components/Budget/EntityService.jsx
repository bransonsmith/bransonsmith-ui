
import { makeRequestToApi } from '../../Services/ApiService';

export const getEntities = async (entityName) => {

    var result = {
        entities: [],
        error: null
    }

    try {
        console.debug(`Getting ${entityName}s`);
        const response = await makeRequestToApi(`api/${entityName}`, 'GET', null);
        if (response.status === 200) {
            result.entities = response.data;
        }
        else if (response.status === 400) {
            console.error(`Error getting ${entityName}s: `, response);
            result.error = `Failed to retrieve ${entityName}s. Bad Request.`
        }
        else if (response.status === 401) {
            console.error(`Not authenticated. Please log in.`, response);
            result.error = `Not authenticated. Please log in.`
        }
        else if (response.status === 404) {
            console.error(`Failed to retrieve ${entityName}s. Object type not found.`, response);
            result.error = `Failed to retrieve ${entityName}s. Object type not found.`
        }
        else {
            console.error(`Error getting ${entityName}s: `, response);
            result.error = `Failed to retrieve ${entityName}s`
        }
    } catch (error) {
        console.error('Exception getting Transactions: ', error);
        result.error = `Exception retrieving ${entityName}s. Server or Connection Error.`
    }
    finally {
        return result;
    }
}

