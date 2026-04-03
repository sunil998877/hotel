import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HealthChatbot from './HealthChatbot';
import { Box } from '@mui/material';

const Layout = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box component="main" flex={1}>
        <Outlet />
      </Box>
      <Footer />
      <HealthChatbot />
    </Box>
  );
};

export default Layout;
