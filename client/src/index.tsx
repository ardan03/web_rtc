import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RoomProvider } from "./context/RoomContext";
import { Home } from "./pages/Home";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";
import LoginPage from "./pages/Auth";
import RegisterPage from "./pages/Register";
import ChatContent from "./components/Channel/ChatContent";
import Channel from "./pages/Channel";
import CreateServer from "./pages/CreateServer";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>
                <RoomProvider>
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/channels" element={<Channel />}>
                            <Route path="create" element={<CreateServer />} />
                            <Route
                                path=":serverId"
                                element={
                                    <ChatProvider>
                                        <ChatContent />
                                    </ChatProvider>
                                }
                            />
                            <Route
                                path=":serverId/:roomId"
                                element={
                                    <ChatProvider>
                                        <ChatContent />
                                    </ChatProvider>
                                }
                            />
                        </Route>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/test" element={<div>Тестовая страница работает!</div>} />
                    </Routes>
                </RoomProvider>
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();