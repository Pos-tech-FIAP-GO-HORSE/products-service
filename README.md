# Products Microservice

## Description

This is a microservice for managing products.

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [Test Coverage](#test-coverage)
- [Swagger](#swagger)
- [Maintainers](#maintainers)

## Technologies

- Node.js
- TypeScript
- Express
- Prisma
- MySQL
- Docker
- Swagger

<details>
<summary>Installation</summary>

### Prerequisites

- Node.js (v22+)
- MySQL installed and running
- Docker

### Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```
DATABASE_URL=mysql://root:admin123@localhost:3306/product
PORT=3000
```

Replace the database credentials (root, admin123, etc.) with your MySQL setup.

### Running the Project

Install the dependencies:

```
npm install
```

#### Development Mode

Start the application with auto-reload for development:

```
npm run dev
```

#### Production Mode

Build the application:

```
npm run build
```

Start the compiled application:

```
npm start
```

#### With Docker

Build and run the Docker container:

```
docker-compose up -d
```

#### Testing

Run unit tests with:

```
npm run test
```

### Using Prisma

#### What is Prisma?

Prisma is used as the ORM (Object-Relational Mapper) for this microservice. It simplifies database schema management and provides type-safe queries.

#### Setting Up Prisma

Generate Prisma Client:
After modifying the prisma/schema.prisma file, generate the Prisma client:

```
npx prisma generate
```

#### Run Migrations:

To apply schema changes to your MySQL database, use Prisma migrations:

```
npx prisma migrate dev --name <migration_name>
```

Replace <migration_name> with a descriptive name for the migration.

This will:

- Create a new migration file in prisma/migrations/.
- Apply the migration to your database.

#### View and Manage the Database:

We can use Prisma Studio to explore and edit the database:

```
npx prisma studio
```

</details>

## Test Coverage

80% of the code is covered by tests.

![Test Coverage](./coverage-report.png)

### Swagger

The Swagger is available on the path `/api-docs`.

## Maintainers

| Member                        | Info     |
| ----------------------------- | -------- |
| Caio Martins Pereira          | RM357712 |
| Rafael de Souza Ribeiro       | RM357622 |
| Thaís Oliveira de Moura       | RM357737 |
| Victor Toschi                 | RM356847 |