import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar w-full">
        <Link to="/"> <p className="text-2xl font-bold text-gradient">ResuFlow</p> </Link>
        <Link to="/upload" className="primary-button w-fit"> Upload Resume</Link>

    </nav>
  )
}

export default Navbar