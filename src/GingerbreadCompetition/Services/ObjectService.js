const functionBaseUrl = 'YOUR_FUNCTION_BASE_URL'; // Replace with your actual base URL

async function getAll(tableName) {
    try {
        const response = await fetch(`${functionBaseUrl}?table=${tableName}`);
        const data = await response.json();
        if (!response.ok) {
            return error(response.status, `Failed to load ${tableName}. ${response.status}. ${data.message}`);
        }
        return success(response.status, data, `${tableName} loaded successfully.`);
    } catch (error) {
        return error(null, `Failed to load ${tableName}. ${error.message}`);
    }
}

async function create(tableName, newItem) {
    try {
        const response = await fetch(`${functionBaseUrl}?table=${tableName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });
        const data = await response.json();
        if (!response.ok) {
            return error(response.status, `Failed to create ${tableName}. ${response.status}. ${data.message}`);
        }
        return success(response.status, data, `${newItem.name} created successfully.`);
    } catch (error) {
        return error(null, `Failed to create ${tableName}. ${error.message}`);
    }
}

async function update(tableName, updatedItem) {
    try {
        const response = await fetch(`${functionBaseUrl}?table=${tableName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem)
        });
        const data = await response.json();
        if (!response.ok) {
            return error(response.status, `Failed to update ${tableName}. ${response.status}. ${data.message}`);
        }
        return success(response.status, data, `${updatedItem.name} updated successfully.`);
    } catch (error) {
        return error(null, `Failed to update ${tableName}. ${error.message}`);
    }
}

async function remove(tableName, itemId) {
    try {
        const response = await fetch(`${functionBaseUrl}?table=${tableName}&id=${itemId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const data = await response.json();
            return error(response.status, `Failed to delete ${tableName}. ${response.status}. ${data.message}`);
        }
        return success(response.status, null, `Item deleted successfully.`);
    } catch (error) {
        return error(null, `Failed to delete ${tableName}. ${error.message}`);
    }
}

function success(status, data, message) {
    return {
        success: true,
        status: status,
        message: `${status}: ${message}`,
        data: data
    };
}

function error(status, message) {
    return {
        success: false,
        status: status,
        message: `${status}: ${message}`,
        data: null
    };
}

export default {
    getAll,
    create,
    update,
    remove
};