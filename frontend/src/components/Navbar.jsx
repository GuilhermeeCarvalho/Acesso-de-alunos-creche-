import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-right">
                {user && (
                    <>
                        <span className="navbar-user">{user.email || 'Usuário'}</span>
                        <button className="button-link" onClick={logout}>Sair</button>
                    </>
                )}
            </div>
        </nav>
    );
}