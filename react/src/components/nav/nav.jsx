import { Link } from "react-router-dom"
import Logout from './logout'
import './nav.css';

import { useGlobalState } from "../../context/globalContext"

function Nav() {
  const GlobaleState = useGlobalState()
  return (
    <div>
      <nav class="navbar navbar-dark bg-dark">




        {
          (GlobaleState.loginStatus === true && GlobaleState.role === "admin") ?
            <div>
              <ul className="navbar-nav mr-auto">

                <li className="nav-item">
                  <Link className="nav-link" to="/">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Addproduct">Add Product</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/orderhistory">Order History <span className="sr-only">(current)</span></Link>
                </li>

                <div style={{ marginLeft: 800 }} >
                  <Logout />
                </div>
              </ul>

            </div> : null}
        {
          (GlobaleState.loginStatus === true && GlobaleState.role === "user") ?
            <div>
              <ul className="navbar-nav mr-auto">

                <li className="nav-item">
                  <Link className="nav-link" to="/">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/myOrders">my orders</Link>
                </li>
                <div style={{ marginLeft: 1370 }} >
                  <Logout />
                </div>
              </ul>

            </div> : null}


        {(GlobaleState.loginStatus === false) ?

          <div>
            <form className="form-inline my-2 my-lg-0 " width="100%" height="10%" >
              <button className="btn btn-outline-primary" type="submit">
                <Link className="nav-link" to="/login">Login<span className="sr-only"></span></Link>
              </button>
              <button className="btn btn-outline-primary" type="submit">
                <Link className="nav-link" to="/signup">Signup <span className="sr-only"></span></Link>
              </button>

            </form>
          </div> : null
        }

      </nav>
    </div>
  )

}

export default Nav