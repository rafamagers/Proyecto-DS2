import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import moment from "moment";
import CheckLog from "../api/getLog.js";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
const EditForm = () => {
  let today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({ mode: "onChange" });
  //logica para cargar los datos actuales
  const fetchPerson = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_READ_API+`/get/${id}`, {
        params: {
          edit: true,
        },
      });
      setPerson(response.data.usuario);
      setImage(`data:image/jpeg;base64,${response.data.usuario.foto}`);
      setValue("foto", `${response.data.usuario.foto}`);

      // Luego, cuando recibas los datos de tu petición, puedes establecer los valores de los campos
      setValue("apellidos", response.data.usuario.apellidos);
      setValue("celular", response.data.usuario.celular);
      setValue("correo_electronico", response.data.usuario.correo_electronico);
      setValue(
        "fecha_nacimiento",
        (response.data.fecha_nacimiento = moment(
          response.data.usuario.fecha_nacimiento
        ).format("YYYY-MM-DD"))
      );

      setValue("genero_id", response.data.usuario.genero_id);
      setValue("numero_documento", response.data.usuario.numero_documento);
      setValue("primer_nombre", response.data.usuario.primer_nombre);
      setValue("segundo_nombre", response.data.usuario.segundo_nombre);
      setValue("tipo_documento", response.data.usuario.tipo_documento);
    } catch (error) {
      Swal.fire({
        title: "Error de conexión",
        text: "No se pudo establecer una conexión con el servidor API READ. Por favor, inténtelo de nuevo más tarde.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPerson();
  }, [id]);

  //logica para actualizar
  const onSubmit = async (data) => {
    setLoading(true);
    data.fecha_nacimiento = moment(data.fecha_nacimiento).format("DD-MMM-YYYY");

    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }
    try{
      await CheckLog();
    }catch(error){
        Swal.fire({
          title: "Error de conexión",
          text: "No se pudo establecer una conexión con el servidor API Log. Por favor, inténtelo de nuevo más tarde.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      console.error(error);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        import.meta.env.VITE_UPDATE_API+"/updatepeople",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "Usuario actualizado exitosamente",
        html: `El usuario <strong>${data.numero_documento}</strong> ha sido actualizado exitosamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      setImage(null);
      navigate("/consult");
    } catch (error) {
      if (error.response) {
        Swal.fire({
          title: "Error al actualizar el usuario",
          text: `Hubo un error al actualizar el usuario: ${data.numero_documento}`,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else if (error.request) {
        Swal.fire({
          title: "Error de conexión",
          text: "No se pudo establecer una conexión con el servidor API UPDATE. Por favor, inténtelo de nuevo más tarde.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
      console.error(error);
    }
    setLoading(false);
  };

  //controlar la imagen que se sube
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];

      // Validar el tamaño del archivo (no debe superar los 2 MB)
      if (img.size > 2 * 1024 * 1024) {
        setError("foto", {
          type: "manual",
          message: "El archivo no debe superar los 2 MB",
        });
        e.target.value = null;
        setImage(null);
        return;
      }

      // Validar que el archivo sea de tipo imagen
      if (!img.type.startsWith("image/")) {
        setError("foto", {
          type: "manual",
          message: "El archivo debe ser una imagen",
        });
        e.target.value = null;
        setImage(null);
        return;
      }

      clearErrors("foto");
      setImage(URL.createObjectURL(img));
      setValue("foto", img);
    }
  };

  return (
    <div>
      {person ? (
        <Container>
          <div className="text-center">
            <h1>Editar Persona</h1>
          </div>
          <Row className="justify-content-between form">
            <Col md={8}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formDocumentType">
                  <Form.Label>Tipo de documento</Form.Label>
                  <Form.Control as="select" {...register("tipo_documento")}>
                    <option>Tarjeta de identidad</option>
                    <option>Cédula</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formDocumentNumber">
                  <Form.Label>Nro. Documento</Form.Label>
                  <Form.Control
                    type="text"
                    isInvalid={!!errors.numero_documento}
                    {...register("numero_documento", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[0-9]{1,10}$/,
                        message:
                          "Debe ser un número y no mayor de 10 caracteres",
                      },
                    })}
                  />
                  {errors.numero_documento && (
                    <Form.Control.Feedback type="invalid">
                      {errors.numero_documento.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group controlId="formFirstName">
                      <Form.Label>Primer Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        isInvalid={!!errors.primer_nombre}
                        {...register("primer_nombre", {
                          required: "Este campo es obligatorio",
                          maxLength: {
                            value: 30,
                            message: "No debe ser mayor de 30 caracteres",
                          },
                          pattern: {
                            value: /^(?:[a-zA-ZáéíóúñÁÉÍÓÚÑ]+\s?){1,2}$/,
                            message: "No debe ser un número",
                          },
                        })}
                      />
                      {errors.primer_nombre && (
                        <Form.Control.Feedback type="invalid">
                          {errors.primer_nombre.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="formSecondName">
                      <Form.Label>Segundo Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        isInvalid={!!errors.segundo_nombre}
                        {...register("segundo_nombre", {
                          maxLength: {
                            value: 30,
                            message: "No debe ser mayor de 30 caracteres",
                          },
                          pattern: {
                            value: /^[A-Za-z]+$/,
                            message: "No debe ser un número",
                          },
                        })}
                      />
                      {errors.segundo_nombre && (
                        <Form.Control.Feedback type="invalid">
                          {errors.segundo_nombre.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="formLastName">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    type="text"
                    isInvalid={!!errors.apellidos}
                    {...register("apellidos", {
                      required: "Este campo es obligatorio",
                      maxLength: {
                        value: 60,
                        message: "No debe ser mayor de 60 caracteres",
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "No debe ser un número",
                      },
                    })}
                  />
                  {errors.apellidos && (
                    <Form.Control.Feedback type="invalid">
                      {errors.apellidos.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group controlId="formBirthDate">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    max={today}
                    isInvalid={!!errors.fecha_nacimiento}
                    {...register("fecha_nacimiento", {
                      required: "Este campo es obligatorio",
                    })}
                  />
                  {errors.fecha_nacimiento && (
                    <Form.Control.Feedback type="invalid">
                      {errors.fecha_nacimiento.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group controlId="formGender">
                  <Form.Label>Género</Form.Label>
                  <Form.Control as="select" {...register("genero_id")}>
                    <option>Masculino</option>
                    <option>Femenino</option>
                    <option>No binario</option>
                    <option>Prefiero no reportar</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    isInvalid={!!errors.correo_electronico}
                    {...register("correo_electronico", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Formato de correo electrónico inválido",
                      },
                    })}
                  />
                  {errors.correo_electronico && (
                    <Form.Control.Feedback type="invalid">
                      {errors.correo_electronico.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group controlId="formPhone">
                  <Form.Label>Celular</Form.Label>
                  <Form.Control
                    type="tel"
                    isInvalid={!!errors.celular}
                    {...register("celular", {
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message:
                          "Debe ser un número y tener exactamente 10 caracteres",
                      },
                    })}
                  />
                  {errors.celular && (
                    <Form.Control.Feedback type="invalid">
                      {errors.celular.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Form.Group controlId="formPhoto">
                  <Form.Label>Foto</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    isInvalid={!!errors.foto}
                  />
                  {errors.foto && (
                    <Form.Control.Feedback type="invalid">
                      {errors.foto.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Aquí va el botón de envío */}
                <Button variant="primary" type="submit" className="mt-3 w-100">
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Actualizar"
                  )}
                </Button>
              </Form>
            </Col>

            {/* Aquí va la previsualización de la imagen */}
            {image && (
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                {
                  <div className="text-center">
                    <img
                      src={image}
                      alt="Preview"
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "5px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                        objectFit: "cover",
                      }}
                    />
                    <p className="mt-2 preview-text">
                      Previsualización de la imagen
                    </p>
                  </div>
                  /* Se han añadido estilos para que la previsualización de la imagen tenga bordes redondeados y una sombra */
                }
              </Col>
            )}
          </Row>
        </Container>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
};

export default EditForm;
