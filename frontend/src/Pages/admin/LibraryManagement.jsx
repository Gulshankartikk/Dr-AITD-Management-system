import React, { useState } from 'react';
import { FaBookOpen, FaPlus, FaSearch, FaEdit, FaTrash, FaDownload, FaEye, FaTimes, FaCheck, FaBook, FaUser } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const LibraryManagement = () => {
  const [books, setBooks] = useState([
    { id: 1, title: 'Data Structures & Algorithms', author: 'Thomas Cormen', isbn: '978-0262033848', available: 5, total: 10, category: 'Computer Science', location: 'A-101' },
    { id: 2, title: 'Engineering Mechanics', author: 'R.C. Hibbeler', isbn: '978-0133918922', available: 3, total: 8, category: 'Mechanical', location: 'B-205' },
    { id: 3, title: 'Business Management', author: 'Peter Drucker', isbn: '978-0060878979', available: 7, total: 12, category: 'Business', location: 'C-301' },
    { id: 4, title: 'Advanced Mathematics', author: 'James Stewart', isbn: '978-1285741550', available: 2, total: 6, category: 'Mathematics', location: 'A-205' },
    { id: 5, title: 'Physics Fundamentals', author: 'David Halliday', isbn: '978-1118230718', available: 0, total: 5, category: 'Physics', location: 'B-102' }
  ]);

  const [issuedBooks] = useState([
    { id: 1, bookTitle: 'Data Structures & Algorithms', student: 'Gulshan kumar', rollNo: 'CS001', issueDate: '2024-01-15', dueDate: '2024-02-15', status: 'Active' },
    { id: 2, bookTitle: 'Engineering Mechanics', student: 'Ankita maurya', rollNo: 'ME002', issueDate: '2024-01-10', dueDate: '2024-02-10', status: 'Overdue' },
    { id: 3, bookTitle: 'Business Management', student: 'Aditya kumar', rollNo: 'BA003', issueDate: '2024-01-20', dueDate: '2024-02-20', status: 'Active' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const [newBook, setNewBook] = useState({
    title: '', author: '', isbn: '', category: '', total: 0, location: ''
  });

  const [issueForm, setIssueForm] = useState({
    bookId: '', studentRoll: '', issueDate: new Date().toISOString().split('T')[0], dueDate: ''
  });

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesCategory = selectedCategory === 'All Categories' || book.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' ||
      (selectedStatus === 'Available' && book.available > 0) ||
      (selectedStatus === 'Out of Stock' && book.available === 0);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const exportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Title,Author,ISBN,Category,Available,Total,Location\n" +
      filteredBooks.map(book =>
        `"${book.title}","${book.author}",${book.isbn},${book.category},${book.available},${book.total},${book.location}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `library_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addBook = () => {
    const book = {
      id: books.length + 1,
      ...newBook,
      available: newBook.total
    };
    setBooks([...books, book]);
    setNewBook({ title: '', author: '', isbn: '', category: '', total: 0, location: '' });
    setShowAddModal(false);
    alert('Book added successfully!');
  };

  const issueBook = () => {
    alert('Book issued successfully!');
    setShowIssueModal(false);
    setIssueForm({ bookId: '', studentRoll: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '' });
  };

  const editBook = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  const saveEditedBook = () => {
    setBooks(books.map(book => book.id === selectedBook.id ? selectedBook : book));
    setShowEditModal(false);
    alert('Book updated successfully!');
  };

  const viewDetails = (book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  const deleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(book => book.id !== bookId));
      alert('Book deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">Library Management</h1>
            <p className="text-text-grey">Manage books and library resources</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <FaDownload />
              <span>Export Report</span>
            </button>
            <button
              onClick={() => setShowIssueModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaBookOpen />
              <span>Issue Book</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
            >
              <FaPlus />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBookOpen className="text-3xl text-sky-blue mr-4" />
              <div>
                <p className="text-text-grey">Total Books</p>
                <p className="text-2xl font-bold">{books.reduce((sum, book) => sum + book.total, 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBookOpen className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-text-grey">Available</p>
                <p className="text-2xl font-bold">{books.reduce((sum, book) => sum + book.available, 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBookOpen className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-text-grey">Issued</p>
                <p className="text-2xl font-bold">{books.reduce((sum, book) => sum + (book.total - book.available), 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaBookOpen className="text-3xl text-red-500 mr-4" />
              <div>
                <p className="text-text-grey">Overdue</p>
                <p className="text-2xl font-bold">{issuedBooks.filter(book => book.status === 'Overdue').length}</p>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
            >
              <option>All Categories</option>
              <option>Computer Science</option>
              <option>Mechanical</option>
              <option>Business</option>
              <option>Mathematics</option>
              <option>Physics</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
            >
              <option>All Status</option>
              <option>Available</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Book Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">ISBN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Available</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBookOpen className="text-sky-blue mr-3" />
                        <span className="font-medium text-navy">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{book.isbn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{book.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {book.available}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{book.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{book.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewDetails(book)}
                          className="text-sky-blue hover:text-sky-blue/80"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => editBook(book)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Book Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Add New Book</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Book Title</label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Author</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">ISBN</label>
                  <input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Category</label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  >
                    <option value="">Select Category</option>
                    <option>Computer Science</option>
                    <option>Mechanical</option>
                    <option>Business</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Total Copies</label>
                  <input
                    type="number"
                    value={newBook.total}
                    onChange={(e) => setNewBook({ ...newBook, total: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Location</label>
                  <input
                    type="text"
                    value={newBook.location}
                    onChange={(e) => setNewBook({ ...newBook, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={addBook}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Add Book
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Issue Book Modal */}
        {showIssueModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Issue Book</h2>
                <button onClick={() => setShowIssueModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Select Book</label>
                  <select
                    value={issueForm.bookId}
                    onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  >
                    <option value="">Select a book</option>
                    {books.filter(book => book.available > 0).map(book => (
                      <option key={book.id} value={book.id}>{book.title} - Available: {book.available}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Student Roll Number</label>
                  <input
                    type="text"
                    value={issueForm.studentRoll}
                    onChange={(e) => setIssueForm({ ...issueForm, studentRoll: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-grey mb-2">Issue Date</label>
                    <input
                      type="date"
                      value={issueForm.issueDate}
                      onChange={(e) => setIssueForm({ ...issueForm, issueDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-grey mb-2">Due Date</label>
                    <input
                      type="date"
                      value={issueForm.dueDate}
                      onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={issueBook}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Issue Book
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Book Modal */}
        {showEditModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Edit Book</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Book Title</label>
                  <input
                    type="text"
                    value={selectedBook.title}
                    onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Author</label>
                  <input
                    type="text"
                    value={selectedBook.author}
                    onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Available Copies</label>
                  <input
                    type="number"
                    value={selectedBook.available}
                    onChange={(e) => setSelectedBook({ ...selectedBook, available: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Total Copies</label>
                  <input
                    type="number"
                    value={selectedBook.total}
                    onChange={(e) => setSelectedBook({ ...selectedBook, total: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Location</label>
                  <input
                    type="text"
                    value={selectedBook.location}
                    onChange={(e) => setSelectedBook({ ...selectedBook, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedBook}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Book Details</h2>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-3">Book Information</h3>
                  <p><strong>Title:</strong> {selectedBook.title}</p>
                  <p><strong>Author:</strong> {selectedBook.author}</p>
                  <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                  <p><strong>Category:</strong> {selectedBook.category}</p>
                  <p><strong>Location:</strong> {selectedBook.location}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-3">Availability</h3>
                  <p><strong>Available Copies:</strong> {selectedBook.available}</p>
                  <p><strong>Total Copies:</strong> {selectedBook.total}</p>
                  <p><strong>Issued Copies:</strong> {selectedBook.total - selectedBook.available}</p>
                  <p><strong>Status:</strong>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${selectedBook.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {selectedBook.available > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-3">Current Issues</h3>
                <div className="space-y-2">
                  {issuedBooks.filter(issue => issue.bookTitle === selectedBook.title).map((issue, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                      <div>
                        <p className="text-sm font-medium">{issue.student} ({issue.rollNo})</p>
                        <p className="text-xs text-gray-600">Due: {issue.dueDate}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${issue.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {issue.status}
                      </span>
                    </div>
                  ))}
                  {issuedBooks.filter(issue => issue.bookTitle === selectedBook.title).length === 0 && (
                    <p className="text-gray-500 text-sm">No current issues</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryManagement;