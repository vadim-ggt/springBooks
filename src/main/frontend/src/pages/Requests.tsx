// src/pages/Requests.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Tooltip, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Snackbar, Alert, Select, MenuItem
} from '@mui/material';
import { Edit, Delete, Book, Add } from '@mui/icons-material';
import { format } from 'date-fns';

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
}

interface User {
    id: number;
    username: string;
    email: string;
}

interface Request {
    id?: number;
    book?: Book | null;
    user?: User | null;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    status: string;
}

const STATUSES = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "ACTIVE", "RETURNED", "OVERDUE"];

const RequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState<number | "">("");
    const [selectedUserId, setSelectedUserId] = useState<number | "">("");
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("");

    useEffect(() => {
        fetchRequests();
        fetchBooks();
        fetchUsers();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get<Request[]>('http://localhost:8080/api/v1/requests');
            setRequests(res.data);
        } catch {
            setError('Ошибка при загрузке заявок');
        }
    };

    const fetchBooks = async () => {
        try {
            const res = await axios.get<Book[]>('http://localhost:8080/api/v1/books');
            setBooks(res.data);
        } catch {
            setError('Ошибка при загрузке книг');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get<User[]>('http://localhost:8080/api/v1/users');
            setUsers(res.data);
        } catch {
            setError('Ошибка при загрузке пользователей');
        }
    };

    const handleCreateRequest = async () => {
        if (!selectedBookId || !selectedUserId) return;
        try {
            await axios.post(`http://localhost:8080/api/v1/requests/create/${selectedBookId}/${selectedUserId}`);
            fetchRequests();
            setSnackbarMessage('Заявка успешно создана');
            setSnackbarOpen(true);
        } catch {
            setError('Ошибка при создании заявки');
        }
        setDialogOpen(false);
    };

    const handleDeleteRequest = async (id?: number) => {
        if (!id) return;
        try {
            await axios.delete(`http://localhost:8080/api/v1/requests/${id}`);
            fetchRequests();
            setSnackbarMessage('Заявка успешно удалена');
            setSnackbarOpen(true);
        } catch {
            setError('Ошибка при удалении заявки');
        }
    };

    const handleOpenStatusDialog = (request: Request) => {
        setSelectedRequest(request);
        setSelectedStatus(request.status);
        setStatusDialogOpen(true);
    };

    const handleChangeStatus = async () => {
        if (!selectedRequest?.id) return;
        try {
            await axios.patch(`http://localhost:8080/api/v1/requests/${selectedRequest.id}/status`, null, {
                params: { status: selectedStatus }
            });
            fetchRequests();
            setSnackbarMessage('Статус обновлён');
            setSnackbarOpen(true);
        } catch {
            setError('Ошибка при обновлении статуса');
        }
        setStatusDialogOpen(false);
    };

    const formatDate = (dateString: string | null) => {
        return dateString ? format(new Date(dateString), 'dd.MM.yyyy') : 'Не указано';
    };

    return (
        <Box sx={{ padding: '2rem', maxWidth: '1200px' }}>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Book color="primary" sx={{ fontSize: 40 }} />
                            <Typography variant="h4">Заявки</Typography>
                        </Box>
                        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
                            Сделать заявку
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'primary.main' }}>
                            <TableCell sx={{ color: 'common.white' }}>Книга</TableCell>
                            <TableCell sx={{ color: 'common.white' }}>Дата начала</TableCell>
                            <TableCell sx={{ color: 'common.white' }}>Дата окончания</TableCell>
                            <TableCell sx={{ color: 'common.white' }}>Статус</TableCell>
                            <TableCell sx={{ color: 'common.white', textAlign: 'right' }}>Действия</TableCell> {/* Сдвигаем в право */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.book ? request.book.title : 'Без книги'}</TableCell>
                                <TableCell>{formatDate(request.startDate)}</TableCell>
                                <TableCell>{formatDate(request.endDate)}</TableCell>
                                <TableCell>{request.status}</TableCell>
                                <TableCell sx={{ textAlign: 'right' }}> {/* Сдвигаем в право */}
                                    <Tooltip title="Изменить статус">
                                        <IconButton onClick={() => handleOpenStatusDialog(request)}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить">
                                        <IconButton color="error" onClick={() => handleDeleteRequest(request.id)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
                sx={{
                    '& .MuiDialog-paper': {
                        minHeight: '300px'
                    }
                }}
            >
                <DialogTitle>Сделать заявку</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
                    <Select
                        value={selectedBookId}
                        onChange={(e) => setSelectedBookId(Number(e.target.value))}
                        displayEmpty
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="" disabled>Выберите книгу</MenuItem>
                        {books.map(book => (
                            <MenuItem key={book.id} value={book.id}>{book.title}</MenuItem>
                        ))}
                    </Select>

                    <Select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(Number(e.target.value))}
                        displayEmpty
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="" disabled>Выберите пользователя</MenuItem>
                        {users.map(user => (
                            <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
                    <Button variant="contained" onClick={handleCreateRequest}>Сохранить</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={statusDialogOpen}
                onClose={() => setStatusDialogOpen(false)}
                fullWidth  // Добавляем это свойство для максимальной ширины
                maxWidth="sm"  // Устанавливаем максимальную ширину (sm = 600px)
                sx={{
                    '& .MuiDialog-paper': {
                        minHeight: '300px'  // Устанавливаем минимальную высоту
                    }
                }}
            >
                <DialogTitle>Изменить статус</DialogTitle>
                <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        fullWidth
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {STATUSES.map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleChangeStatus} variant="contained">Сохранить</Button>
                </DialogActions>
            </Dialog>

            {error && <Alert severity="error">{error}</Alert>}

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
        </Box>
    );
};

export default RequestsPage;
