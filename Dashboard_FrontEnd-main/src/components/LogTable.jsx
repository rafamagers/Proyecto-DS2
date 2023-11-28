import { Table, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

import "./table.css";
const LogTable = ({ data }) => {
  const getBadgeVariant = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "create":
        return "success";
      case "update":
        return "info";
      case "delete":
        return "danger";
      case "read":
        return "primary";
      default:
        return "secondary";
    }
  };

  return (
    <Table striped>
      <thead>
        <tr>
          <th>Tipo De Transaccion</th>
          <th>Tipo De Documento</th>
          <th>No. Documento</th>
          <th>Fecha de Transaccion</th>
          <th>Descripcion</th>
        </tr>
      </thead>
      <tbody>
        {data.map((log) => (
          <tr key={log._id}>
            <td>
              <Badge bg={getBadgeVariant(log.tipo)}>{log.tipo}</Badge>
            </td>

            <td>{log.tipo_documento}</td>
            <td>{log.numero_documento}</td>
            <td>{log.fecha}</td>
            <td>{log.descripcion}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

LogTable.propTypes = {
  data: PropTypes.array.isRequired,
};

LogTable.propTypes = {
  data: PropTypes.array.isRequired,
};
export default LogTable;
