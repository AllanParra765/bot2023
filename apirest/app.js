const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

const contactos = []; // Array para almacenar los contactos (simulando una base de datos)

// Ruta para obtener todos los contactos
app.get('/api/contactos', (req, res) => {
  res.json(contactos);
});

// Ruta para obtener un contacto por su ID
app.get('/api/contactos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contacto = contactos.find(c => c.id === id);

  if (contacto) {
    res.json(contacto);
  } else {
    res.status(404).json({ error: 'Contacto no encontrado.' });
  }
});

// Ruta para crear un nuevo contacto
app.post('/api/contactos', (req, res) => {
  const nuevoContacto = req.body;
  nuevoContacto.id = contactos.length + 1; // Generar un ID único
  contactos.push(nuevoContacto);

  res.status(201).json(nuevoContacto);
});

// Ruta para actualizar un contacto por su ID
app.put('/api/contactos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contactoIndex = contactos.findIndex(c => c.id === id);

  if (contactoIndex !== -1) {
    contactos[contactoIndex] = { ...contactos[contactoIndex], ...req.body };
    res.json(contactos[contactoIndex]);
  } else {
    res.status(404).json({ error: 'Contacto no encontrado.' });
  }
});

// Ruta para eliminar un contacto por su ID
app.delete('/api/contactos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contactoIndex = contactos.findIndex(c => c.id === id);

  if (contactoIndex !== -1) {
    const contactoEliminado = contactos.splice(contactoIndex, 1);
    res.json(contactoEliminado[0]);
  } else {
    res.status(404).json({ error: 'Contacto no encontrado.' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
