import { useState } from 'react';
import axios from "axios";

const Login = (props) => {

    const [loginForm, setloginForm] = useState({
      username: "",
      password: ""
    })

    const logMeIn = (event) => {
      axios({
        method: "POST",
        url:"http://localhost:5000/token",
        data:{
          username: loginForm.username,
          password: loginForm.password
         }
      })
      .then((response) => {
        props.setToken(response.data.access_token, response.data.user_id)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          }
      })

      setloginForm(({
        username: "",
        password: ""}))

      event.preventDefault()
    }

    const handleChange = (event) => { 
      const {value, name} = event.target
      setloginForm(prevNote => ({
          ...prevNote, [name]: value})
      )}

    return (
      <div>
        <h1>Login</h1>
          <form className="login">
            <input onChange={handleChange} 
                  type="text"
                  text={loginForm.username} 
                  name="username" 
                  placeholder="username" 
                  value={loginForm.username} />
            <input onChange={handleChange} 
                  type="password"
                  text={loginForm.password} 
                  name="password" 
                  placeholder="Password" 
                  value={loginForm.password} />

          <button onClick={logMeIn}>Submit</button>
        </form>
      </div>
    );
}

export default Login;