import axios from "axios";

import './Header.css'

const Header = (props) => {

  const logMeOut = () => {
    axios({
      method: "POST",
      url:"http://localhost:5000/logout",
    })
    .then((response) => {
      console.log("ovde sam")
       props.token()
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

    return(
        <header className="App-header" className="header__header">
            <button onClick={logMeOut}> 
                Logout
            </button>
        </header>
    )
}

export default Header;