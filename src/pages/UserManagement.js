import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Button, Modal, Alert, Badge } from 'react-bootstrap';
import { getUsers, getRoles, assignRoleToUser } from '../utils/api';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch users and roles in parallel
        const [usersResult, rolesResult] = await Promise.all([
          getUsers(),
          getRoles()
        ]);
        
        if (usersResult.success) {
          setUsers(usersResult.data);
        } else {
          setError(usersResult.message || 'Failed to fetch users');
        }
        
        if (rolesResult.success) {
          setRoles(rolesResult.data);
        } else {
          setError(rolesResult.message || 'Failed to fetch roles');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    // Set the current role as the default selected role
    const userRoleId = typeof user.role === 'string' 
      ? roles.find(r => r.name === user.role)?._id 
      : user.role?._id;
    setSelectedRoleId(userRoleId || '');
    setShowModal(true);
    setAssignError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setSelectedRoleId('');
    setAssignError('');
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRoleId) {
      setAssignError('Please select a role');
      return;
    }
    
    try {
      setAssignLoading(true);
      setAssignError('');
      
      const result = await assignRoleToUser(selectedUser._id, selectedRoleId);
      
      if (result.success) {
        // Update the user in the users array
        const updatedUsers = users.map(user => {
          if (user._id === selectedUser._id) {
            // Find the role object
            const role = roles.find(r => r._id === selectedRoleId);
            return {
              ...user,
              role: role || { name: result.data.user.role }
            };
          }
          return user;
        });
        
        setUsers(updatedUsers);
        toast.success('Role assigned successfully');
        handleCloseModal();
      } else {
        setAssignError(result.message || 'Failed to assign role');
      }
    } catch (err) {
      setAssignError('An error occurred while assigning role');
      console.error(err);
    } finally {
      setAssignLoading(false);
    }
  };

  // Helper function to get role name
  const getRoleName = (user) => {
    if (!user.role) return 'None';
    return typeof user.role === 'string' ? user.role : user.role.name;
  };

  return (
    <div className="dashboard-container">
      <h2 className="mb-4">User Management</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.gender}</td>
                        <td>{user.age}</td>
                        <td>
                          <Badge bg={getRoleName(user) === 'admin' ? 'danger' : 'primary'}>
                            {getRoleName(user)}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleOpenModal(user)}
                          >
                            Assign Role
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No users found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Assign Role Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                <strong>User:</strong> {selectedUser.name} ({selectedUser.email})
              </p>
              <p>
                <strong>Current Role:</strong>{' '}
                <Badge bg="primary">{getRoleName(selectedUser)}</Badge>
              </p>
              
              {assignError && <Alert variant="danger">{assignError}</Alert>}
              
              <Form.Group className="mb-3">
                <Form.Label>Select Role</Form.Label>
                <Form.Select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAssignRole}
            disabled={assignLoading}
          >
            {assignLoading ? 'Assigning...' : 'Assign Role'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement; 