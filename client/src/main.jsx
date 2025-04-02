import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/dashboard.jsx';
import Preference from './pages/preference.jsx';
import './index.css';

const Event = lazy(() => import('./component/event.jsx'));
const Booking = lazy(() => import('./component/booking.jsx'));
const Availability = lazy(() => import('./component/availability.jsx'));
const Settings = lazy(() => import('./component/setting.jsx'));
const Create = lazy(() => import('./component/create.jsx'));

// Booking Subroutes
const Upcoming = lazy(() => import('./component/bookingComponent/upcoming.jsx'));
const Pending = lazy(() => import('./component/bookingComponent/pending.jsx'));
const Cancelled = lazy(() => import('./component/bookingComponent/canceled.jsx'));
const Past = lazy(() => import('./component/bookingComponent/past.jsx'));

// Loading fallback component
const LoadingFallback = () => <div>Loading...</div>;


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/preference' element={<Preference />} />

        {/* Dashboard with Nested Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="event" />} /> {/* Default to Event */}
          <Route
            path="event"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Event />
              </Suspense>
            }
          />
           {/* Booking with Nested Routes */}
           <Route
            path="booking"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Booking />
              </Suspense>
            }
          >
            <Route index element={<Navigate to="upcoming" />} />
            <Route
              path="upcoming"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Upcoming />
                </Suspense>
              }
            />
            <Route
              path="pending"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Pending />
                </Suspense>
              }
            />
            <Route
              path="cancelled"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Cancelled />
                </Suspense>
              }
            />
            <Route
              path="past"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Past />
                </Suspense>
              }
            />
          </Route>          
          <Route
            path="availability"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Availability />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="create"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Create />
              </Suspense>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>
)
