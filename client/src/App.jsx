  import { BrowserRouter, Route, Routes } from 'react-router-dom';
  import Login from './component/Login.jsx';
  import Home from './component/Home.jsx';
  import './App.css';
  import Navbar from './component/Navbar.jsx';
  import Contact from './component/Contact.jsx';
  import About from './component/About.jsx';
  import VehicleList from './component/VehicleList.jsx';
  import VehicleForm from './component/VehicleForm.jsx';
  import Footer from './component/Footer.jsx'; 
  import AdminDashboard from './AdminDashboard.jsx';
  import UserDashboard from './UserDashboard.jsx';
  import Signup from './component/Signup.jsx';
  import ProtectedRoute from './component/ProtectedRoutes.jsx';

  function App() {
    const token = localStorage.getItem('token');

    return (
      <>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* <Route path="/" element={<VehicleList token={token} />} /> */}
            <Route path='/' element={<Home/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                <UserDashboard />
                </ProtectedRoute>
            }
            />
            <Route path="/vehicle/create" element={<VehicleForm token={token} />} />
            <Route path="/vehicle/:id/view" element={<VehicleForm token={token} />} />
            <Route path="/vehicle/:id/edit" element={<VehicleForm token={token} />} />
            {/* <Route path="/emails" element={<EmailManager token={token} />} /> */}
          </Routes>
          <Footer /> 
        </BrowserRouter>
      </>
    );
  }

  export default App;


// import React from 'react'
// import AdminDashboard from './AdminDashboard.jsx';
// import UserDashboard from './UserDashboard.jsx';
// import VehicleForm from './component/VehicleForm.jsx';
// import EmailList from './component/EmailList.jsx';

// const App = () => {
//   return (

//     <div>
//       {/* <VehicleForm/> */}
//       <AdminDashboard />
//       {/* <UserDashboard /> */}
//       <EmailList />
//     </div>
//   )
// }

// export default App;