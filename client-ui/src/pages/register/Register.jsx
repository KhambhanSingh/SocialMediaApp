import { Link } from "react-router-dom";
import "./register.scss";
import {useState} from 'react'
import axios from 'axios'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [inputs, setInputs] = useState({
    username : "",
    email : "",
    fname : "",
    lname : "",
    password : ""
  })

  const handleChange = (e) => {
    setInputs((prev) => ({...prev, [e.target.name] : e.target.value}))
  }
  
  const handleClick = async (e) => {
    e.preventDefault()
    setError(false)
    setLoading(true)
    await axios.post("http://localhost:8800/api/auth/register", inputs)
    .catch((err) => setError(err.response.data.msg))
    .finally(() => setLoading(false))
  }
  
  return (
    <div className="register w-full">
      <div className="card">
        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
          <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} value={inputs.username}/>
            <input type="email" placeholder="Email" name="email" onChange={handleChange} value={inputs.email}/>
            <input type="text" placeholder="First Name" name="fname" onChange={handleChange} value={inputs.fname}/>
            <input type="text" placeholder="Last Name" name="lname" onChange={handleChange} value={inputs.lname}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange} value={inputs.password}/>
            {error && <span>{error}</span>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
