import { Link } from 'react-router-dom';
function Header(){
    return(
        <div className="header">
            <Link to="/">Home</Link>
            <Link to="/file-explorer">File Explorer</Link>
        </div>
    )
}
export default Header