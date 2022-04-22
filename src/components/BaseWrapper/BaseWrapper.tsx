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
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '~/services';
import { useUserContext } from '~/hooks';
import { formatCurrency } from '~/utils';

const brandLogo = import.meta.env.PUBLIC_URL + '/logo192.png';

interface BaseWrapperProps {
  children?: ReactNode;
  title: string;
  type: 'user' | 'admin';
  pages?: {
    name: string;
    link: string;
  }[];
  additionalSettings?: {
    name: string;
    onClick: () => void;
  }[];
}

const UserWrapper: FC<BaseWrapperProps> = ({
  children,
  title,
  type,
  pages = [],
  additionalSettings = [],
}) => {
  const { user, setUser } = useUserContext();

  const navigate = useNavigate();

  const settings = [
    ...additionalSettings.map((additionalSetting) => ({
      name: additionalSetting.name,
      onClick: () => {
        handleCloseNavMenu();
        additionalSetting.onClick();
      },
    })),
    {
      name: 'Account Settings',
      onClick: () => {
        handleCloseNavMenu();
        navigate('/account-settings');
      },
    },
    {
      name: 'Sign Out',
      onClick: () => {
        handleCloseNavMenu();
        authService.signOut();
        setUser(null);
        navigate('/');
      },
    },
  ];

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
      <AppBar
        position='sticky'
        color={type === 'user' ? 'primary' : 'secondary'}
      >
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
                {pages.map((page) => {
                  return (
                    <MenuItem
                      key={page.name}
                      onClick={handleCloseNavMenu}
                      component={NavLink}
                      to={page.link}
                      // @ts-ignore
                      style={({ isActive }) => {
                        return isActive
                          ? { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
                          : {};
                      }}
                    >
                      <Typography textAlign='center'>{page.name}</Typography>
                    </MenuItem>
                  );
                })}
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
                  component={NavLink}
                  to={page.link}
                  // @ts-ignore
                  style={({ isActive }) => ({
                    textUnderlinePosition: 'under',
                    textDecoration: isActive ? 'underline' : 'none',
                  })}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            {type === 'user' && (
              <Box
                sx={{
                  flexGrow: 0,
                  mr: 2,
                  display: {
                    xs: 'none',
                    md: 'block',
                  },
                }}
              >
                <Button
                  variant='text'
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  component={Link}
                  to='/top-up'
                >
                  {formatCurrency(user?.userDetails?.credits || 0)}
                </Button>
              </Box>
            )}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar children={user?.displayName?.charAt(0)} />
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
                  <MenuItem key={setting.name} onClick={setting.onClick}>
                    <Typography>{setting.name}</Typography>
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
