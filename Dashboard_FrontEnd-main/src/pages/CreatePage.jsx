import CreateForm from "../components/CreateForm";
import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Spinner, Pagination } from "react-bootstrap";
import CheckCreate from "../api/getCreate.js";
const CreatePage = () => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  //fin de codigo para filtrar los datos por documento
  const fetchPeople = async () => {
    
    setLoading(true);
    try {
      const response = await CheckCreate();
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchPeople();
    setReload(false);
  }, [reload]);
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
          <strong>Hubo un error al conectarse a la API CREATE.</strong>

          <Button
            variant="info"
            type="button"
            className="mt-3"
            onClick={() => {
              setError(null);
              fetchPeople();
            }}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }
  return (
    <>
      <Container className="mt-5 ">
        <Row>
          <Col className="col-12 mx-auto">
            <CreateForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreatePage;
