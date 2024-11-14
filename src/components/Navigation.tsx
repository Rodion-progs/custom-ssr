import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
    const location = useLocation();

    return (
        <nav className="nav-wrapper">
            <div className="nav-container">
                <div className="nav-logo">
                    <img src="/logo.png" alt="Rick and Morty" />
                </div>
                <div className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Characters
                    </Link>
                    <Link
                        to="/episodes"
                        className={`nav-link ${location.pathname === '/episodes' ? 'active' : ''}`}
                    >
                        Episodes
                    </Link>
                </div>
            </div>
        </nav>
    )
}
