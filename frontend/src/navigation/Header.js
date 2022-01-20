import axios from "axios";


import './Header.css'

function Header(props) {

  function logMeOut() {
    axios({
      method: "POST",
      url:"/logout",
    })
    .then((response) => {
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