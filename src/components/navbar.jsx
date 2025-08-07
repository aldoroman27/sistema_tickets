/*En esta parte estamos importando de la librería react-roter Link para los links de nuestras distintas páginas*/
import { Link} from "react-router-dom";
/*En este apartado estmoas importando los íconos de cada una de nuestras páginas*/
import { User } from 'phosphor-react';
import { CheckCircle } from 'phosphor-react';
import { House } from 'phosphor-react';
/*Importamos el diseño de nuestra barra de navegación*/
import "./navbar.css";

export const NavBar = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) return null;
    return (
        <div className="navbar">
            <div className="Logo" title="gestion">
                <img src="/gestion.png"/>
            </div>
            <div className="links" title="Iniciar Sesión">
                <Link to='/Home' title="Panel de Usuario">
                    <House size={32}/>
                </Link>

                {/* Mostrar solo si el usuario es admin */}
                {usuario?.admin && (
                <Link to="/CheckTickets" title="Panel de administrador">
                    <CheckCircle size={32} />
                </Link>
                )}
            </div>
        </div>
    );
}