import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/common/Card";
import { ws } from "../ws";

interface RegisterForm {
    email: string;
    username: string;
    password: string;
}

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = (data: RegisterForm) => {
    setLoading(true);
    setError("");
    ws.emit("register", data, (response: { success: boolean; message?: string }) => {
        setLoading(false);
        if (!response.success) {
            setError(response.message || "Ошибка регистрации");
        } else {
            console.log("Регистрация успешна");
        }
    });
    };

return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-96 shadow-lg">
        <CardHeader>
            <CardTitle>Регистрация</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input 
                type="email" 
                placeholder="Email" 
                {...register("email", { 
                    required: "Введите email", 
                    pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Неверный формат email"
                    }   
                })} 
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
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
                {loading ? "Загрузка..." : "Зарегистрироваться"}
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
    );
}
