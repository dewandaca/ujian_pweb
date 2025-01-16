import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WelcomingPage = () => {
  const [stockList, setStockList] = useState([]);
  const [newStock, setNewStock] = useState({ name: '', quantity: '' });
  const [editingStock, setEditingStock] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Untuk fitur pencarian
  const [existingStock, setExistingStock] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedStockToDelete, setSelectedStockToDelete] = useState(null);

  const apiUrl = 'http://localhost/data_ujian/api.php';

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(apiUrl);
      setStockList(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();

    if (!editingStock) {
      const existingItem = stockList.find(
        (item) => item.name.toLowerCase() === newStock.name.toLowerCase()
      );

      if (existingItem) {
        setExistingStock(existingItem);
        setMessage(`Stok "${existingItem.name}" sudah ada.`);
        return;
      }
    }

    if (newStock.name && newStock.quantity) {
      try {
        if (editingStock) {
          await axios.put(apiUrl, {
            id: editingStock.id,
            quantity: parseInt(newStock.quantity),
            name: newStock.name,
          });
          setMessage('Stok berhasil diperbarui!');
        } else {
          await axios.post(apiUrl, {
            name: newStock.name,
            quantity: parseInt(newStock.quantity),
          });
          setMessage('Stok berhasil ditambahkan!');
        }
        fetchStocks();
        setNewStock({ name: '', quantity: '' });
        setEditingStock(null);
        setExistingStock(null);
      } catch (error) {
        console.error('Error adding/updating stock:', error);
      }
    }
  };

  const handleDeleteStock = async () => {
    try {
      await axios.delete(apiUrl, { data: { id: selectedStockToDelete.id } });
      setMessage('Stok berhasil dihapus!');
      fetchStocks();
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  };

  const handleEditStock = (item) => {
    setNewStock({ name: item.name, quantity: item.quantity.toString() });
    setEditingStock(item);
    setMessage('Anda sedang mengedit stok ini.');
    setExistingStock(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock((prev) => ({ ...prev, [name]: value }));
    setMessage('');
    setExistingStock(null);
  };

  const openDeleteConfirmation = (item) => {
    setSelectedStockToDelete(item);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setSelectedStockToDelete(null);
  };

  const filteredStocks = stockList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 text-white font-sans">
      <div className="max-w-6xl w-full p-6 bg-white shadow-lg rounded-lg flex">
        <div className="w-full sm:w-1/2 p-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Selamat Datang di Aplikasi Pakan Ternak
          </h1>
          <p className="text-lg text-center text-gray-700 mb-8">
            Kelola stok pakan ternak Anda dengan mudah dan efisien.
          </p>
          {message && (
            <div className="bg-yellow-300 text-black p-4 rounded-md mb-6">
              <p>{message}</p>
            </div>
          )}
          {existingStock && (
            <div className="bg-red-300 text-black p-4 rounded-md mb-6">
              <p>
                Stok "<strong>{existingStock.name}</strong>" sudah ada dengan jumlah{' '}
                <strong>{existingStock.quantity}</strong>. Ingin mengedit?
              </p>
              <button
                onClick={() => handleEditStock(existingStock)}
                className="mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md focus:outline-none"
              >
                Edit Stok
              </button>
            </div>
          )}
          <form onSubmit={handleAddStock} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Pakan
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={newStock.name}
                onChange={handleInputChange}
                placeholder="Nama Pakan"
                className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Jumlah Stok
              </label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={newStock.quantity}
                onChange={handleInputChange}
                placeholder="Jumlah Stok"
                className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {editingStock ? 'Simpan Perubahan' : 'Tambah Stok'}
            </button>
          </form>
        </div>
        <div className="w-full sm:w-1/2 p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar Stok Pakan Ternak</h2>
          <input
            type="text"
            placeholder="Cari pakan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md focus:ring-2 focus:ring-indigo-500 text-black"
          />
          {filteredStocks.length === 0 ? (
            <p className="text-center text-gray-600">Tidak ada data yang cocok.</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <ul className="space-y-4">
                {filteredStocks.map((item) => (
                  <li
                    key={item.id}
                    className={`bg-gray-50 p-4 rounded-lg shadow-lg flex justify-between items-center hover:bg-gray-100 transition-all ${
                      item.quantity < 5 ? 'border-l-4 border-red-600' : ''
                    }`}
                  >
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                      <p className="text-gray-600">
                        Stok: {item.quantity} unit{' '}
                        {item.quantity < 5 && (
                          <span className="text-red-600 font-bold">(Stok Sedikit)</span>
                        )}
                      </p>
                    </div>
                    <div className="ml-4 flex space-x-4">
                      <button
                        onClick={() => handleEditStock(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteConfirmation(item)}
                        className="text-red-600 hover:text-red-800 font-medium focus:outline-none"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Konfirmasi Hapus Stok</h3>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus stok "<strong>{selectedStockToDelete?.name}</strong>"?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleDeleteStock}
                className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Hapus
              </button>
              <button
                onClick={closeDeleteConfirmation}
                className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomingPage;
