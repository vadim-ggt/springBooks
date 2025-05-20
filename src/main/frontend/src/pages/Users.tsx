// src/pages/Users.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Tooltip, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Snackbar, Alert, Select, MenuItem,
    Divider, Chip
} from '@mui/material';
import { Edit, Delete, Person, Add, Info } from '@mui/icons-material';

interface User {
    id?: number;
    username: string;
    email: string;
    password?: string;
}

interface Library {
    id: number;
    name: string;
}

interface UserLibrary {
    id: number;
    name: string;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [userLibraries, setUserLibraries] = useState<Record<number, UserLibrary[]>>({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userInfoDialogOpen, setUserInfoDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>({
        username: '',
        email: '',
        password: '',
    });

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedLibraryId, setSelectedLibraryId] = useState<number>(-1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
        fetchLibraries();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get<User[]>('http://localhost:8080/api/v1/users');
            setUsers(res.data);

            // Сохраняем существующие библиотеки, чтобы не терять их
            setUserLibraries(prev => {
                const newUserLibraries = {...prev};

                // Загружаем библиотеки только для новых пользователей
                res.data.forEach(user => {
                    if (user.id && !newUserLibraries[user.id]) {
                        fetchUserLibraries(user.id).then(libs => {
                            setUserLibraries(curr => ({
                                ...curr,
                                [user.id as number]: libs
                            }));
                        });
                    }
                });

                return newUserLibraries;
            });
        } catch (err) {
            setError('Ошибка при загрузке пользователей');
            showSnackbar('Ошибка при загрузке пользователей', 'error');
        }
    };

    const fetchLibraries = async () => {
        try {
            const res = await axios.get<Library[]>('http://localhost:8080/api/v1/libraries');
            setLibraries(res.data);
        } catch (err) {
            setError('Ошибка при загрузке библиотек');
            showSnackbar('Ошибка при загрузке библиотек', 'error');
        }
    };

