// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RoomProvider } from "./context/RoomContext";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";
import LoginPage from "./pages/Auth";
import RegisterPage from "./pages/Register";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>
                <RoomProvider>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                            path="/room/:id"
                            element={
                                <ChatProvider>
                                    <Room />
                                </ChatProvider>
                            }
                        />
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </RoomProvider>
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
