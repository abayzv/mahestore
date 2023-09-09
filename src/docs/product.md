# Product API Spec

## Create Product API

Endpoint : POST /api/products

Request Body :

```json
{
  "name": "Indomie Goreng Instan 84g",
  "description": "Indomie Goreng Instan 84g",
  "SKU": "123456",
  "price": 3500,
  "category_id": 1,
  "inventory_id": 1,
  "discount_id": 1,
  "tags": ["indomie", "mie instan", "siap saji"]
}
```

Response Body Success :

```json
{
  "message": "success",
  "data": {
    "_id": "64fb38cf4425ae19e369f79b",
    "name": "Indomie Goreng Instan 84g",
    "description": "Indomie Goreng Instan 84g",
    "price": 3500,
    "category": "Makanan",
    "quantity": 5,
    "discount": 5,
    "tags": ["indomie", "mie instan", "siap saji"]
  }
}
```

Response Body Error :

```json
{
  "statusCode": 400,
  "message": "Product already exist"
}
```

## Get ALL Product API

Endpoint : GET /api/products

Response Body Success :

```json
{
  "status": "success",
  "data": [
    {
      "_id": "64fb3ab1362994662a9504ae",
      "name": "Indomie Kuah Kari Ayam 74g",
      "price": 3000,
      "category": "Makanan",
      "quantity": 2,
      "discount": 5
    },
    {
      "_id": "64fb3d8d288c1ac42d01990c",
      "name": "Indomie Rendang 80g",
      "price": 3500,
      "category": "Makanan",
      "quantity": 1,
      "discount": null
    }
  ]
}
```

## Get Product Details API

Endpoint : GET /api/products/:id

```input
id : 64fb3ab1362994662a9504ae
```

Response Body Success:

```json
{
  "status": "success",
  "data": {
    "_id": "64fb3ab1362994662a9504ae",
    "name": "Indomie Kuah Kari Ayam 74g",
    "description": "Indomie Mie Instan rasa Kari ayam",
    "price": 3000,
    "category": "Makanan",
    "price": 3500,
    "quantity": 1,
    "tags": ["mie", "indomie"],
    "official_store": null
  }
}
```

Response Body Error :

```json
{
  "statusCode": 404,
  "message": "Product not found"
}
```

## Update Product API

Endpoint : PATCH /api/products/:id

```input
id : 64fb38cf4425ae19e369f79b
```

Request Body :

```json
{
  "name": "Indomie Rebus Kari Ayam 74g",
  "description": "Indomie Rebus Kari Ayam Instan 74g",
  "price": 3000,
  "tags": ["indomie", "mie instan", "siap saji"],
  "store_id": "64fb3d8d288c1ac42d01990c"
}
```

Response Body Success :

```json
{
  "status": "success",
  "data": {
    "_id": {},
    "name": "Indomie Rebus Kari Ayam 74g",
    "description": "Indomie Rebus Kari Ayam Instan 74g",
    "price": 3000,
    "category": "Makanan",
    "quantity": 2,
    "discount": 5,
    "tags": ["indomie", "mie instan", "siap saji"],
    "official_store": {
      "name": "Logitech Indonesia",
      "picture_url": "http://localhost:5000/media/23okdosa.png"
    }
  }
}
```

Response Body Error :

```json
{
  "statusCode": 400,
  "message": "Product already exist"
}
```

## Delete Product API

Endpoint : DELETE /api/products/:id

```input
id : 64fb38cf4425ae19e369f79b
```

Response Body Success :

```json
{
  "status": "success",
  "data": {}
}
```

## Get Official Store Products

Endpoint : GET /api/products/official-store/:id

```input
id : 64fb38cf4425ae19e369f79b
```

```json
{
  "status": "success",
  "data": [
    {
      "_id": "64fb3ab1362994662a9504ae",
      "name": "Indomie Kuah Kari Ayam 74g",
      "price": 3000,
      "category": "Makanan",
      "quantity": 2,
      "discount": 5
    },
    {
      "_id": "64fb3d8d288c1ac42d01990c",
      "name": "Indomie Rendang 80g",
      "price": 3500,
      "category": "Makanan",
      "quantity": 1,
      "discount": null
    }
  ]
}
```
