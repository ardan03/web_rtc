import classNames from "classnames";

interface ButtonProps {
    onClick?: () => void;
    className: string;
    testId?: string;
    type?: "submit" | "button" | "reset";
    disabled?: boolean; // Добавляем свойство disabled
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    testId,
    className,
    type = "submit",
    disabled = false, // по умолчанию кнопка не будет заблокирована
}) => {
    return (
        <button
            type={type}
            data-testid={testId}
            onClick={onClick}
            className={classNames(
                "bg-rose-400 p-2 rounded-lg hover:bg-rose-600 text-white",
                { "bg-gray-400 cursor-not-allowed": disabled }, // если disabled, кнопка будет серой и неактивной
                className
            )}
            disabled={disabled} // добавляем disabled в кнопку
        >
            {children}
        </button>
    );
};
