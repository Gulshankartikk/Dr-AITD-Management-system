import React, { useState } from 'react';
import { FaBookOpen, FaPlus, FaSearch, FaEdit, FaTrash, FaDownload, FaEye, FaTimes, FaCheck, FaBook, FaUser } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

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
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton className="mb-4" />
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary font-heading">Library Management</h1>
              <p className="text-text-secondary">Manage books and library resources</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={exportReport}
                className="flex items-center space-x-2"
              >
                <FaDownload />
                <span>Export Report</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowIssueModal(true)}
                className="flex items-center space-x-2"
              >
                <FaBookOpen />
                <span>Issue Book</span>
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Book</span>
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <FaBookOpen className="text-3xl text-primary mr-4" />
                <div>
                  <p className="text-text-secondary">Total Books</p>
                  <p className="text-2xl font-bold text-secondary">{books.reduce((sum, book) => sum + book.total, 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <FaBookOpen className="text-3xl text-success mr-4" />
                <div>
                  <p className="text-text-secondary">Available</p>
                  <p className="text-2xl font-bold text-secondary">{books.reduce((sum, book) => sum + book.available, 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <FaBookOpen className="text-3xl text-warning mr-4" />
                <div>
                  <p className="text-text-secondary">Issued</p>
                  <p className="text-2xl font-bold text-secondary">{books.reduce((sum, book) => sum + (book.total - book.available), 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <FaBookOpen className="text-3xl text-danger mr-4" />
                <div>
                  <p className="text-text-secondary">Overdue</p>
                  <p className="text-2xl font-bold text-secondary">{issuedBooks.filter(book => book.status === 'Overdue').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All Categories</option>
                <option>Computer Science</option>
                <option>Mechanical</option>
                <option>Business</option>
                <option>Mathematics</option>
                <option>Physics</option>
              </Select>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>All Status</option>
                <option>Available</option>
                <option>Out of Stock</option>
              </Select>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Book Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">ISBN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Available</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaBookOpen className="text-primary mr-3" />
                          <span className="font-medium text-secondary">{book.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary">{book.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary">{book.isbn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary">{book.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-medium ${book.available > 0 ? 'text-success' : 'text-danger'}`}>
                          {book.available}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary">{book.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary">{book.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewDetails(book)}
                            className="text-primary hover:text-primary/80"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => editBook(book)}
                            className="text-success hover:text-success/80"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteBook(book.id)}
                            className="text-danger hover:text-danger/80"
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
            <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-secondary font-heading">Add New Book</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-text-secondary hover:text-secondary">
                    <FaTimes size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Book Title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  />
                  <Input
                    label="Author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  />
                  <Input
                    label="ISBN"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  />
                  <Select
                    label="Category"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option>Computer Science</option>
                    <option>Mechanical</option>
                    <option>Business</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                  </Select>
                  <Input
                    label="Total Copies"
                    type="number"
                    value={newBook.total}
                    onChange={(e) => setNewBook({ ...newBook, total: parseInt(e.target.value) })}
                  />
                  <Input
                    label="Location"
                    value={newBook.location}
                    onChange={(e) => setNewBook({ ...newBook, location: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addBook}
                  >
                    Add Book
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Issue Book Modal */}
          {showIssueModal && (
            <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-secondary font-heading">Issue Book</h2>
                  <button onClick={() => setShowIssueModal(false)} className="text-text-secondary hover:text-secondary">
                    <FaTimes size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <Select
                    label="Select Book"
                    value={issueForm.bookId}
                    onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                  >
                    <option value="">Select a book</option>
                    {books.filter(book => book.available > 0).map(book => (
                      <option key={book.id} value={book.id}>{book.title} - Available: {book.available}</option>
                    ))}
                  </Select>
                  <Input
                    label="Student Roll Number"
                    value={issueForm.studentRoll}
                    onChange={(e) => setIssueForm({ ...issueForm, studentRoll: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Issue Date"
                      type="date"
                      value={issueForm.issueDate}
                      onChange={(e) => setIssueForm({ ...issueForm, issueDate: e.target.value })}
                    />
                    <Input
                      label="Due Date"
                      type="date"
                      value={issueForm.dueDate}
                      onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setShowIssueModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={issueBook}
                  >
                    Issue Book
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Book Modal */}
          {showEditModal && selectedBook && (
            <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-secondary font-heading">Edit Book</h2>
                  <button onClick={() => setShowEditModal(false)} className="text-text-secondary hover:text-secondary">
                    <FaTimes size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Book Title"
                    value={selectedBook.title}
                    onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                  />
                  <Input
                    label="Author"
                    value={selectedBook.author}
                    onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                  />
                  <Input
                    label="Available Copies"
                    type="number"
                    value={selectedBook.available}
                    onChange={(e) => setSelectedBook({ ...selectedBook, available: parseInt(e.target.value) })}
                  />
                  <Input
                    label="Total Copies"
                    type="number"
                    value={selectedBook.total}
                    onChange={(e) => setSelectedBook({ ...selectedBook, total: parseInt(e.target.value) })}
                  />
                  <Input
                    label="Location"
                    value={selectedBook.location}
                    onChange={(e) => setSelectedBook({ ...selectedBook, location: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveEditedBook}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* View Details Modal */}
          {showDetailsModal && selectedBook && (
            <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-secondary font-heading">Book Details</h2>
                  <button onClick={() => setShowDetailsModal(false)} className="text-text-secondary hover:text-secondary">
                    <FaTimes size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-secondary mb-3">Book Information</h3>
                    <p className="text-text-secondary"><strong>Title:</strong> {selectedBook.title}</p>
                    <p className="text-text-secondary"><strong>Author:</strong> {selectedBook.author}</p>
                    <p className="text-text-secondary"><strong>ISBN:</strong> {selectedBook.isbn}</p>
                    <p className="text-text-secondary"><strong>Category:</strong> {selectedBook.category}</p>
                    <p className="text-text-secondary"><strong>Location:</strong> {selectedBook.location}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-secondary mb-3">Availability</h3>
                    <p className="text-text-secondary"><strong>Available Copies:</strong> {selectedBook.available}</p>
                    <p className="text-text-secondary"><strong>Total Copies:</strong> {selectedBook.total}</p>
                    <p className="text-text-secondary"><strong>Issued Copies:</strong> {selectedBook.total - selectedBook.available}</p>
                    <p className="text-text-secondary"><strong>Status:</strong>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${selectedBook.available > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {selectedBook.available > 0 ? 'Available' : 'Out of Stock'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-secondary mb-3">Current Issues</h3>
                  <div className="space-y-2">
                    {issuedBooks.filter(issue => issue.bookTitle === selectedBook.title).map((issue, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-secondary">{issue.student} ({issue.rollNo})</p>
                          <p className="text-xs text-text-muted">Due: {issue.dueDate}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${issue.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {issue.status}
                        </span>
                      </div>
                    ))}
                    {issuedBooks.filter(issue => issue.bookTitle === selectedBook.title).length === 0 && (
                      <p className="text-text-muted text-sm">No current issues</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryManagement;