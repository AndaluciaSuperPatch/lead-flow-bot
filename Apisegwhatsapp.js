// Ejemplo de endpoint para registrar ventas
app.post('/api/register-sale', (req, res) => {
  const { customer, product, amount, source } = req.body;
  
  // Registrar en base de datos
  db.query('INSERT INTO sales SET ?', {
    customer, 
    product,
    amount,
    source,
    date: new Date(),
    status: 'completed'
  });
  
  // Enviar notificación en tiempo real
  io.emit('new-sale', { customer, product, amount });
  
  res.status(200).json({ success: true });
});