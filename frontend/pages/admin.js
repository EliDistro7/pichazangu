import React, { useEffect, useState } from 'react';
import { getUsersWithStats } from '../actions/event';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storageData, setStorageData] = useState({});

  // Function to fetch file size
  const fetchFileSize = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const size = response.headers.get('Content-Length');
      return size ? parseInt(size, 10) : 0;
    } catch (error) {
      console.error('Error fetching file size:', error);
      return 0;
    }
  };

  // Format storage size
  const formatStorageSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`; // Bytes
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(0)} KB`; // Kilobytes
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(0)} MB`; // Megabytes
    } else if (sizeInBytes < 1024 * 1024 * 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`; // Gigabytes
    } else {
      return `${(sizeInBytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`; // Terabytes
    }
  };

  // Calculate storage for a user
  const calculateUserStorage = async (userId, mediaUrls) => {
    if (!mediaUrls || mediaUrls.length === 0) {
      return '0 B';
    }

    const fileSizes = await Promise.all(mediaUrls.map(fetchFileSize));
    const totalBytes = fileSizes.reduce((total, size) => total + size, 0);
    return formatStorageSize(totalBytes);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsersWithStats();
        setUsers(data);
        
        // Calculate storage for each user
        const storageResults = {};
        for (const user of data) {
          storageResults[user._id] = await calculateUserStorage(user._id, user.mediaUrls);
        }
        setStorageData(storageResults);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-400">User Statistics Dashboard</h1>
        
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Events</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Followers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Following</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Media Files</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Storage Used</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/50 text-blue-300">
                        {user.eventCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-300">
                      {user.totalFollowers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-300">
                      {user.following ? user.following.length : 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-300">
                      {user.mediaCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        storageData[user._id]?.includes('GB') ? 'bg-red-900/50 text-red-300' : 
                        storageData[user._id]?.includes('MB') ? 'bg-yellow-900/50 text-yellow-300' : 
                        'bg-green-900/50 text-green-300'
                      }`}>
                        {storageData[user._id] || 'Calculating...'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Storage Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400">Total Media Files</h3>
              <p className="text-2xl font-bold text-white">
                {users.reduce((sum, user) => sum + (user.mediaCount || 0), 0)}
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400">Average Storage/User</h3>
              <p className="text-2xl font-bold text-white">
                {formatStorageSize(
                  Object.values(storageData).reduce((sum, size) => {
                    const bytes = parseFloat(size) * 
                      (size.includes('KB') ? 1024 : 
                       size.includes('MB') ? 1024 * 1024 : 
                       size.includes('GB') ? 1024 * 1024 * 1024 : 
                       size.includes('TB') ? 1024 * 1024 * 1024 * 1024 : 1);
                    return sum + bytes;
                  }, 0) / users.length
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;