import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTesting, updateTesting, getTesting } from '../api/client';

interface Testing {
  id: number;
  name: string;
  description: string;
}
interface TestingFormData {
  name: string;
  description: string;
}

export const TestingForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TestingFormData>({ name: '', description: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(!!id);

  useEffect(() => {
    if (isEdit && id) {
      const fetchTesting = async () => {
        try {
          setLoading(true);
          const data = await getTesting(Number(id));
          setFormData({ name: data.name, description: data.description });
        } catch (err) {
          setError('Failed to load testing');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTesting();
    }
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Name and description are required');
      return;
    }
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateTesting(Number(id), formData);
      } else {
        await createTesting(formData);
      }
      navigate('/testings');
    } catch (err) {
      setError('Failed to save testing');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // TODO: implement proper validation for description length

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Testing' : 'Add New Testing'}</h1>
      </div>

      {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate(isEdit ? '/testings' : '/')}
            className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};