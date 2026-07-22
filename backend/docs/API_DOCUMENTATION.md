# Taste of Heaven - API Documentation

## Base URL
`http://localhost:5000/api/v1`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Create a new user account.
- **Request Body**:
  ```json
  {
    "name": "Lady Victoria",
    "email": "victoria@domain.com",
    "password": "secretpassword123"
  }
  ```
- **Response**: `201 Created` with JWT `token` and `user` object.

### `POST /auth/login`
Authenticate user or admin.
- **Default Admin Credentials**:
  - **Email**: `admin@tasteofheaven.com`
  - **Password**: `admin123`
- **Response**: `200 OK` with JWT `token`.

### `GET /auth/profile` *(Protected)*
Fetch authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`

---

## 2. Menu Endpoints

### `GET /menu`
Fetch all menu items with optional query filters.
- **Query Parameters**:
  - `category`: `starters`, `mains`, `specials`, `desserts`, `cocktails`
  - `search`: term string (e.g. `wagyu`)
  - `veg`: `true` | `false`
  - `popular`: `true` | `false`
  - `sort`: `price_asc` | `price_desc` | `rating`

### `POST /menu` *(Admin Only)*
Create a new gourmet dish.
- **Headers**: `Authorization: Bearer <admin_token>`

### `PUT /menu/:id` *(Admin Only)*
Update an existing dish.

### `DELETE /menu/:id` *(Admin Only)*
Delete a dish.

---

## 3. Reservation Endpoints

### `POST /reservations`
Create a new table reservation.
- **Request Body**:
  ```json
  {
    "guestName": "Lord Vance",
    "guestEmail": "vance@domain.com",
    "guestPhone": "+1 (555) 888-9999",
    "guestsCount": 2,
    "reservationDate": "2026-08-01",
    "reservationTime": "19:00",
    "tableAtmosphere": "Metropolis Skyline View",
    "specialNotes": "Anniversary dinner"
  }
  ```

### `GET /reservations` *(Admin & Staff Only)*
Fetch all reservations with status filter.

---

## 4. Online Order Endpoints

### `POST /orders`
Create an online food order.
- **Request Body**:
  ```json
  {
    "customerName": "Sophia Chen",
    "customerEmail": "sophia@domain.com",
    "customerPhone": "+1 (555) 000-1111",
    "orderType": "delivery",
    "items": [
      { "id": 1, "title": "A5 Miyazaki Wagyu Tenderloin", "price": 185.00, "qty": 1 }
    ]
  }
  ```

---

## 5. Admin Dashboard

### `GET /admin/stats` *(Admin Only)*
Get real-time dashboard analytics (Total Revenue, Active Reservations, Pending Orders, Users).
