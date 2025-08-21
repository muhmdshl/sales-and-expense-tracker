import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

const EditSale = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    amount: '',
    paymentType: 'Cash',
    note: '',
    date: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [currentAttachment, setCurrentAttachment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSale = async () => {
    try {
      const response = await api.get(`/sales/${id}`);
      const sale = response.data;
      setFormData({
        amount: sale.amount.toString(),
        paymentType: sale.paymentType,
        note: sale.note || '',
        date: new Date(sale.date).toISOString().split('T')[0]
      });
      setCurrentAttachment(sale.attachment || '');
    } catch (error) {
      setError('Failed to fetch sale details');
      console.error('Error fetching sale:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      if (attachment) {
        submitData.append('attachment', attachment);
      }

      await api.put(`/sales/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/sales');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update sale');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Sale</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update the sales transaction details
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  step="0.01"
                  min="0"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700">
                Payment Type *
              </label>
              <select
                id="paymentType"
                name="paymentType"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={formData.paymentType}
                onChange={handleChange}
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                name="date"
                id="date"
                required
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                Attachment
              </label>
              {currentAttachment && (
                <div className="mt-1 mb-2">
                  <a
                    href={`http://localhost:5000/uploads/${currentAttachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View current attachment
                  </a>
                </div>
              )}
              <input
                type="file"
                name="attachment"
                id="attachment"
                accept=".jpg,.jpeg,.png,.pdf"
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                onChange={handleFileChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, PDF up to 5MB. Leave empty to keep current attachment.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Note/Description
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Optional description or notes about this sale..."
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/sales')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSale;