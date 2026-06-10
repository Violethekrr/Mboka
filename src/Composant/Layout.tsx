import {useLocation} from 'react-router-dom';
import NacClient from './Client/Nav';
import NacFreelancer from './Freelancer/Nav';
import NavAdmin from './Admin/Slide';
import footAdmin from './Admin/Foot';
import FootClient from './Client/Foot';
import FootFreelancer from './Freelancer/Foot';
import { useUser } from '../Context/UtilisateurContext';

interface Props {
    children : React.ReactNode;
}
export default function Layout({ children } : Props) {
  const { role } = useUser();
  const Nav = role === 'freelancer' ? NacFreelancer : role === 'client' ? NacClient : NavAdmin;
  const Foot = role === 'freelancer' ? FootFreelancer : role === 'client' ? FootClient : footAdmin;

    const location = useLocation();
    //La liste des routes où la Navbar et le Footer ne doivent pas apparaître
    const routesNav = ['/Contact', '/inscription', '/'];
    const routesFooter = ['/Contact', '/inscription', '/'];
    //Verifier si la route actuelle est dans la list
    const hiddenNav = routesNav.includes(location.pathname);
    const hiddenFooter = routesFooter.includes(location.pathname);
  return (
    <div className="min-h-screen flex flex-col ">
        {!hiddenNav && <Nav/>}
        
        <main>{children}</main>
        {!hiddenFooter && <Foot/>}
    </div>
  )
}