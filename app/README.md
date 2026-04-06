# 🏠 RentEase - Multi-Tenant Property Management Platform

A comprehensive rental property management application with separate dashboards for landlords and tenants. Built with React, TypeScript, and Tailwind CSS.

![RentEase Dashboard](https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200)

## ✨ Features

### 🔐 Authentication & User Management
- **Role-based access control** - Separate experiences for landlords and tenants
- **Secure login/signup** with email and password
- **Multi-step onboarding** flow for both user types
- **Session persistence** using localStorage

### 👨‍💼 Landlord Dashboard
- **Dashboard Overview** - Occupancy rates, revenue analytics, property status
- **Property Management** - Add, edit, and track properties with images
- **Tenant Management** - View tenant details, lease information, contact info
- **Payment Tracking** - Monitor rent payments, overdue amounts, collection rates
- **Maintenance Requests** - Track and manage property maintenance issues
- **Lease Management** - Create and manage rental agreements

### 🏠 Tenant Dashboard
- **Personal Overview** - Current property, lease progress, payment status
- **Online Rent Payment** - View balance and payment history
- **Maintenance Requests** - Submit and track repair requests
- **Document Access** - View lease agreements and important documents
- **Announcements** - Receive updates from landlord

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Routing:** React Router DOM

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/rentease.git
   cd rentease
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Landlord | `landlord@demo.com` | `demo` |
| Tenant | `tenant@demo.com` | `demo` |

## 📁 Project Structure

```
rentease/
├── src/
│   ├── components/ui/        # shadcn/ui components
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication state management
│   ├── data/
│   │   └── mockData.ts       # Mock data for demo
│   ├── pages/
│   │   ├── Login.tsx         # Login page
│   │   ├── Signup.tsx        # Signup with role selection
│   │   ├── Onboarding.tsx    # User onboarding flow
│   │   ├── landlord/
│   │   │   └── LandlordDashboard.tsx
│   │   └── tenant/
│   │       └── TenantDashboard.tsx
│   ├── sections/
│   │   ├── Dashboard.tsx     # Landlord dashboard sections
│   │   ├── Properties.tsx
│   │   ├── Tenants.tsx
│   │   ├── Payments.tsx
│   │   ├── Maintenance.tsx
│   │   └── Leases.tsx
│   ├── types/
│   │   ├── index.ts          # Main types
│   │   └── auth.ts           # Authentication types
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration (for future backend integration)
VITE_API_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=RentEase
VITE_APP_VERSION=1.0.0
```

## 🎯 Roadmap

### Phase 1 - Core Features (Current)
- [x] Authentication system
- [x] Landlord dashboard
- [x] Tenant dashboard
- [x] Property management
- [x] Payment tracking
- [x] Maintenance requests

### Phase 2 - Backend Integration
- [ ] RESTful API with Node.js/Express
- [ ] Database (PostgreSQL/MongoDB)
- [ ] Real-time notifications
- [ ] File uploads for documents
- [ ] Email notifications

### Phase 3 - Advanced Features
- [ ] Online payment processing (Stripe)
- [ ] Mobile app (React Native)
- [ ] Document e-signing
- [ ] AI-powered rent recommendations
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide Icons](https://lucide.dev/) for beautiful icons

---

Made with ❤️ by the RentEase Team
