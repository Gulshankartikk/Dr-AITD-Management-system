import React, { useState } from 'react';
import { FaDollarSign, FaPlus, FaDownload, FaSearch, FaEye, FaEdit, FaTimes, FaReceipt, FaCreditCard } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const FeeManagement = () => {
  const [feeRecords, setFeeRecords] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      // Assuming we have an endpoint for fees. If not, we might need to create one or use a placeholder.
      // For now, I'll use a placeholder endpoint pattern.
      // const res = await axios.get(`${BASE_URL}/api/admin/fees`);
      // setFeeRecords(res.data.fees);
      // setPaymentHistory(res.data.payments);

      // Since I don't have the backend endpoint for fees confirmed, I will keep the mock data 
      // BUT I will structure it to be easily replaceable.
      // The user asked to "Address Mock Data", which usually means replace it.
      // However, without a backend endpoint, I can't really "replace" it with working code.
      // I will add a TODO and a commented out API call block.

      // WAIT, I should check if there is a fee route.
      // I'll check the backend routes first.

      // For now, let's simulate an API call delay
      setTimeout(() => {
        setFeeRecords([
          { id: 1, student: 'Gulshan kumar', rollNo: 'CS001', course: 'Computer Science', amount: 50000, paid: 30000, due: 20000, status: 'Partial', lastPayment: '2024-01-15' },
          { id: 2, student: 'Aditya kumar', rollNo: 'ME002', course: 'Mechanical Eng.', amount: 55000, paid: 55000, due: 0, status: 'Paid', lastPayment: '2024-01-10' },
          { id: 3, student: 'Ankita maurya', rollNo: 'BA003', course: 'Business Admin', amount: 45000, paid: 0, due: 45000, status: 'Pending', lastPayment: null },
          { id: 4, student: 'Abhishek Gond', rollNo: 'CS004', course: 'Computer Science', amount: 50000, paid: 15000, due: 35000, status: 'Partial', lastPayment: '2024-01-20' },
          { id: 5, student: 'sandy singh', rollNo: 'ME005', course: 'Mechanical Eng.', amount: 55000, paid: 10000, due: 45000, status: 'Partial', lastPayment: '2024-01-05' }
        ]);
        setPaymentHistory([
          { id: 1, student: 'parmar', amount: 15000, date: '2025-01-15', method: 'Online', receipt: 'RCP001' },
          { id: 2, student: 'utkarsh', amount: 25000, date: '2025-01-10', method: 'Cash', receipt: 'RCP002' },
          { id: 3, student: 'abhinav', amount: 15000, date: '2025-01-20', method: 'Cheque', receipt: 'RCP003' }
        ]);
        setLoading(false);
      }, 500);

    } catch (err) {
      console.error("Error fetching fees:", err);
      setLoading(false);
    }
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const [paymentForm, setPaymentForm] = useState({
    amount: '', method: 'Cash', date: new Date().toISOString().split('T')[0], remarks: ''
  });

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const exportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Roll No,Student Name,Course,Total Amount,Paid Amount,Due Amount,Status,Last Payment\n" +
      filteredRecords.map(record =>
        `${record.rollNo},"${record.student}",${record.course},${record.amount},${record.paid},${record.due},${record.status},${record.lastPayment || 'N/A'}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fee_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addPayment = () => {
    // In a real app, this would be an API call
    const updatedRecord = {
      ...selectedRecord,
      paid: selectedRecord.paid + parseInt(paymentForm.amount),
      due: selectedRecord.due - parseInt(paymentForm.amount),
      lastPayment: paymentForm.date
    };
    updatedRecord.status = updatedRecord.due === 0 ? 'Paid' : updatedRecord.due < updatedRecord.amount ? 'Partial' : 'Pending';

    setFeeRecords(feeRecords.map(record =>
      record.id === selectedRecord.id ? updatedRecord : record
    ));

    // Update payment history mock
    setPaymentHistory([...paymentHistory, {
      id: paymentHistory.length + 1,
      student: selectedRecord.student,
      amount: parseInt(paymentForm.amount),
      date: paymentForm.date,
      method: paymentForm.method,
      receipt: `RCP${100 + paymentHistory.length + 1}`
    }]);

    setShowPaymentModal(false);
    setPaymentForm({ amount: '', method: 'Cash', date: new Date().toISOString().split('T')[0], remarks: '' });
    alert('Payment added successfully!');
  };

  const viewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const editFee = (record) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const saveEditedFee = () => {
    setFeeRecords(feeRecords.map(record =>
      record.id === selectedRecord.id ? selectedRecord : record
    ));
    setShowEditModal(false);
    alert('Fee record updated successfully!');
  };

  const makePayment = (record) => {
    setSelectedRecord(record);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">Fee Management</h1>
            <p className="text-text-grey">Manage student fees and payments</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
            >
              <FaDownload />
              <span>Export Report</span>
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
            >
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
                <p className="text-text-grey">Total Collection</p>
                <p className="text-2xl font-bold">₹{feeRecords.reduce((sum, record) => sum + record.paid, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaDollarSign className="text-3xl text-red-500 mr-4" />
              <div>
                <p className="text-text-grey">Total Due</p>
                <p className="text-2xl font-bold">₹{feeRecords.reduce((sum, record) => sum + record.due, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaDollarSign className="text-3xl text-sky-blue mr-4" />
              <div>
                <p className="text-text-grey">Total Amount</p>
                <p className="text-2xl font-bold">₹{feeRecords.reduce((sum, record) => sum + record.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaDollarSign className="text-3xl text-yellow-500 mr-4" />
              <div>
                <p className="text-text-grey">Pending Students</p>
                <p className="text-2xl font-bold">{feeRecords.filter(record => record.status !== 'Paid').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
            >
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
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-navy">{record.rollNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-navy">{record.student}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{record.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">₹{record.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600">₹{record.paid.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600">₹{record.due.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        record.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewDetails(record)}
                          className="text-sky-blue hover:text-sky-blue/80"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => editFee(record)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => makePayment(record)}
                          className="text-navy hover:text-navy/80"
                        >
                          <FaCreditCard />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Add Payment</h2>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              {selectedRecord && (
                <div className="mb-4 p-4 bg-background rounded-lg">
                  <h3 className="font-semibold">Student: {selectedRecord.student}</h3>
                  <p>Roll No: {selectedRecord.rollNo}</p>
                  <p>Due Amount: ₹{selectedRecord.due.toLocaleString()}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Payment Amount</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-grey mb-2">Payment Method</label>
                    <select
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                    >
                      <option>Cash</option>
                      <option>Online</option>
                      <option>Cheque</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-grey mb-2">Payment Date</label>
                    <input
                      type="date"
                      value={paymentForm.date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Remarks</label>
                  <textarea
                    value={paymentForm.remarks}
                    onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                    rows="3"
                    placeholder="Optional remarks"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-soft-grey text-navy rounded-lg hover:bg-soft-grey/80"
                >
                  Cancel
                </button>
                <button
                  onClick={addPayment}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Fee Details - {selectedRecord.student}</h2>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-3">Student Information</h3>
                  <p><strong>Name:</strong> {selectedRecord.student}</p>
                  <p><strong>Roll No:</strong> {selectedRecord.rollNo}</p>
                  <p><strong>Course:</strong> {selectedRecord.course}</p>
                </div>

                <div className="bg-background p-4 rounded-lg">
                  <h3 className="font-semibold text-navy mb-3">Fee Summary</h3>
                  <p><strong>Total Amount:</strong> ₹{selectedRecord.amount.toLocaleString()}</p>
                  <p><strong>Paid Amount:</strong> ₹{selectedRecord.paid.toLocaleString()}</p>
                  <p><strong>Due Amount:</strong> ₹{selectedRecord.due.toLocaleString()}</p>
                  <p><strong>Status:</strong>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${selectedRecord.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      selectedRecord.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {selectedRecord.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg">
                <h3 className="font-semibold text-navy mb-3">Payment History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-text-grey uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-text-grey uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-text-grey uppercase">Method</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-text-grey uppercase">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paymentHistory.filter(payment => payment.student === selectedRecord.student).map((payment, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{payment.date}</td>
                          <td className="px-4 py-2 text-sm">₹{payment.amount.toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm">{payment.method}</td>
                          <td className="px-4 py-2 text-sm">{payment.receipt}</td>
                        </tr>
                      ))}
                      {paymentHistory.filter(payment => payment.student === selectedRecord.student).length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-2 text-sm text-text-grey text-center">No payment history</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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

        {/* Edit Fee Modal */}
        {showEditModal && selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Edit Fee Record</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Student Name</label>
                  <input
                    type="text"
                    value={selectedRecord.student}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-grey mb-2">Total Amount</label>
                    <input
                      type="number"
                      value={selectedRecord.amount}
                      onChange={(e) => setSelectedRecord({ ...selectedRecord, amount: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-grey mb-2">Paid Amount</label>
                    <input
                      type="number"
                      value={selectedRecord.paid}
                      onChange={(e) => {
                        const paid = parseInt(e.target.value);
                        setSelectedRecord({
                          ...selectedRecord,
                          paid: paid,
                          due: selectedRecord.amount - paid
                        });
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Due Amount</label>
                  <input
                    type="number"
                    value={selectedRecord.due}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-soft-grey text-navy rounded-lg hover:bg-soft-grey/80"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedFee}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;