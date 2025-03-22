import axios from 'axios';

const API_URL = 'https://role-based-backend-gamma.vercel.app/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Role API calls
export const getRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles`, getAuthHeader());
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching roles:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch roles'
    };
  }
};

export const getRoleById = async (roleId) => {
  try {
    const response = await axios.get(`${API_URL}/roles/${roleId}`, getAuthHeader());
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching role ${roleId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch role'
    };
  }
};

export const createRole = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/roles`, roleData, getAuthHeader());
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating role:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create role'
    };
  }
};

export const updateRole = async (roleId, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/roles/${roleId}`, roleData, getAuthHeader());
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error updating role ${roleId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update role'
    };
  }
};

export const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(`${API_URL}/roles/${roleId}`, getAuthHeader());
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error deleting role ${roleId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete role'
    };
  }
};

// User API calls
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, getAuthHeader());
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch users'
    };
  }
};

export const assignRoleToUser = async (userId, roleId) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/assign-role`,
      { userId, roleId },
      getAuthHeader()
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error assigning role:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to assign role'
    };
  }
}; 