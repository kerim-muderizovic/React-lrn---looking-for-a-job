import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Header } from './header'
import './App.css'
import Login from './login'
import  Register  from './register'
import Footer from './footer'
// import {Brojac} from './counter';
import { PerfumesList } from './counter';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import  Navbar  from './navbar';
function App() {
  const[view,setView]=useState('login');

  return (
    <div>
    <Navbar setView={setView}/>
    {view === 'login' && <Login />}
    {view === 'register' && <Register />}
<Footer/>
    </div>
  )

}

export default App
