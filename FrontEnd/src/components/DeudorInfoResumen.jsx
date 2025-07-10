import React from 'react';
import "./styles/deudorInfoResumen.css";
import { FormattedMessage } from 'react-intl';

function DeudorInfoResumen(props) {
    return (
        <div className="deudor-informacion-resumen">
            <h2><FormattedMessage id="resumen.titulo" /></h2>
            <table>
                <tbody>
                    <tr>
                        <th><FormattedMessage id="resumen.nombre" /></th>
                        <th><FormattedMessage id="resumen.apellido" /></th>
                        <th><FormattedMessage id="resumen.identificacion" /></th>
                        <th><FormattedMessage id="resumen.deudaActual" /></th>
                    </tr>
                    <tr>
                        <td>{props.deudor.nombre}</td>
                        <td>{props.deudor.apellido}</td>
                        <td>{props.deudor.identificacion}</td>
                        <td>${props.deudor.deuda}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DeudorInfoResumen;