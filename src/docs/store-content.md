# Store Content Spec

## Create Store Spec API

Endpoint : POST /api/store-content

### Request Body Schema :

### Slider

```json
{
  "store_id": "63n9nfs9fn4nbisndfksv",
  "type": "slider",
  "body": {
    "media": [
      {
        "url": "http://localhost:5000/media/m6b9m3.png",
        "path": "/vga"
      }
    ]
  }
}
```

### Catalog

```json
{
  "store_id": "63n9nfs9fn4nbisndfksv",
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
}
```

### Image

```json
{
  "store_id": "63n9nfs9fn4nbisndfksv",
  "type": "image",
  "body": {
    "media": [
      {
        "url": "http://localhost:5000/media/m6b9m3.png",
        "path": "/vga"
      }
    ]
  }
}
```
