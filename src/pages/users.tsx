import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UsersDataTable } from '../components/data-table';
import { usersColumns } from '../components/columns';
import { RootState } from '../redux/store';
import { fetchUsers } from '../api/userAPI'; 

interface User {
  id: number;
  username: string;
  email: string;
}

const ListOfUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const getUsers = async () => {
      try {
        if (auth.token) {
          const data = await fetchUsers(auth.token);
          setUsers(data);
        } else {
          setError('User not authenticated');
        }
      } catch (error) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [auth.token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mt-10 px-4 sm:px-6 lg:px-8 bg-white ml-1">
      <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
      <div className="mt-4">
        <UsersDataTable columns={usersColumns} data={users} />
      </div>
    </div>
  );
};

export default ListOfUsers;