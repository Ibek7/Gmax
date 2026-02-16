import React from 'react'
import '../styles/Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <a href="/about">About</a>
                    <a href="/privacy">Privacy</a>
                    <a href="/terms">Terms</a>
                    <a href="/contact">Contact</a>
                </div>
                <div className="footer-copyright">
                    © {currentYear} Gmax Creative Studio. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
