import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import ProtectedRoutes from "./ProtectedRouter";
import DashboardLayout from "@/components/DashboardLayout";
import LoadArchive from "@/pages/LoadArchive";
import RegisterUser from "@/pages/RegisterUser";
import UsersPage from "@/pages/UsersPage";
import UserListPage from "@/pages/UserListPage";
import UpdateUser from "@/pages/UpdateUser";

export const MyRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="home" element={<HomePage />} />
                        <Route path="load-archive" element={<LoadArchive />} />
                        <Route path="register-users" element={<RegisterUser />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="user-list" element={<UserListPage />} />
                        <Route path="update-user" element={<UpdateUser />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    )
}