import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBackends, deleteBackend } from '../api/client';

interface Backend {
  id: number;
  name: string;
  description: string;
}

export const BackendList: React.FC = () => {
  const [items, setItems] = useState<Backend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchBackends = async () => {
      try {
        setLoading(true);
        const data = await getBackends();
        setItems(data);
        setError(null);
      } catch (err) {
        setError('Failed to load backends');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBackends();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteBackend(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete backend');
      console.error(err);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full border-4 border-t-2 border-blue-500 w-12 h-12"></div></div>;

  if (error) return <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Backends</h1>
        <Link to="/backend/new" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">Add New</Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search backends..."
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No backends found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(item.id)}
                     ="