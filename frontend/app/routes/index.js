import React from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router';

// ----------- Pages Imports ---------------
import SidebarWithNavbar from './Layouts/SidebarWithNavbar';
import ScpGroup from './Apps/ScpGroup';
import Users from './Apps/Users';
import SThree from './Apps/SThree/SThreeList';
import Send from './Apps/Send/SendList';
import System from './Apps/System/SystemList';
import OnroadPage from './Apps/OnroadPage';

import ComingSoon from './Pages/ComingSoon';
import Confirmation from './Pages/Confirmation';
import Danger from './Pages/Danger';
import Error404 from './Pages/Error404';
import ForgotPassword from './Pages/ForgotPassword';
import LockScreen from './Pages/LockScreen';
import Login from './Pages/Login';
// import Modals from './Interface/Modals';

import Register from './Pages/Register';
import Success from './Pages/Success';
// ----------- Layout Imports ---------------
import { DefaultNavbar } from './../layout/components/DefaultNavbar';
import { DefaultSidebar } from './../layout/components/DefaultSidebar';

import { SidebarASidebar } from './../layout/components/SidebarASidebar';

//------ Route Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = () => {
    return (
        <Switch>
            <Redirect from="/" to="/pages/login" exact />
            { /*    Forms Routes    */ }
            <Route component={ ScpGroup } path="/apps/scp" />
            <Route component={ Users } path="/apps/users/:type" />
            <Route component={ SThree } path="/apps/s3/list" />
            <Route component={ Send } path="/apps/pac/list" />
            <Route component={ System } path="/apps/system/log" />
            <Route component={ OnroadPage } path="/apps/web" />
            {/* <Route component={ Modals } path="/interface/modals" /> */}
            { /*    Pages Routes    */ }
            <Route component={ ComingSoon } path="/pages/coming-soon" />
            <Route component={ Confirmation } path="/pages/confirmation" />
            <Route component={ Danger } path="/pages/danger" />
            <Route component={ Error404 } path="/pages/error-404" />
            <Route component={ ForgotPassword } path="/pages/forgot-password" />
            <Route component={ LockScreen } path="/pages/lock-screen" />
            <Route component={ Login } path="/pages/login" />
            <Route component={ Register } path="/pages/register" />
            <Route component={ Success } path="/pages/success" />
            { /*    404    */ }
            <Redirect to="/pages/error-404" />
        </Switch>
    );
};

//------ Custom Layout Parts --------
export const RoutedNavbars  = () => (
    <Switch>
        <Route
            component={ SidebarWithNavbar.Navbar }
            path="/layouts/sidebar-with-navbar"
        />
        <Route
            component={ DefaultNavbar }
        />
    </Switch>  
);

export const RoutedSidebars = () => (
    <Switch>
        { /* Other Sidebars: */}
        <Route
            component={ SidebarASidebar }
            path="/layouts/sidebar-a"
        />
        <Route
            component={ SidebarWithNavbar.Sidebar }
            path="/layouts/sidebar-with-navbar"
        />
        { /* Default Sidebar: */}
        <Route
            component={ DefaultSidebar }
        />
    </Switch>
);
