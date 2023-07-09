import example from '../assets/example.gif'
import pastalogo from '../assets/pasta-logo.png'
import './Footer.css';
import React, { useEffect  } from 'react';
import {Link} from 'react-router-dom';

function Footer() {

  return (
			<div className="footer">
				<hr />

        <div className="footerLeft">
          <Link to="https://cmu-pasta.github.io/">
            <img name="pasta-logo" src={pastalogo} alt="PASTA Lab Logo" className="footerImg"/>
          </Link>.
        </div>
        <div className="footerRight">
				<footer>
					Developed by <Link to="https://vasumv.github.io/">Vasu Vikram</Link> and the&nbsp;
          <Link to="https://cmu-pasta.github.io/">PASTA Lab</Link> @ Carnegie Mellon University.
				</footer>
        </div>
			</div>
  );
}

export default Footer;
