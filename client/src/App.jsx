import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import NotFoundPage from "./pages/NotFoundPage"
import TransactionPage from "./pages/TransactionPage"
import Header from "./components/ui/Header"
import { useQuery } from "@apollo/client"
import { GET_AUTHENTICATED_USER } from "./graphql/quaries/userQuery"
import { Toaster } from "react-hot-toast"


function App() {
  const { data, loading } = useQuery(GET_AUTHENTICATED_USER);
  if (loading) return 

  return (
    <>
      { data?.authUser && <Header /> }
      <Routes>
        <Route path="/" element={ data?.authUser ? (<HomePage profilePicture={data?.authUser.profilePicture} />) : (<Navigate to={"/login"} />) } />
        <Route path="/login" element={ !data?.authUser ? (<LoginPage />) : (<Navigate to={"/"} />) } />
        <Route path="/signup" element={ !data?.authUser ? (<SignUpPage />) : (<Navigate to={"/"} />) } />
        <Route path="/transaction/:id" element={ data?.authUser ? (<TransactionPage />) : (<Navigate to={"/login"} />) } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
