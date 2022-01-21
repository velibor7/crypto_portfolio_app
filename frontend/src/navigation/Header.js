import axios from "axios";

import './Header.css'

const Header = (props) => {

  const logMeOut = () => {
    props.removeToken()
    axios({
      method: "POST",
      url:"http://localhost:5000/logout",
    })
    .then((response) => {
      console.log(response);
      // ovo ovde ne mora da bude u then statementu
      // hocemo svejedno da ga izlogujemo iako ne moze da posalje zahtev na bekend
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

    return(
        <header className="header__header">
          {
            props.token && (
            <button onClick={logMeOut}> 
                Logout
            </button>
            )
          }
        </header>
    )
}

export default Header;