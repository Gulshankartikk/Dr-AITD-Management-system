import React, { useState } from 'react';
import { FaBookOpen, FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';

const LibraryManagement = () => {
  const [books] = useState([
    { id: 1, title: 'Data Structures & Algorithms', author: 'Thomas Cormen', isbn: '978-0262033848', available: 5, total: 10, category: 'Computer Science' },
    { id: 2, title: 'Engineering Mechanics', author: 'R.C. Hibbeler', isbn: '978-0133918922', available: 3, total: 8, category: 'Mechanical' },
    { id: 3, title: 'Business Management', author: 'Peter Drucker', isbn: '978-0060878979', available: 7, total: 12, category: 'Business' }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Library Management</h1>
            <p className="text-gray-600">Manage books and library resources</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <FaBookOpen />
              <span>Issue Book</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <FaPlus />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBookOpen className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">Total Books</p>
                <p className="text-2xl font-bold">2,450</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBookOpen className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-gray-600">Available</p>
                <p className="text-2xl font-bold">1,890</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBookOpen className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-gray-600">Issued</p>
                <p className="text-2xl font-bold">560</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBookOpen className="text-3xl text-red-500 mr-4" />
              <div>
                <p className="text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Categories</option>
              <option>Computer Science</option>
              <option>Mechanical</option>
              <option>Business</option>
              <option>Mathematics</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Available</option>
              <option>Issued</option>
              <option>Reserved</option>
            </select>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBookOpen className="text-blue-500 mr-3" />
                        <span className="font-medium text-gray-900">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{book.isbn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{book.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.available}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{book.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-green-600 hover:text-green-900">Issue</button>
                      <button className="text-blue-600 hover:text-blue-900"><FaEdit /></button>
                      <button className="text-red-600 hover:text-red-900"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Library Activities</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Book issued: "Data Structures & Algorithms"</p>
                <p className="text-xs text-gray-600">To: John Doe (CS101)</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Book returned: "Engineering Mechanics"</p>
                <p className="text-xs text-gray-600">By: Jane Smith (ME102)</p>
              </div>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">New book added: "Advanced Mathematics"</p>
                <p className="text-xs text-gray-600">Category: Mathematics</p>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryManagement;