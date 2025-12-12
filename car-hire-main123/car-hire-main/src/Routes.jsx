import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AdminCommandCenter from './pages/admin-command-center';
import AdminLogin from './pages/admin-login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AddVehicle from './pages/admin-command-center/components/AddVehicle';
import EditVehicle from './pages/admin-command-center/components/EditVehicle';
import PSVProfessionalServices from './pages/psv-professional-services';
import FleetDiscovery from './pages/fleet-discovery';
import RoadTripAdventures from './pages/road-trip-adventures';
import Homepage from './pages/homepage';
import InstantBookingFlow from './pages/instant-booking-flow';
import Confirmation from './pages/instant-booking-flow/Confirmation';
import BookingSuccess from './pages/BookingSuccess';
import MpesaPay from './pages/mpesa-pay';
import CustomerRegistration from './pages/customer-registration';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/fleet-discovery" element={<FleetDiscovery />} />
          <Route path="/road-trip-adventures" element={<RoadTripAdventures />} />
          <Route path="/psv-professional-services" element={<PSVProfessionalServices />} />
          <Route path="/instant-booking-flow" element={<InstantBookingFlow />} />
          <Route path="/booking-confirmation" element={<Confirmation />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/mpesa-pay" element={<MpesaPay />} />
          <Route path="/customer-registration" element={<CustomerRegistration />} />
          
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin-command-center" 
            element={
              <ProtectedRoute>
                <AdminCommandCenter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-command-center/add-vehicle" 
            element={
              <ProtectedRoute>
                <AddVehicle />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-command-center/edit-vehicle/:id" 
            element={
              <ProtectedRoute>
                <EditVehicle />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
