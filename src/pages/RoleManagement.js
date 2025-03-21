import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Button, Modal, Alert, Badge } from 'react-bootstrap';
import { getRoles, createRole, updateRole, deleteRole } from '../utils/api';
import { toast } from 'react-toastify';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Available permissions
  const availablePermissions = [
    'manage_users',
    'manage_roles',
    'view_dashboard',
    'edit_content',
    'create_content',
    'delete_content',
    'publish_content'
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await getRoles();
      
      if (result.success) {
        setRoles(result.data);
      } else {
        setError(result.message || 'Failed to fetch roles');
      }
    } catch (err) {
      setError('An error occurred while fetching roles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      permissions: []
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (role) => {
    setModalMode('edit');
    setSelectedRole(role);
    setFormData({
      name: role.name,
      permissions: role.permissions || []
    });
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setFormError('');
  };

  const handleOpenDeleteModal = (role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePermissionChange = (permission) => {
    const updatedPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({
      ...formData,
      permissions: updatedPermissions
    });
  };

  const handleSubmitRole = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setFormError('Role name is required');
      return;
    }
    
    try {
      setFormLoading(true);
      setFormError('');
      
      let result;
      
      if (modalMode === 'create') {
        result = await createRole(formData);
      } else {
        result = await updateRole(selectedRole._id, formData);
      }
      
      if (result.success) {
        // Refresh roles list
        await fetchRoles();
        
        toast.success(
          modalMode === 'create'
            ? 'Role created successfully'
            : 'Role updated successfully'
        );
        
        handleCloseModal();
      } else {
        setFormError(result.message || `Failed to ${modalMode} role`);
      }
    } catch (err) {
      setFormError(`An error occurred while ${modalMode === 'create' ? 'creating' : 'updating'} the role`);
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    
    try {
      setDeleteLoading(true);
      
      const result = await deleteRole(roleToDelete._id);
      
      if (result.success) {
        // Remove the role from the list
        setRoles(roles.filter(role => role._id !== roleToDelete._id));
        
        toast.success('Role deleted successfully');
        handleCloseDeleteModal();
      } else {
        toast.error(result.message || 'Failed to delete role');
      }
    } catch (err) {
      toast.error('An error occurred while deleting the role');
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="mb-4">Role Management</h2>
      
      <div className="mb-3">
        <Button variant="primary" onClick={handleOpenCreateModal}>
          Create New Role
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Body>
          {loading ? (
            <p>Loading roles...</p>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Permissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length > 0 ? (
                    roles.map(role => (
                      <tr key={role._id}>
                        <td>{role.name}</td>
                        <td>
                          {role.permissions && role.permissions.length > 0 ? (
                            role.permissions.map((permission, index) => (
                              <Badge key={index} bg="info" className="me-1 mb-1">
                                {permission}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted">No permissions</span>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleOpenEditModal(role)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(role)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">No roles found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Create/Edit Role Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' ? 'Create New Role' : 'Edit Role'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          
          <Form onSubmit={handleSubmitRole}>
            <Form.Group className="mb-3">
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Permissions</Form.Label>
              <div>
                {availablePermissions.map(permission => (
                  <Form.Check
                    key={permission}
                    type="checkbox"
                    id={`permission-${permission}`}
                    label={permission}
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                    className="mb-2"
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitRole}
            disabled={formLoading}
          >
            {formLoading
              ? (modalMode === 'create' ? 'Creating...' : 'Updating...')
              : (modalMode === 'create' ? 'Create Role' : 'Update Role')}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {roleToDelete && (
            <p>
              Are you sure you want to delete the role <strong>{roleToDelete.name}</strong>?
              This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteRole}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Role'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoleManagement; 