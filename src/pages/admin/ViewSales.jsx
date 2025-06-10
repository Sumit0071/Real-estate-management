import { useState, useEffect } from 'react';

const ViewSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API call to fetch sales data
    // const fetchSales = async () => {
    //   try {
    //     const response = await adminAPI.getSales();
    //     setSales(response.data);
    //   } catch (error) {
    //     console.error('Error fetching sales:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchSales();

    // Temporary placeholder
    setSales([]);
    setLoading(false);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalRevenue = sales.reduce((total, sale) => total + sale.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <a href="/admin/dashboard" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Dashboard
            </a>
            <a href="/admin/properties" className="block px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Manage Properties
            </a>
            <a href="/admin/sales" className="block px-6 py-3 text-gray-900 bg-primary-50 border-r-2 border-primary-600">
              View Sales
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sales Overview</h1>
            <p className="text-gray-600 mt-2">Track all property sales and transactions</p>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : sales.length}
                </div>
                <div className="text-gray-600">Total Sales</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {loading ? '...' : formatPrice(totalRevenue)}
                </div>
                <div className="text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {loading ? '...' : (sales.length > 0 ? formatPrice(totalRevenue / sales.length) : '$0')}
                </div>
                <div className="text-gray-600">Average Sale</div>
              </div>
            </div>
          </div>

          {/* Sales Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Transactions</h2>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading sales data...</p>
              </div>
            ) : sales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property Sold
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.propertyTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sale.buyerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.buyerEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(sale.purchaseDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatPrice(sale.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No sales recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSales;