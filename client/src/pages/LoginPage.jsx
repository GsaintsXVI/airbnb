import { Link } from "react-router-dom";
import { Navigate } from 'react-router-dom'
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../userContext";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext)
  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post('/login', { email, password })
      setUser(data)
      alert('login success')

      setRedirect(true)
    } catch (error) {
      alert('login failed')
    }
  }
  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login Page</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            className="mt"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-400">
            Do not have an account?{" "}
            <Link to="/register" className="underline text-black">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
