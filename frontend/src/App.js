import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import BookingLookupPage from "./pages/BookingLookupPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/destinations" element={<DestinationsPage/>} />
        <Route path="/destination/:slug" element={<DestinationDetailPage/>} />
        <Route path="/search/:type" element={<SearchResultsPage/>} />
        <Route path="/checkout/:ref" element={<CheckoutPage/>} />
        <Route path="/success" element={<SuccessPage/>} />
        <Route path="/booking-lookup" element={<BookingLookupPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
