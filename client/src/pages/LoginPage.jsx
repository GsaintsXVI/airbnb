import { Link } from "react-router-dom";
export default function LoginPage() {
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login Page</h1>
        <form className="max-w-md mx-auto">
          <input type="email" className="mt" placeholder="your@email.com" />
          <input type="password" placeholder="your password" />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-400">
            Don't have an account? <Link to="/register" className="underline text-black">Register now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
