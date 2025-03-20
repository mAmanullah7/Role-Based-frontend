import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getRoles } from '../utils/api';

const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const result = await getRoles();
        if (result.success) {
          setRoles(result.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Helper function to get user role
  const getUserRole = () => {
    if (!currentUser || !currentUser.role) return 'Unknown';
    return typeof currentUser.role === 'string' ? currentUser.role : currentUser.role.name;
  };

  // Helper function to get user permissions
  const getUserPermissions = () => {
    if (!currentUser || !currentUser.role) return [];
    
    // If role is an object with permissions
    if (typeof currentUser.role !== 'string' && currentUser.role.permissions) {
      return currentUser.role.permissions;
    }
    
    // Otherwise, find the role in the roles list
    const userRole = getUserRole();
    const roleObj = roles.find(r => r.name === userRole);
    return roleObj ? roleObj.permissions : [];
  };

  return (
    <div className="dashboard-container">
      <h2 className="mb-4">Dashboard</h2>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h4>User Information</h4>
            </Card.Header>
            <Card.Body>
              <p><strong>Name:</strong> {currentUser?.name}</p>
              <p><strong>Email:</strong> {currentUser?.email}</p>
              <p><strong>Gender:</strong> {currentUser?.gender}</p>
              <p><strong>Age:</strong> {currentUser?.age}</p>
              <p>
                <strong>Role:</strong>{' '}
                <Badge bg="primary">{getUserRole()}</Badge>
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>Your Permissions</h4>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Loading permissions...</p>
              ) : (
                <>
                  {getUserPermissions().length > 0 ? (
                    <div>
                      {getUserPermissions().map((permission, index) => (
                        <Badge key={index} bg="info" className="me-2 mb-2">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p>No permissions found for your role.</p>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {isAdmin && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h4>Admin Quick Links</h4>
              </Card.Header>
              <Card.Body>
                <p>As an administrator, you have access to the following features:</p>
                <ul>
                  <li>
                    <a href="/users">Manage Users</a> - View all users and assign roles
                  </li>
                  <li>
                    <a href="/roles">Manage Roles</a> - Create, edit, and delete roles
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard; 