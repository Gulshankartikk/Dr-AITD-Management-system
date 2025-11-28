import React from 'react';

export const Table = ({ children, className = '' }) => (
  <div className={`w-full overflow-x-auto rounded-xl border border-gray-200 ${className}`}>
    <table className="w-full text-left text-sm">
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className = '' }) => (
  <thead className={`bg-gray-50 border-b border-gray-200 text-gray-500 font-medium uppercase tracking-wider ${className}`}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-gray-200 bg-white ${className}`}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '', onClick }) => (
  <tr
    className={`hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className = '' }) => (
  <th className={`px-6 py-3 font-medium ${className}`}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-gray-700 ${className}`}>
    {children}
  </td>
);

export default Table;