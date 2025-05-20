import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
    Box, Drawer, List, ListItem, ListItemText, Typography, Button,
    AppBar, Toolbar, IconButton, Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomePage from './pages/Home';
import LibrariesPage from './pages/Libraries';
import BooksPage from './pages/Books';
import UsersPage from './pages/Users';
import RequestPage from './pages/Requests';

const drawerWidth = 240;

function App() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen(prev => !prev);
    };

    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                {/* Верхняя панель */}
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={toggleDrawer}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Paper elevation={3} sx={{ padding: '0.3rem 1rem', borderRadius: '8px' }}>
                            <Typography variant="h6" component="div">
                                📚 СЕРВИС СЕТИ БИБЛИОТЕК
                            </Typography>
                        </Paper>
                    </Toolbar>
                </AppBar>

                {/* Боковое меню */}
                <Drawer
                    variant="persistent"
                    open={open}
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            transition: 'width 0.3s',
                        },
                    }}
                >
                    <Toolbar />
                    <List>
                        <ListItem>
                            <Button component={Link} to="/">🏠 Домой</Button>
                        </ListItem>
                        <ListItem>
                            <Button component={Link} to="/libraries">📚 Библиотеки</Button>
                        </ListItem>
                        <ListItem>
                            <Button component={Link} to="/books">📖 Книги</Button>
                        </ListItem>
                        <ListItem>
                            <Button component={Link} to="/users">👤 Пользователи</Button>
                        </ListItem>
                        <ListItem>
                            <Button component={Link} to="/requests">📨 Заявки</Button>
                        </ListItem>
                    </List>
                </Drawer>

                {/* Контент */}
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar /> {/* Чтобы не перекрывалось AppBar'ом */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/libraries" element={<LibrariesPage />} />
                        <Route path="/Books" element={<BooksPage />} />
                        <Route path="/Users" element={<UsersPage />} />
                        <Route path="/Requests" element={<RequestPage />} />
                        {/* Добавь другие маршруты */}
                    </Routes>
                </Box>
            </Box>
        </Router>
    );
}

export default App;
