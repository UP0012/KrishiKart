# KrishiKart Backend

Backend API for the B2B Online Farmers Marketplace.

## Folder Structure

```text
backend/
  package.json
  .env.example
  src/
    app.js
    server.js
    config/db.js
    controllers/
      authController.js
      productController.js
      orderController.js
      adminController.js
    middleware/
      authMiddleware.js
      errorMiddleware.js
      roleMiddleware.js
    models/
      User.js
      Product.js
      Order.js
    routes/
      authRoutes.js
      productRoutes.js
      orderRoutes.js
      adminRoutes.js
    utils/
      asyncHandler.js
      generateToken.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Update `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` in `.env`.

4. Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Required Frontend Field Names

The backend accepts and returns the frontend field names exactly:

- User: `name`, `email`, `password`, `role`, `phone`, `address`
- Product: `name`, `description`, `price`, `quantity`, `category`, `image`
- Order: `products`, `totalAmount`, `status`

Server-owned reference fields are added without renaming frontend fields:

- Product: `farmer`
- Order: `buyer`

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products`
- `POST /api/products` farmer/admin
- `PUT /api/products/:id` owner farmer/admin
- `DELETE /api/products/:id` owner farmer/admin

### Orders

- `POST /api/orders` buyer/admin
- `GET /api/orders` farmer/buyer/admin scoped by role

### Admin

- `GET /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/products`
- `DELETE /api/admin/products/:id`

## Auth Header

Protected routes require:

```text
Authorization: Bearer <token>
```
