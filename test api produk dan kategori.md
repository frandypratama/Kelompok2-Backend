@baseUrl = http://localhost:3000/api

### 1. Get All Categories
GET {{baseUrl}}/categories

### 2. Get All Products
GET {{baseUrl}}/products

### 3. Get Products by Category / Sub / Sub-Sub Category
GET {{baseUrl}}/products?category_id=11

### 4. Get Product by ID
GET {{baseUrl}}/products/1

### 5. Create Product (Tambah Produk)
POST {{baseUrl}}/products
Content-Type: application/json

{
    "product_name": "Telkomsel Paket Data 10 GB",
    "purchase_price": 25000,
    "selling_price": 30000,
    "stock": 50,
    "category_id": 11
}

### 6. Update Product (Ubah Produk)
PUT {{baseUrl}}/products/1
Content-Type: application/json

{
    "selling_price": 32000,
    "stock": 45
}

### 7. Delete Product (Hapus Produk)
DELETE {{baseUrl}}/products/1