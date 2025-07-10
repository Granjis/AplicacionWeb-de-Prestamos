import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { jsPDF } from 'jspdf';

const HistorialPagos = ({ pagos = [], prestamo }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [totalPagado, setTotalPagado] = useState(0);

  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);

  // Actualizar totalPagado cuando los pagos cambian
  useEffect(() => {
    const total = pagos.reduce((acc, pago) => acc + (pago.capital || 0), 0);
    setTotalPagado(total);
  }, [pagos]);

  // Función para calcular el balance acumulado
  const calcularBalance = (index) => {
    let balanceRestante = prestamo.monto;
    // Restar el capital de cada pago hasta el índice actual
    for (let i = 0; i <= index; i++) {
      balanceRestante -= pagos[i].capital || 0;
    }
    return balanceRestante;
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  // Función para generar el PDF
  const handleGenerate = () => {
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text('Historial de Pagos', 14, 20);

    // Agregar encabezados de tabla
    const headers = ['Fecha', 'Capital', 'Interés', 'Total Pago', 'Balance'];

    // Definir el inicio de la tabla
    const startY = 30;
    let currentY = startY;

    // Escribir los encabezados
    doc.setFontSize(12);
    headers.forEach((header, index) => {
      doc.text(header, 14 + index * 40, currentY);
    });

    currentY += 10;

    // Escribir las filas de pagos
    pagos.forEach((pago, index) => {
      doc.text(formatDate(pago?.fecha) || 'N/A', 14, currentY);
      doc.text(`$${(pago?.capital || 0).toLocaleString()}`, 54, currentY);
      doc.text(`$${(pago?.interes || 0).toLocaleString()}`, 94, currentY);
      doc.text(`$${(pago.capital + pago.interes || 0).toLocaleString()}`, 134, currentY);
      doc.text(`$${(calcularBalance(index)).toLocaleString()}`, 174, currentY);

      currentY += 10;
    });

    // Descargar el PDF
    doc.save('historial_de_pagos.pdf');
    setShowConfirmationModal(false);
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th><FormattedMessage id="app.date" defaultMessage="Date" /></th>
            <th><FormattedMessage id="app.capital" defaultMessage="Capital" /></th>
            <th><FormattedMessage id="app.interest" defaultMessage="Interest" /></th>
            <th><FormattedMessage id="app.quantity" defaultMessage="Total Payment" /></th>
            <th><FormattedMessage id="app.balance" defaultMessage="Balance" /></th>
          </tr>
        </thead>
        <tbody>
          {pagos && pagos.length > 0 ? (
            pagos.map((pago, index) => (
              <tr key={index}>
                <td>{formatDate(pago?.fecha) || 'N/A'}</td>
                <td>${(pago?.capital || 0).toLocaleString()}</td>
                <td>${(pago?.interes || 0).toLocaleString()}</td>
                <td>${(pago.capital + pago.interes || 0).toLocaleString()}</td>
                <td>${(calcularBalance(index)).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5"><FormattedMessage id="historial.sinDatos" defaultMessage="No data available" /></td>
            </tr>
          )}
        </tbody>
      </table>
      <Button className="btn buttom-general" onClick={() => setShowConfirmationModal(true)}>
        <FormattedMessage id="historial.tituloBotonGenera" />
      </Button>

      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal} centered>
        <Modal.Header closeButton>
          <Modal.Title><FormattedMessage id="historial.titulo" /></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="btn buttom-general" onClick={handleGenerate}>
            <FormattedMessage id="historial.cerrar" />
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HistorialPagos;
