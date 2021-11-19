import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-kit-react/views/signupPage.js";

import image from "assets/img/cover1.jpg";

import axiosClient from "../../config/axios";
import Alert from '@mui/material/Alert';

const useStyles = makeStyles(styles);

export default function SignupPage(props) {
  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  let history = useHistory();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [session, setSession] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
  });

  const updateSession = (e) => {
    setSession({
      ...session,
      [e.target.id]: e.target.value,
    });
  };

  const register = async () => {
    setLoading(true);
    try {
      setError("");
      const data = {
        email: session.email,
        password: session.password,
        firstName: session.firstName,
        lastName: session.lastName,
        dni: session.dni,
        phone: session.phone,
      }
      const response = await axiosClient.put('/user', data);
      if (response.data.id) {
        props.setIsLogged(true);
        window.localStorage.setItem('token', session.email);
        window.localStorage.setItem('profile', JSON.stringify(response.data));
        history.push("/");
      } else {
        setError("Hubo un error al crear el registro");
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError("Hubo un error al crear el registro");
    }
  }

  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand={"A&A"}
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form} onSubmit={(e) => { e.preventDefault(); register(); }}>
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h4>Registro</h4>
                  </CardHeader>
                  <Button color="success" href={"/login-page"} simple>
                    O ingrese con su cuenta aquí
                  </Button>
                  <CardBody>
                    <CustomInput
                      labelText="Nombre(s)"
                      id="firstName"
                      formControlProps={{
                        fullWidth: true,
                        onChange: updateSession,
                      }}
                      inputProps={{
                        type: "text",
                      }}
                    />
                    <CustomInput
                      labelText="Apellido(s)"
                      id="lastName"
                      formControlProps={{
                        fullWidth: true,
                        onChange: updateSession,
                      }}
                      inputProps={{
                        type: "text",
                      }}
                    />
                    <CustomInput
                      labelText="DNI"
                      id="dni"
                      formControlProps={{
                        fullWidth: true,
                        onChange: updateSession,
                      }}
                      inputProps={{
                        type: "number",
                      }}
                    />
                    <CustomInput
                      labelText="Teléfono"
                      id="phone"
                      formControlProps={{
                        fullWidth: true,
                        onChange: updateSession,
                      }}
                      inputProps={{
                        type: "number",
                      }}
                    />
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                        onChange: updateSession,
                      }}
                      inputProps={{
                        type: "email",
                      }}
                    />
                    <CustomInput
                      labelText="Contraseña"
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                        onChange: updateSession,
                      }}
                      inputProps={{
                        type: "password",
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button color="success" size="lg" type="submit">
                      REGISTRARSE
                    </Button>
                    {error !== '' ?
                      <Alert severity="error">
                        {error}
                      </Alert>
                      : null
                    }
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
