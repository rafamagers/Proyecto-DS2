import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import CheckLog from "../api/getLog.js";
import "./style.css";
function CreateForm() {
  let today = new Date().toISOString().split("T")[0];

  const [image, setImage] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    setLoading(true);

    data.fecha_nacimiento = moment(data.fecha_nacimiento).format("DD-MMM-YYYY");

    console.log(data.fecha_nacimiento);
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }
    //Validar conexión con la api log antes de crear usuario
    try{
      await CheckLog();
    }catch(error){
        Swal.fire({
          title: "Error de conexión",
          text: "No se pudo establecer una conexión con el servidor API Log. Por favor, inténtelo de nuevo más tarde.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      setLoading(false);
      console.error(error);
      return;
    }
    try {
      const response = await axios.post(
        import.meta.env.VITE_CREATE_API+"/createpeople",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      Swal.fire({
        title: "Usuario creado exitosamente",
        html: `El usuario <strong>${data.numero_documento}</strong> ha sido creado exitosamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      setImage(null);
      reset();
    } catch (error) {
      if (error.response) {
        Swal.fire({
          title: "Error al crear el usuario",
          text: `Hubo un error al crear el usuario: ${data.numero_documento}`,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else if (error.request) {
        Swal.fire({
          title: "Error de conexión",
          text: "No se pudo establecer una conexión con el servidor API CREATE. Por favor, inténtelo de nuevo más tarde.",
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

  //fin de controlar la imagen que se sube
  useEffect(() => {
    register("foto");
  }, [register]);
  return (
    <Container>
      <div className="text-center">
        <h1>Registrar Persona</h1>
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
                  required: "Por favor, ingrese el número de documento.",
                  pattern: {
                    value: /^[0-9]{1,10}$/,
                    message:
                      "Ingrese un número de documento válido (hasta 10 dígitos).",
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
                      required: "Por favor, ingrese su primer nombre.",
                      maxLength: {
                        value: 30,
                        message: "El nombre no debe exceder los 30 caracteres.",
                      },
                      pattern: {
                        value: /^(?:[a-zA-ZáéíóúñÁÉÍÓÚÑ]+)$/,
                        message:
                          "Ingrese un nombre válido sin números ni caracteres especiales.",
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
                        message:
                          "El segundo nombre no debe exceder los 30 caracteres.",
                      },
                      pattern: {
                        value: /^(?:[a-zA-ZáéíóúñÁÉÍÓÚÑ]+\s?){1,}$/,
                        message:
                          "Ingrese un segundo nombre válido sin números ni caracteres especiales.",
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
                  required: "Por favor, ingrese sus apellidos.",
                  maxLength: {
                    value: 60,
                    message:
                      "Los apellidos no deben superar los 60 caracteres.",
                  },
                  pattern: {
                    value: /^(?:[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+\s?){1,}$/,
                    message:
                      "Ingrese apellidos válidos utilizando solo letras y espacios.",
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
                  required: "Por favor, ingrese su fecha de nacimiento.",
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
                  required: "Por favor, ingrese su correo electrónico.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Ingrese un correo electrónico válido.",
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
                  required: "Por favor, ingrese su número de celular.",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message:
                      "Ingrese un número de celular válido de 10 dígitos.",
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
                required
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
                "Registrar"
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
  );
}

export default CreateForm;
