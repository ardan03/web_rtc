export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        {children}
      </div>
    );
  }
export function CardContent({ children }: { children: React.ReactNode }) {
    return <div className="p-4">{children}</div>;
}
export function CardHeader({ children }: { children: React.ReactNode }) {
    return <div className="p-4 border-b border-gray-200">{children}</div>;
}
export function CardTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-xl font-semibold">{children}</h2>;
}

