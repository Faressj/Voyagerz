
import React from "react";
import './styles/LogSign.scss'

const LogSign = () => {
  return (
    <>
    <div className='logsign'>
      <div className="container">
        <div>
          <a href="/login"><button className="log">Login</button></a>
          <a href="/signup"><button className="reg">Sign Up</button></a>
        </div>
      </div>
    </div>
    </>
  );
};
  
export default LogSign;