import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/home">Início</Link>
                <Link to="/alunos">Alunos</Link>
                {isAdmin && <Link to="/funcionarios">Funcionários</Link>}
            </div>
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