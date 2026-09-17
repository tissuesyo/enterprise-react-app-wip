import type { ReactNode } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { AppBar, Avatar, Box, Link as MuiLink, Stack, Toolbar, Typography } from '@mui/material';
import { AppButton } from '@/shared/components/AppButton';
import { useAuth } from '@/shared/auth/useAuth';

/** 整個 SPA 唯一的頂層版面：固定的 AppBar + 下方用 <Outlet> 渲染目前路由對應的頁面。 */
export function AppLayout(): ReactNode {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ gap: 3 }}>
          <Typography variant="h6" component="div" fontWeight={700} color="primary.main">
            Enterprise Console
          </Typography>
          <MuiLink component={RouterLink} to="/users" underline="hover" color="text.primary">
            Users
          </MuiLink>
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
                {user.displayName.slice(0, 1).toUpperCase()}
              </Avatar>
              <Typography variant="body2">{user.displayName}</Typography>
              <AppButton intent="secondary" variant="text" size="small" onClick={logout}>
                Logout
              </AppButton>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
