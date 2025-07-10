# ShowSnap 🎬

A modern movie ticket booking application built with React, Express.js, and Clerk authentication.

## Features

- **Movie Ticket Booking** - Browse and book movie tickets
- **Secure Authentication** - Powered by Clerk
- **Responsive Design** - Works on all devices
- **Movie Details** - Trailers, ratings, and showtimes
- **Seat Selection** - Interactive seat layout
- **Email Notifications** - Booking confirmations
- **Payment Integration** - Stripe payment processing
- **Admin Panel** - Manage shows and bookings

## Tech Stack

### Frontend

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Clerk** - Authentication
- **React Hot Toast** - Notifications

### Backend

- **Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Clerk** - Authentication & webhooks

## Project Structure

```
ShowSnap/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── lib/           # Utility functions
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── configs/          # Configuration files
│   └── routes/           # API routes
└── README.md
```


**Configure Clerk Webhooks**
   - Go to your Clerk Dashboard
   - Navigate to Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`

## API Endpoints

### Authentication

- `POST /api/webhooks/clerk` - Clerk webhook for user sync

### Movies & Shows

- `GET /api/show` - Get all shows
- `POST /api/show` - Create new show
- `PUT /api/show/:id` - Update show
- `DELETE /api/show/:id` - Delete show

### Bookings

- `GET /api/booking` - Get user bookings
- `POST /api/booking` - Create booking
- `PUT /api/booking/:id` - Update booking

### Admin

- `GET /api/admin/shows` - Admin: Get all shows
- `GET /api/admin/bookings` - Admin: Get all bookings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- [Clerk](https://clerk.com/) for authentication
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the frontend framework
