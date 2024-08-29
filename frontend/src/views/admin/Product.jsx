import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, List, ListItem, Fade, Tooltip } from '@mui/material';
import { Delete, Edit, Info } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    price: '',
    type: 'skin',
    item_id: '',
    usage: '',
    description: '',
    isActive: true,
    stock: 1,
  });
  const [editProduct, setEditProduct] = useState({
    price: '',
    usage: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    fetchProducts();
    fetchSkins();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/product');
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError('Erreur lors de la récupération des produits');
      }
    } catch (err) {
      setError('Erreur lors de la récupération des produits');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkins = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/skin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSkins(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des skins', err);
      setError('Erreur lors de la récupération des skins');
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/product', newProduct);
      setProducts([...products, response.data]);
      setSnackbar({ open: true, message: 'Produit ajouté avec succès', severity: 'success' });
      closeAddModal();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du produit');
      setSnackbar({ open: true, message: 'Erreur lors de l\'ajout du produit', severity: 'error' });
    }
  };

  const handleEditProduct = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/product/${selectedProduct.id}`, {
        ...selectedProduct,
        price: editProduct.price,
        usage: editProduct.usage
      });
      setProducts(products.map(prod => prod.id === selectedProduct.id ? response.data : prod));
      setSnackbar({ open: true, message: 'Produit modifié avec succès', severity: 'success' });
      closeEditModal();
    } catch (err) {
      console.error('Erreur lors de la modification du produit');
      setSnackbar({ open: true, message: 'Erreur lors de la modification du produit', severity: 'error' });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/product/${selectedProduct.id}`);
      setProducts(products.filter(prod => prod.id !== selectedProduct.id));
      setSnackbar({ open: true, message: 'Produit supprimé avec succès', severity: 'success' });
      closeDeleteModal();
    } catch (err) {
      console.error('Erreur lors de la suppression du produit');
      setSnackbar({ open: true, message: 'Erreur lors de la suppression du produit', severity: 'error' });
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditProduct({
      price: product.price,
      usage: product.usage
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      slug: '',
      price: '',
      type: 'skin',
      item_id: '',
      usage: '',
      description: '',
      isActive: true,
      stock: 1,
    });
    setSelectedSkin(null);
  };

  const handleSkinSelect = (skin) => {
    setNewProduct({
      ...newProduct,
      name: skin.name,
      slug: skin.slug,
      item_id: skin.cs_go_id,
      description: skin.description
    });
    setSelectedSkin(skin);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Liste des produits
      </Typography>
      <Box display="flex" justifyContent="center" mb={4}>
        <Button variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)}>
          Ajouter un produit
        </Button>
      </Box>

      <TableContainer component={Paper} className="mt-4" sx={{ maxWidth: '80%', margin: '0 auto', borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Actif</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>ID d'item</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.slug}</TableCell>
                <TableCell>{product.price} €</TableCell>
                <TableCell>
                  {product.isActive ? (
                    <Tooltip title="Disponible">
                      <Info color="primary" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Indisponible">
                      <Info color="secondary" />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>{product.item_id}</TableCell>
                <TableCell>
                  <Tooltip title="Modifier">
                    <IconButton color="primary" onClick={() => openEditModal(product)}><Edit /></IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton color="secondary" onClick={() => openDeleteModal(product)}><Delete /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal d'ajout de produit */}
      <Modal open={isAddModalOpen} onClose={closeAddModal} closeAfterTransition>
        <Fade in={isAddModalOpen}>
          <Box sx={style}>
            <Typography variant="h6" component="h2">Ajouter un produit</Typography>
            <TextField
              label="Rechercher un skin"
              fullWidth
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <List sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #ccc', borderRadius: 1 }}>
              {skins
                .filter((skin) => skin.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((skin) => (
                  <ListItem button key={skin.id} onClick={() => handleSkinSelect(skin)}>
                    {skin.name}
                  </ListItem>
                ))}
            </List>
            {selectedSkin && (
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Usure min:</strong> {selectedSkin.min_float} | <strong>Usure max:</strong> {selectedSkin.max_float}
              </Typography>
            )}
            <TextField label="Nom" fullWidth margin="normal" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            <TextField label="Prix" fullWidth margin="normal" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
            <TextField label="Usure" fullWidth margin="normal" value={newProduct.usage} onChange={(e) => setNewProduct({ ...newProduct, usage: e.target.value })} />
            <Button variant="contained" color="primary" fullWidth onClick={handleAddProduct}>Ajouter</Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de modification de produit */}
      <Modal open={isEditModalOpen} onClose={closeEditModal} closeAfterTransition>
        <Fade in={isEditModalOpen}>
          <Box sx={style}>
            <Typography variant="h6" component="h2">Modifier le produit</Typography>
            {selectedProduct?.skin && (
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Usure min:</strong> {selectedProduct.skin.min_float} | <strong>Usure max:</strong> {selectedProduct.skin.max_float}
              </Typography>
            )}
            <TextField label="Prix" fullWidth margin="normal" type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
            <TextField label="Usure" fullWidth margin="normal" value={editProduct.usage} onChange={(e) => setEditProduct({ ...editProduct, usage: e.target.value })} />
            <Button variant="contained" color="primary" fullWidth onClick={handleEditProduct}>Enregistrer</Button>
          </Box>
        </Fade>
      </Modal>

      {/* Modal de suppression de produit */}
      <Modal open={isDeleteModalOpen} onClose={closeDeleteModal} closeAfterTransition>
        <Fade in={isDeleteModalOpen}>
          <Box sx={style}>
            <Typography variant="h6" component="h2">Confirmer la suppression</Typography>
            <Typography>Êtes-vous sûr de vouloir supprimer ce produit ?</Typography>
            <Button variant="contained" color="error" fullWidth onClick={handleDeleteProduct} sx={{ mt: 2 }}>Supprimer</Button>
            <Button variant="outlined" color="primary" fullWidth onClick={closeDeleteModal} sx={{ mt: 2 }}>Annuler</Button>
          </Box>
        </Fade>
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

export default Products;
