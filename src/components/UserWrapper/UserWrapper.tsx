import { FC, ReactNode, useState, MouseEvent } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Container,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon } from 'mdi-material-ui';
import { Link } from 'react-router-dom';

const brandLogo = process.env.PUBLIC_URL + '/logo192.png';

interface UserWrapperProps {
  title: string;
  children: ReactNode;
}

const pages = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Reserve',
    link: '/reserve',
  },
  {
    name: 'Reservations',
    link: '/reservations',
  },
  {
    name: 'Availability',
    link: '/availability',
  },
];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const UserWrapper: FC<UserWrapperProps> = ({ title, children }) => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position='sticky'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Avatar
              alt='Brand'
              src={brandLogo}
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
                edge='start'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={page.link}
                  >
                    <Typography textAlign='center'>{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <Avatar alt='Brand' src={brandLogo} />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  variant='text'
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  component={Link}
                  to={page.link}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseNavMenu}>
                    <Typography textAlign='center'>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
        <Container
          maxWidth='xl'
          style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
        >
          <Typography variant='h1'>{title}</Typography>
        </Container>
      </AppBar>
      <Container maxWidth='xl' style={{ paddingTop: '1.5rem' }}>
        {children}
      </Container>
    </>
  );
};

export default UserWrapper;
