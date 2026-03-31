import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>BizBazar LATAM</h3>
          <p>El marketplace líder para comprar y vender negocios en Chile y Latinoamérica.</p>
        </div>
        <div className="footer-section">
          <h4>Explorar</h4>
          <Link to="/search?type=sme">PYMEs en Venta</Link>
          <Link to="/search?type=ecommerce">Negocios E-commerce</Link>
          <Link to="/search?type=franchise">Franquicias</Link>
        </div>
        <div className="footer-section">
          <h4>Países</h4>
          <Link to="/search?country=Chile">Chile</Link>
          <Link to="/search?country=Argentina">Argentina</Link>
          <Link to="/search?country=Colombia">Colombia</Link>
          <Link to="/search?country=Perú">Perú</Link>
        </div>
        <div className="footer-section">
          <h4>Soporte</h4>
          <a href="#contact">Contacto</a>
          <a href="#faq">Preguntas Frecuentes</a>
          <a href="#terms">Términos de Uso</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 BizBazar LATAM. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
