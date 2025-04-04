import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { ws } from "../ws";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Проверяем токен при открытии страницы
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      ws.auth = { token };
      ws.connect();

      ws.on("connect", () => {
        console.log("Авто-вход выполнен");
        navigate("/channels/"); // Перенаправляем в систему
      });

      ws.on("connect_error", (err) => {
        console.error("Ошибка авторизации:", err.message);
        localStorage.removeItem("authToken"); // Если токен невалиден, удаляем его
      });
    }
  }, [navigate]);

  const onSubmit = (data: LoginForm) => {
    setLoading(true);
    setError("");
    
    ws.emit("login", data, (response: { success: boolean; message?: string; userId: string; token?: string }) => {
      setLoading(false);
      if (!response.success) {
        setError(response.message || "Ошибка авторизации");
      } else {
        localStorage.setItem("userName", data.username);
        localStorage.setItem("userId", response.userId);
        
        if (response.token) {
          localStorage.setItem("authToken", response.token);
          ws.auth = { token: response.token }; // Добавляем токен в WebSocket
          ws.connect();
        }

        navigate("/channels/");
      }
    });
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input 
                type="text" 
                placeholder="Username" 
                {...register("username", { required: "Введите имя пользователя" })} 
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            <div>
              <Input 
                type="password" 
                placeholder="Пароль" 
                {...register("password", { required: "Введите пароль" })} 
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              {loading ? "Загрузка..." : "Войти"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button 
              onClick={handleRegisterClick} 
              className="text-blue-500 hover:underline"
            >
              Нет аккаунта? Зарегистрируйтесь
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
