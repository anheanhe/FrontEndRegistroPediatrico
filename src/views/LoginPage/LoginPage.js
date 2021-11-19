import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
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
import { useHistory } from "react-router";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/cover1.jpg";

import axiosClient from "../../config/axios";
import Alert from '@mui/material/Alert';

const useStyles = makeStyles(styles);

export default function LoginPage(props) {

  let history = useHistory();

  const [cardAnimaton, setCardAnimation] = useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [session, setSession] = useState({
    username: "",
    password: "",
  });

  const updateSession = (e) => {
    setSession({
      ...session,
      [e.target.name]: e.target.value,
    });
  };

  const login = async () => {
    setLoading(true);
    try {
      setError("");
      const data = {
        email: session.username,
        password: session.password,
      }
      const response = await axiosClient.post('/login', data);
      if (response.data.id) {
        props.setIsLogged(true);
        window.localStorage.setItem('token', session.username);
        window.localStorage.setItem('profile', JSON.stringify(response.data));
        history.push("/");
      } else {
        setError("Credenciales inválidas");
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError("Credenciales inválidas");
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
                <form className={classes.form} onSubmit={(e) => { e.preventDefault(); login(); }}>
                  <CardHeader color="info" className={classes.cardHeader}>
                    <h4>Ingreso</h4>
                  </CardHeader>
                  <Button
                    color="success"
                    size="lg"
                    href={"/signup-page"}
                    simple
                  >
                    O registre su cuenta aquí
                  </Button>
                  <CardBody>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "email",
                        onChange: updateSession,
                        name: "username",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <CustomInput
                      labelText="Contraseña"
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "password",
                        onChange: updateSession,
                        name: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                      }}
                    />
                  </CardBody>
                  <Button color="warning" size="lg" simple>
                    Olvidé mi contraseña
                  </Button>
                  <CardFooter className={classes.cardFooter}>
                    <Button color="success" type="submit" size="lg" disabled={loading}>
                      INGRESAR
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
