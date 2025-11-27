import React, { useState } from 'react';
import { FaDollarSign, FaPlus, FaDownload, FaSearch } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const FeeManagement = () => {
  const [feeRecords] = useState([
    { id: 1, student: 'John Doe', course: 'Computer Science', amount: 50000, paid: 30000, due: 20000, status: 'Partial' },
    { id: 2, student: 'Jane Smith', course: 'Mechanical Eng.', amount: 55000, paid: 55000, due: 0, status: 'Paid' },
    { id: 3, student: 'Mike Johnson', course: 'Business Admin', amount: 45000, paid: 0, due: 45000, status: 'Pending' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
            <p className="text-gray-600">Manage student fees and payments</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <FaDownload />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <FaPlus />
              <span>Add Payment</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaDollarSign className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-gray-600">Total Collection</p>
                <p className="text-2xl font-bold">₹85,000</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaDollarSign className="text-3xl text-red-500 mr-4" />
              <div>
                <p className="text-gray-600">Total Due</p>
                <p className="text-2xl font-bold">₹65,000</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaDollarSign className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">This Month</p>
                <p className="text-2xl font-bold">₹25,000</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaDollarSign className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-gray-600">Pending</p>
                <p className="text-2xl font-bold">₹40,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Paid</option>
              <option>Partial</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        {/* Fee Records Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {feeRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{record.student}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">₹{record.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600">₹{record.paid.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600">₹{record.due.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        record.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-green-600 hover:text-green-900">Pay</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeManagement;