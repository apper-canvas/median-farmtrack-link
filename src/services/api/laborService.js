import { getApperClient } from '@/services/apperClient';

/**
 * Labor Service
 * Handles all labor-related operations using ApperClient
 */

const TABLE_NAME = 'labor_c';

// Field definitions based on labor_c table schema
const FIELDS = {
  UPDATEABLE: ['Name', 'Tags', 'task_c', 'employee_c', 'time_c', 'farm_c'],
  ALL: [
    'Name',
    'Tags',
    'task_c',
    'employee_c',
    'time_c',
    'farm_c',
    'Owner',
    'CreatedOn',
    'CreatedBy',
    'ModifiedOn',
    'ModifiedBy'
  ]
};

/**
 * Get all labor records
 */
const getAll = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: FIELDS.ALL.map(fieldName => {
        if (fieldName === 'farm_c') {
          return {
            field: { Name: fieldName }
          };
        }
        return { field: { Name: fieldName } };
      }),
      orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
      pagingInfo: { limit: 100, offset: 0 }
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);

    if (!response?.data) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching labors:', error?.response?.data?.message || error);
    throw error;
  }
};

/**
 * Get single labor record by ID
 */
const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: FIELDS.ALL.map(fieldName => ({ field: { Name: fieldName } }))
    };

    const response = await apperClient.getRecordById(TABLE_NAME, id, params);

    if (!response?.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching labor ${id}:`, error?.response?.data?.message || error);
    throw error;
  }
};

/**
 * Create new labor record
 */
const create = async (laborData) => {
  try {
    const apperClient = getApperClient();

    // Only include Updateable fields
    const record = {};
    FIELDS.UPDATEABLE.forEach(field => {
      if (laborData[field] !== undefined && laborData[field] !== null && laborData[field] !== '') {
        // Convert farm_c lookup to integer ID
        if (field === 'farm_c') {
          record[field] = parseInt(laborData[field]);
        } else if (field === 'time_c') {
          record[field] = parseFloat(laborData[field]);
        } else {
          record[field] = laborData[field];
        }
      }
    });

    const params = { records: [record] };
    const response = await apperClient.createRecord(TABLE_NAME, params);

    if (!response.success) {
      throw new Error(response.message || 'Failed to create labor record');
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to create labor record:`, failed);
        throw new Error(failed[0].message || 'Failed to create labor record');
      }
      return response.results[0].data;
    }

    return null;
  } catch (error) {
    console.error('Error creating labor:', error?.response?.data?.message || error);
    throw error;
  }
};

/**
 * Update existing labor record
 */
const update = async (id, laborData) => {
  try {
    const apperClient = getApperClient();

    // Only include Updateable fields plus Id
    const record = { Id: parseInt(id) };
    FIELDS.UPDATEABLE.forEach(field => {
      if (laborData[field] !== undefined && laborData[field] !== null && laborData[field] !== '') {
        // Convert farm_c lookup to integer ID
        if (field === 'farm_c') {
          record[field] = parseInt(laborData[field]);
        } else if (field === 'time_c') {
          record[field] = parseFloat(laborData[field]);
        } else {
          record[field] = laborData[field];
        }
      }
    });

    const params = { records: [record] };
    const response = await apperClient.updateRecord(TABLE_NAME, params);

    if (!response.success) {
      throw new Error(response.message || 'Failed to update labor record');
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to update labor record:`, failed);
        throw new Error(failed[0].message || 'Failed to update labor record');
      }
      return response.results[0].data;
    }

    return null;
  } catch (error) {
    console.error('Error updating labor:', error?.response?.data?.message || error);
    throw error;
  }
};

/**
 * Delete labor record
 */
const deleteLabor = async (id) => {
  try {
    const apperClient = getApperClient();

    const params = { RecordIds: [parseInt(id)] };
    const response = await apperClient.deleteRecord(TABLE_NAME, params);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete labor record');
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error(`Failed to delete labor record:`, failed);
        throw new Error(failed[0].message || 'Failed to delete labor record');
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error deleting labor:', error?.response?.data?.message || error);
    throw error;
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteLabor
};