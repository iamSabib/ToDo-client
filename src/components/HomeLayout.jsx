import { Outlet } from 'react-router';
import Navbar from './Navbar';

const HomeLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            
        </div>
    );
};

export default HomeLayout;