/*En esta parte estamos importando de la librería react-roter Link para los links de nuestras distintas páginas*/
import { Link } from "react-router-dom";
/*En este apartado estmoas importando los íconos de cada una de nuestras páginas*/
import { Ticket } from 'phosphor-react';
import { User } from 'phosphor-react';
/*Importamos el diseño de nuestra barra de navegación*/
import "./navbar.css";

export const NavBar = () => {
  return (
    <div className="navbar">
        <div className="Logo">
            <img src="/mido.png"/>
        </div>
        <div className="links">
            <Link to="/Login">
                <User size={32} />
            </Link>
            <Link to="/Tickets">
                <Ticket size={32} />
            </Link>
        </div>
    </div>
  );
}