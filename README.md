# Appointment Booking Service

## Setup & Installation

### Prerequisites
- Docker
- Docker Compose

### Quick Start
1. Clone the Repository
```bash
git clone https://github.com/nedhle/appointment-booking-service
cd appointment-booking-service
```

2. Start the Application
```bash
docker-compose up --build
```

3. Access Services
- **API**: http://localhost:3000


4. Stop the Application
```bash
docker-compose down
```

### Additional Docker Commands
- Rebuild and start: `docker-compose up --build`
- Remove volumes: `docker-compose down -v`
- Run database migrations: `docker-compose exec app npx prisma migrate deploy`

## Design Choices

### Technology Stack
- **Language**: TypeScript
- **Backend Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Containerization**: Docker

### Architecture Decisions

#### Framework Selection
- **NestJS**: Chosen for its:
  - Modular architecture
  - Dependency injection
  - Strong typing with TypeScript
  - Scalable microservices support

#### Database Design
- **Prisma ORM**: 
  - Type-safe database client
  - Automatic migrations
  - Easy schema management
  - Performance optimization

#### Concurrency Control
- **Prisma Transactions**: Atomic database operations
- **Optimistic Locking**: Prevent race conditions in appointment scheduling
- **Event-Driven Architecture**: Asynchronous processing of non-critical tasks

### Horizontal Scaling
- Stateless service design
- Containerized architecture
- Support for horizontal scaling
- Efficient database indexing

### Performance Optimizations
- Caching mechanisms
- Efficient database querying
- Pagination for large datasets
- Asynchronous event processing

### Potential Bottlenecks
- Implement read replicas
- Use message queues for high-load scenarios
- Add distributed caching layer

## Tradeoffs
- Chose type safety over rapid development
- Prioritized maintainability over minimal initial complexity
- Selected modular architecture for future extensibility

## License
MIT License
