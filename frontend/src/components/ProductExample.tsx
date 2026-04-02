'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setCurrentProduct,
  clearError,
  reset,
  type Product,
} from '@/store/slices/product';

export default function ProductExample() {
  const dispatch = useAppDispatch();
  const { products, loading, error, currentProduct } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Fetch products on component mount
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCreateProduct = () => {
    dispatch(createProduct({
      name: 'New Product',
      description: 'A great new product',
      price: 29.99,
      category: 'electronics',
      stock: 100,
      status: 'active',
    }));
  };

  const handleUpdateProduct = (id: string) => {
    dispatch(updateProduct({
      id,
      product: { price: 39.99 },
    }));
  };

  const handleDeleteProduct = (id: string) => {
    dispatch(deleteProduct(id));
  };

  const handleSelectProduct = (product: Product) => {
    dispatch(setCurrentProduct(product));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleReset = () => {
    dispatch(reset());
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error} <button onClick={handleClearError}>Clear</button></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      
      <div className="mb-4 space-x-2">
        <button
          onClick={handleCreateProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset State
        </button>
      </div>

      {currentProduct && (
        <div className="mb-4 p-4 bg-yellow-100 border rounded">
          <h3 className="font-semibold">Selected Product:</h3>
          <p>{currentProduct.name} - ${currentProduct.price}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold">${product.price}</p>
            <p className="text-sm">Category: {product.category}</p>
            <p className="text-sm">Stock: {product.stock}</p>
            <p className="text-sm">Status: {product.status}</p>
            
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleSelectProduct(product)}
                className="bg-green-500 text-white px-2 py-1 rounded text-sm"
              >
                Select
              </button>
              <button
                onClick={() => handleUpdateProduct(product.id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
              >
                Update Price
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