    const fetchUserLibraries = async (userId: number): Promise<UserLibrary[]> => {
        try {
            const res = await axios.get<UserLibrary[]>(`http://localhost:8080/api/v1/users/${userId}/libraries`);
            return res.data;
        } catch (err) {
            console.error('Ошибка загрузки библиотек:', err);
            return []; // возвращаем пустой массив вместо ошибки
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleOpenDialog = (user: User | null) => {
        setCurrentUser(user ?? { username: '', email: '', password: '' });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setCurrentUser(null);
    };

    const handleOpenUserInfo = async (user: User) => {
        setSelectedUser(user);
        setSelectedLibraryId(-1);

        if (user.id !== undefined) {
            const libraries = await fetchUserLibraries(user.id);
            setUserLibraries(prev => ({
                ...prev,
                [user.id as number]: libraries
            }));
        }

        setUserInfoDialogOpen(true);
    };

    const handleCloseUserInfo = () => {
        setUserInfoDialogOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = async () => {
        try {
            let updatedUser: User | null = null;

            if (currentUser?.id) {
                await axios.put(`http://localhost:8080/api/v1/users/${currentUser.id}`, currentUser);
                showSnackbar('Пользователь обновлён', 'success');
                updatedUser = { ...currentUser };
            } else {
                const res = await axios.post('http://localhost:8080/api/v1/users', currentUser);
                showSnackbar('Пользователь создан', 'success');
                updatedUser = res.data;
            }

            await fetchUsers();

            if (updatedUser && selectedUser?.id === updatedUser.id) {
                const userId = updatedUser.id;

                if (userId !== null && userId !== undefined) {
                    setSelectedUser(updatedUser);
                    const libraries = await fetchUserLibraries(userId);

                    setUserLibraries(prev => ({
                        ...prev,
                        [userId]: libraries,
                    }));
                }
            }

            handleCloseDialog();
        } catch (err) {
            showSnackbar('Ошибка при сохранении пользователя', 'error');
        }
    };

    const handleDeleteUser = async (id?: number) => {
        if (!id) return;
        try {
            await axios.delete(`http://localhost:8080/api/v1/users/${id}`);
            showSnackbar('Пользователь удалён', 'success');
            await fetchUsers();
        } catch (err) {
            showSnackbar('Ошибка при удалении пользователя', 'error');
        }
    };

    const handleAddUserToLibrary = async () => {
        if (!selectedUser?.id || selectedLibraryId === -1) return;

        try {
            await axios.post(`http://localhost:8080/api/v1/libraries/${selectedLibraryId}/addUser/${selectedUser.id}`);

            // Находим добавленную библиотеку
            const addedLibrary = libraries.find(lib => lib.id === selectedLibraryId);

            if (addedLibrary) {
                // Немедленно обновляем локальное состояние
                setUserLibraries(prev => ({
                    ...prev,
                    [selectedUser.id as number]: [
                        ...(prev[selectedUser.id as number] || []),
                        { id: addedLibrary.id, name: addedLibrary.name }
                    ]
                }));

                showSnackbar('Пользователь добавлен в библиотеку', 'success');
                setSelectedLibraryId(-1);
            }
        } catch (err: any) {
            showSnackbar('Пользователь уже есть в этой библиотеке', 'error');
        }
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Проверяем, что prevUser не null
        setCurrentUser((prevUser) => prevUser ? {
            ...prevUser,
            [name]: value || '', // Обновляем только при наличии prevUser
        } : null);
    };



    const getAvailableLibraries = (userId: number) => {
        const userLibs = userLibraries[userId] || [];
        return libraries.filter(lib =>
            !userLibs.some(userLib => userLib.id === lib.id)
        );
    };

    return (
        <Box sx={{ padding: '2rem', maxWidth: '1200px' }}>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Person color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h4">Пользователи</Typography>
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog(null)}
                >
                    Добавить пользователя
                </Button>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'primary.main' }}>
                            <TableCell sx={{ paddingRight: 4 }}>
                                <Typography color="common.white">Имя</Typography>
                            </TableCell>
                            <TableCell sx={{ paddingRight: 4 }}>
                                <Typography color="common.white">Email</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography color="common.white">Действия</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell sx={{ paddingRight: 15 }}>{user.username}</TableCell>
                                <TableCell sx={{ paddingRight: 15 }}>{user.email}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Подробнее">
                                        <IconButton onClick={() => handleOpenUserInfo(user)}>
                                            <Info />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Редактировать">
                                        <IconButton onClick={() => handleOpenDialog(user)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить">
                                        <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Диалог добавления/редактирования пользователя */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{currentUser?.id ? 'Редактировать' : 'Добавить'} пользователя</DialogTitle>
                <DialogContent sx={{
                    px: 4,
                    pt: 2,
                    pb: 4,
                    overflowY: 'auto',
                    maxHeight: '70vh',
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Имя пользователя"
                            name="username"
                            value={currentUser?.username || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={currentUser?.email || ''}
                            onChange={handleChange}
                            fullWidth
                        />
                        {!currentUser?.id && (
                            <TextField
                                label="Пароль"
                                name="password"
                                type="password"
                                value={currentUser?.password || ''}
                                onChange={handleChange}
                                fullWidth
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSaveUser} variant="contained">Сохранить</Button>
                </DialogActions>
            </Dialog>

            {/* Диалог с информацией о пользователе */}
            <Dialog open={userInfoDialogOpen} onClose={handleCloseUserInfo} maxWidth="sm" fullWidth>
                <DialogTitle>Информация о пользователе</DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {selectedUser && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                                <Typography variant="subtitle1">Имя пользователя:</Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>{selectedUser.username}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1">Email:</Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>{selectedUser.email}</Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Библиотеки ({selectedUser.id ? (userLibraries[selectedUser.id] || []).length : 0})
                                </Typography>

                                {selectedUser.id && userLibraries[selectedUser.id]?.length ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                        {userLibraries[selectedUser.id].map(lib => (
                                            <Chip
                                                key={lib.id}
                                                label={lib.name}
                                                sx={{ backgroundColor: '#e0e0e0' }}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        Пользователь не состоит ни в одной библиотеке
                                    </Typography>
                                )}
                            </Box>

                            {selectedUser.id && getAvailableLibraries(selectedUser.id).length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Добавить в библиотеку
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Select
                                            value={selectedLibraryId === -1 ? '' : selectedLibraryId}
                                            onChange={(e) => setSelectedLibraryId(Number(e.target.value))}
                                            displayEmpty
                                            sx={{ flexGrow: 1 }}
                                        >
                                            <MenuItem value="" disabled>Выберите библиотеку</MenuItem>
                                            {getAvailableLibraries(selectedUser.id).map(lib => (
                                                <MenuItem key={lib.id} value={lib.id}>{lib.name}</MenuItem>
                                            ))}
                                        </Select>
                                        <Button
                                            variant="contained"
                                            onClick={handleAddUserToLibrary}
                                            disabled={selectedLibraryId === -1}
                                        >
                                            Добавить
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUserInfo}>Закрыть</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UsersPage;