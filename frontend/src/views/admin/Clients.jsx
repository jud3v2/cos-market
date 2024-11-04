import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Modal, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import config from '../../config';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '85%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const Clients = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/admin/users`);
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          setError('Erreur lors de la récupération des utilisateurs');
        }
      } catch (err) {
        setError('Erreur lors de la récupération des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchOrders = async (id, name) => {
    try {
      const response = await axios.get(`${config.backendUrl}/admin/users/${id}/orders`);
      if (response.data.orders) {
        setOrders(response.data.orders);
        setSelectedUser(id);
        setSelectedUserName(name);
        setIsModalOpen(true);
      } else {
        setError('Erreur lors de la récupération des commandes');
      }
    } catch (err) {
      setError('Erreur lors de la récupération des commandes');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 mt-4">
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Liste des clients
      </Typography>

      {/* Conteneur centré pour le tableau */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <TableContainer component={Paper} style={{ maxWidth: '80%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Client</TableCell>
                <TableCell>Pseudo</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Commandes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.roles}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => fetchOrders(user.id, user.name)}
                    >
                      Voir les commandes
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary"><Edit /></IconButton>
                    <IconButton color="secondary"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Modal pour afficher les commandes */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Commande(s) effectuée(s) par : {selectedUserName}
          </Typography>
          {orders.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Commande</TableCell>
                    <TableCell>Prix Total</TableCell>
                    <TableCell>Prix Total TTC</TableCell>
                    <TableCell>Taxe</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Méthode de paiement</TableCell>
                    <TableCell>ID de paiement</TableCell>
                    <TableCell>Adresse du client</TableCell>
                    <TableCell>Date de création</TableCell>
                    <TableCell>Date de modification</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.total_price}</TableCell>
                      <TableCell>{order.total_price_with_tax}</TableCell>
                      <TableCell>{order.tax}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.payment_method}</TableCell>
                      <TableCell>{order.payment_id}</TableCell>
                      <TableCell>{order.client_address}</TableCell>
                      <TableCell>{order.created_at}</TableCell>
                      <TableCell>{order.updated_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center">Cet utilisateur n'a pas encore effectué de commande.</Typography>
          )}
          <Button variant="contained" color="secondary" onClick={closeModal} fullWidth>
            Fermer
          </Button>
        </Box>
      </Modal>

      {/* Snackbar pour les notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Clients;
