import React, { useEffect, useState } from 'react';
import { getUserInfo } from '../services/apiService';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
        const data = await getUserInfo(token);
        setUserInfo(data);
      } catch (err) {
        setError('Failed to fetch user info');
      }
    };

    fetchUserInfo();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {userInfo ? (
        <div>
          <h2>User Information</h2>
          <p>First Name: {userInfo.firstname}</p>
          <p>Last Name: {userInfo.lastname}</p>
          <p>Email: {userInfo.email}</p>
          <p>Role: {userInfo.role}</p>
          <p>Age: {userInfo.age}</p>
          <p>Preferences: {userInfo.preferences ? userInfo.preferences.join(', ') : 'None'}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default UserInfo; 