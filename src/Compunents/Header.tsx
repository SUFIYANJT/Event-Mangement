import React from 'react'
import './Header.css'
function Header() {
  return (
    <header>
        <div className='Brand'>
        <h1>Eventify</h1>
        </div>
        <nav>
        <ul>
            <li>Home</li>
            <li>Events</li>
            <li>Whislist</li>
        </ul>
        </nav>
        <button>Profile</button>
</header>

  )
}

export default Header