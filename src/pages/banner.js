import React from 'react';
import { Media } from 'react-bootstrap'



function Banner(props) {
    return (
        <div style={{textAlign:'center', marginBottom:"40px"}}>
       <h1 >Sistema de avisos próximas manutenções</h1>
       <h4 style={{color:"darkblue"}}>{props.props}</h4>
        </div>
    );
}

export default Banner;