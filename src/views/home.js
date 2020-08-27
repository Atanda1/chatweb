import React from 'react'
import '../styles/home.css'
import {Link} from 'react-router-dom'

function Home() {
    return (
        <div className="home__container">
          <section>
          <span></span>
            <h1>Welcome To Chatty</h1>
            {/* <form>
              <input placeholder='User Name' type='text'/>
              <input placeholder='Password' type='password'/>
            </form> */}
            <Link to='/login'>
              <button>LOGIN</button>
            </Link>
            <Link to='/signup'>
              <button>SIGNUP</button>
            </Link>
            
            {/* <h2>
              <a href='#'>Forgot Password?</a>
            </h2> */}
          </section>
        </div>
    )
}

export default Home