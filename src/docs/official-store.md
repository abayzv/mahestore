# Official Store Spec

## Create Official Store API

Endpoint : POST /api/official-store

Request Body :

```json
{
  "name": "Logitech Indonesia",
  "phone": "085259622409",
  "email": "logitech.indonesia@gmail.com",
  "addresses": "Wisma 46 Kota BNI Suite 12.10, Jl. Jend. Sudirman Kav. 1 RT.1/RW.3, Jakarta Pusat, RT.10/RW.11, Karet Tengsin, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10220",
  "picture": "file *png/jpg/jpeg"
}
```

Response Body Success :

```json
{
  "message": "success",
  "data": {
    "_id": "64fb38cf4425ae19e369f79b",
    "name": "Logitech Indonesia",
    "phone": "085259622409",
    "email": "logitech.indonesia@gmail.com",
    "addresses": "Wisma 46 Kota BNI Suite 12.10, Jl. Jend. Sudirman Kav. 1 RT.1/RW.3, Jakarta Pusat, RT.10/RW.11, Karet Tengsin, Kecamatan Tanah Abang, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10220",
    "picture_url": "http://localhost:5000/media/23okdosa.png"
  }
}
```

Response Body Error :

```json
{
  "statusCode": 400,
  "message": "Official Store already exist"
}
```

## Get ALL Official Store API

Endpoint : GET /api/official-store

Response Body Success :

```json
{
  "status": "success",
  "data": [
    {
      "_id": "64fb38cf4425ae19e369f79b",
      "name": "Logitech Indonesia",
      "picture_url": "http://localhost:5000/media/23okdosa_wr2aa.png"
    },
    {
      "_id": "64fb3d8d288c1ac42d01990c",
      "name": "MSI Indonesia",
      "picture_url": "http://localhost:5000/media/sklw023sz_ds32d.png"
    }
  ]
}
```

## Get Official Store Details API

Endpoint : GET /api/official-store/:id

```input
id : 64fb3d8d288c1ac42d01990c
```

Response Body Success:

```json
{
  "status": "success",
  "data": {
    "_id": "64fb3d8d288c1ac42d01990c",
    "name": "MSI Indonesia",
    "picture_url": "http://localhost:5000/media/23okdosa.png",
    "isFollow": 0,
    "follower": 239403,
    "content": [
      {
        "type": "slider",
        "body": [
          "http://localhost:5000/media/as98jsq.png",
          "http://localhost:5000/media/23o0jn4.png"
        ]
      },
      {
        "type": "catalog",
        "body": {
          "title": "Belanja Berdasarkan Kategori",
          "media": [
            {
              "url": "http://localhost:5000/media/m6b9m3.png",
              "path": "/vga"
            },
            {
              "url": "http://localhost:5000/media/349nbty.png",
              "link": "/ram"
            },
            {
              "url": "http://localhost:5000/media/jkl546j.png",
              "link": "/motherboard"
            }
          ]
        }
      },
      {
        "type": "image",
        "body": "http://localhost:5000/media/pajomr3.png"
      }
    ]
  }
}
```

Response Body Error :

```json
{
  "statusCode": 404,
  "message": "Official Store not found"
}
```

## Update Official Store API

Endpoint : PATCH /api/official-store/:id

```input
id : 64fb38cf4425ae19e369f79b
```

Request Body :

- each property is optional, you can change name only or other one

```json
{
  "name": "Logitech Indonesia",
  "phone": "085259622409",
  "email": "logitech.indonesia@gmail.com",
  "addresses": "Jl. Bandung Raya No 51, Bandung",
  "picture_url": "http://localhost:5000/media/23okdosa.png"
}
```

Response Body Success :

```json
{
  "status": "success",
  "data": {
    "_id": "64fb38cf4425ae19e369f79b",
    "name": "Logitech Indonesia",
    "phone": "085259622409",
    "email": "logitech.indonesia@gmail.com",
    "addresses": "Jl. Bandung Raya No 51, Bandung",
    "picture_url": "http://localhost:5000/media/23okdosa.png"
  }
}
```

Response Body Error :

```json
{
  "statusCode": 400,
  "message": "Official Store already exist"
}
```

## Delete Official Store API

Endpoint : DELETE /api/official-store/:id

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

## Follow Official Store

Endpoint : POST /api/official-store/:id

```input
id : 64fb38cf4425ae19e369f79b
```

Request Body :

```json
{
  "isFollow": 1
}
```

Response Body Success :

```json
{
  "message": "Success Following Logitech Indonesia",
  "data": {
    "_id": "64fb38cf4425ae19e369f79b",
    "name": "Logitech Indonesia",
    "picture_url": "http://localhost:5000/media/23okdosa_wr2aa.png",
    "isFollow": 1,
    "follower": 1,
    "content": []
  }
}
```

Response Body Error :

```json
{
  "statusCode": 400,
  "message": "Official Store not found"
}
```
