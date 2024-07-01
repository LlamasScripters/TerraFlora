# challenge-template

## Requirements

- Docker
- Docker Compose

## Usage
- Adminer : http://localhost:8080/
  - db : app
  - user : root
  - password : password
  - server : postgres 
  - system : PostgreSQL

- Front : http://localhost:5173/

- Back : http://localhost:8000/

### Development

- Install & Build
```bash
make build
```

- Run containers
```bash
make start
```

- Kill and remove volumes
```bash
make kill
```

- Import test data to postgres
```bash
make db-import
```

- Sync Mongo
```bash
make db-sync-mongo
```

- Test search product API : http://localhost:8000/produits?search=test


### Production

TODO
