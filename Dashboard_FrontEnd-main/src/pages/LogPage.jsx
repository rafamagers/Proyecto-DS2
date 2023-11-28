import { useEffect, useState, useMemo } from "react";

import LogTable from "../components/LogTable";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Spinner, Pagination } from "react-bootstrap";
import { Form, Alert } from "react-bootstrap";
import getLog from "../api/getLog.js";
import moment from "moment";

const LogPage = () => {
  const [logs, setLogs] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState("");
  const [tipoFilter, setTipoFilter] = useState("");
  const [fechaFilter, setfechaFilter] = useState("");

  const elementosPorPagina = 10;

  //codigo para filtrar los datos por documento

  //fin de codigo para filtrar los datos por documento
  const fetchLog = async () => {
    setLoading(true);
    try {
      const response = await getLog();
      //setLogs(response);
      //production

      setLogs(response.registros);
      console.log();
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchLog();
    setReload(false);
  }, [reload]);

  // Agrega un nuevo estado para el filtro de tipo_documento
  const elementsToShow = useMemo(() => {
    if (
      logs &&
      (filter !== "" || tipoFilter !== "Seleccionar" || fechaFilter !== "")
    ) {
      return logs.filter(
        (log) =>
          log.numero_documento.includes(filter) &&
          (tipoFilter === "Seleccionar" ||
            log.tipo_documento.includes(tipoFilter)) &&
          (fechaFilter === "" || (log.fecha && log.fecha === fechaFilter))
      );
    } else {
      return logs;
    }
  }, [filter, tipoFilter, fechaFilter, logs]);

  // Calcular los elementos que se deben mostrar en la página actual
  const currentElements = useMemo(() => {
    if (!elementsToShow) {
      return [];
    }
    const indexOfLastElement = currentPage * elementosPorPagina;
    const indexOfFirstElement = indexOfLastElement - elementosPorPagina;

    return elementsToShow.slice(indexOfFirstElement, indexOfLastElement);
  }, [elementsToShow, currentPage, elementosPorPagina]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "2em",
          color: "red",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "2em",
            color: "red",
          }}
        >
          <strong>Hubo un error al conectarse con la API del Log.</strong>

          <Button
            variant="info"
            type="button"
            className="mt-3"
            onClick={() => {
              setError(null);

              fetchLog();
            }}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Crear los items de paginación
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(elementsToShow.length / elementosPorPagina);
    i++
  ) {
    if (
      i === currentPage ||
      i === currentPage - 1 ||
      i === currentPage + 1 ||
      i === 1 ||
      i === Math.ceil(elementsToShow.length / elementosPorPagina)
    ) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push(<Pagination.Ellipsis key={pageNumbers.length + 1} />);
    }
  }

  return (
    <Container className="mt-5" fluid={true}>
      <Row className="mb-3">
        <Col className="col-12 mx-auto">
          <h1 className="text-center">Consultar Logs</h1>
        </Col>
      </Row>
      <Row>
        <Col className="col-3 my-3">
          <Form.Group controlId="formDocumentNumber">
            <Form.Label>Buscar Documento</Form.Label>
            <Form.Control
              type="text"
              value={filter}
              isInvalid={!isValid}
              onChange={(e) => {
                if (!/^[0-9]*$/.test(e.target.value)) {
                  setIsValid(false);
                } else {
                  setIsValid(true);
                }
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Form.Group>
        </Col>
        <Col className="col-3 my-3">
          <Form.Group controlId="formDocumentType">
            <Form.Label>Tipo de documento</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setTipoFilter(e.target.value)}
            >
              <option>Seleccionar</option>
              <option>Tarjeta de identidad</option>
              <option>Cédula</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col className="col-3 my-3">
          <Form.Group controlId="formBirthDate">
            <Form.Label>Fecha de Transaccion</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => {
                const date = e.target.value;
                if (date === "") {
                  // Aquí es donde manejas el caso cuando la fecha se borra
                  setfechaFilter(""); // Asume que setFechaFilter actualiza tu estado de fechaFilter
                } else {
                  setfechaFilter(moment(date).format("DD-MMM-YYYY"));
                }
              }}
            />
          </Form.Group>
        </Col>

        <Col className="col-12 mx-auto">
          <LogTable data={currentElements} />

          {currentElements.length === 0 && (
            <Alert variant="info">No se encontraron resultados</Alert>
          )}
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() =>
                setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)
              }
              disabled={currentPage === 1}
            />
            {pageNumbers}
            <Pagination.Next
              onClick={() => {
                console.logs(elementsToShow.length);
                setCurrentPage(
                  currentPage <
                    Math.ceil(elementsToShow.length / elementosPorPagina)
                    ? currentPage + 1
                    : currentPage
                );
              }}
              disabled={
                currentPage ===
                Math.ceil(elementsToShow.length / elementosPorPagina)
              }
            />
            <Pagination.Last
              onClick={() =>
                setCurrentPage(
                  Math.ceil(elementsToShow.length / elementosPorPagina)
                )
              }
              disabled={
                currentPage ===
                Math.ceil(elementsToShow.length / elementosPorPagina)
              }
            />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default LogPage;
