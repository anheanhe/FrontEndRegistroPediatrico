import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Alert from '@mui/material/Alert';

// @material-ui/icons
import LockIcon from "@material-ui/icons/Lock";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import AddCircleIcon from "@material-ui/icons/AddCircle";
// core components
import Header from "components/Header/Header.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import Footer from "components/Footer/Footer";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";
import { useHistory } from "react-router";

import styles from "assets/jss/material-kit-react/views/profilePage.js";

import axiosClient from "../../config/axios";

import VaccineCalendar from "../../assets/img/calendario-vacunacion.jpg"

// Percentile Graph
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const useStyles = makeStyles(styles);

const data = [
  {
    name: "0",
    uv: 2.5,
    pv: 2.3,
  },
  {
    name: "3",
    uv: 5,
    pv: 3,
  },
  {
    name: "6",
    uv: 6,
    pv: 4,
  },
  {
    name: "9",
    uv: 8,
    pv: 7,
  },
  {
    name: "12",
    uv: 9,
    pv: 9.4,
  },
  {
    name: "15",
    uv: 9.5,
    pv: 10,
  },
  {
    name: "18",
    uv: 10,
    pv: 11,
  }
];

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function Row(props) {
  const { checkupData } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">{checkupData.date}</TableCell>
        <TableCell align="center">{checkupData.weight}</TableCell>
        <TableCell align="center">{checkupData.height}</TableCell>
        <TableCell align="center">{checkupData.headSize}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0 }}>
              <Button color="info" simple>
                Más detalles
              </Button>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Observaciones"
                    secondary={checkupData.observation}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Medicamento(s)"
                    secondary={checkupData.medicineName}
                  />
                  <ListItemText primary="Dosis" secondary={checkupData.medicineAmount} />
                  <ListItemText primary="Período" secondary={checkupData.dose} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Estudios a realizar"
                    secondary={checkupData.test}
                  />
                  <ListItemText
                    primary="Resultados"
                    secondary={checkupData.testResult}
                  />
                </ListItem>
              </List>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function ProfilePage(props) {
  const [classicModal1, setClassicModal1] = useState(false);
  const [classicModal2, setClassicModal2] = useState(false);
  const [classicModal3, setClassicModal3] = useState(false);
  const classes = useStyles();
  const { ...rest } = props;
  const [expanded, setExpanded] = useState("panel1");

  let history = useHistory();

  const [profile, setProfile] = useState(JSON.parse(window.localStorage.getItem('profile')));

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const logout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('profile');
    props.setIsLogged(false);
  }

  const [loading, setLoading] = useState(false);

  // AddChild

  const [childError, setChildError] = useState("");

  const [newChild, setNewChild] = useState({
    name: "",
    diseases: "",
    birthDate: "2020-01-01",
    bloodType: "",
    alergies: "",
    vaccines: [],
    checkups: []
  })

  const updateNewChild = (e) => {
    setNewChild({
      ...newChild,
      [e.target.id]: e.target.value,
    });
  };

  const addChild = async () => {
    setLoading(true);
    try {
      setChildError("");
      const data = {
        email: profile.email,
        name: newChild.name,
        diseases: newChild.diseases,
        birthDate: newChild.birthDate,
        bloodType: newChild.bloodType,
        alergies: newChild.alergies
      }
      console.log(data)
      const response = await axiosClient.put('/child', data);
      if (response.data.id) {
        let newProfileData = { ...profile }
        newProfileData.children ? newProfileData.children.push(newChild) : newProfileData.children = [newChild]
        window.localStorage.setItem('profile', JSON.stringify(newProfileData));
        setLoading(false);
        window.location.reload(true);
      } else {
        setChildError("Error al agregar");
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      setChildError("Error al agregar");
    }
  }


  // Checkup
  const [currentChild, setCurrentChild] = useState(profile.children ? profile.children[0].name : "");
  const [currentChildArrayPosition, setCurrentChildArrayPosition] = useState(0);
  const [checkupError, setCheckupError] = useState("");

  const [newCheckup, setNewCheckup] = useState({
    date: "",
    weight: "",
    height: "",
    headSize: "",
    observation: "",
    test: "",
    testResult: "",
    medicineName: "",
    medicineAmount: "",
    dose: ""
  });

  const updateNewCheckup = (e) => {
    setNewCheckup({
      ...newCheckup,
      [e.target.id]: e.target.value,
    });
  };

  const addCheckup = async () => {
    setLoading(true);
    try {
      setCheckupError("");
      const data = {
        email: profile.email,
        name: currentChild,
        date: newCheckup.date,
        weight: newCheckup.weight,
        height: newCheckup.height,
        headSize: newCheckup.headSize,
        observation: newCheckup.observation,
        test: newCheckup.test,
        testResult: newCheckup.testResult,
        medicineName: newCheckup.medicineName,
        medicineAmount: newCheckup.medicineAmount,
        dose: newCheckup.dose
      }
      console.log(data)
      const response = await axiosClient.put('/checkup', data);
      if (response.data.id) {
        let newProfileData = { ...profile }
        newProfileData.children[currentChildArrayPosition].checkups.push(newCheckup)
        window.localStorage.setItem('profile', JSON.stringify(newProfileData));
        setLoading(false);
      } else {
        setCheckupError("Error al agregar el registro");
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      setCheckupError("Error al agregar el registro");
    }
  }

  // AddVaccine

  const [vaccineError, setVaccineError] = useState("");

  const [newVaccine, setNewVaccine] = useState({
    date: "",
    place: "",
    name: "",
  });

  const updateNewVaccine = (e) => {
    setNewVaccine({
      ...newVaccine,
      [e.target.id]: e.target.value,
    });
  };

  const addVaccine = async () => {
    setLoading(true);
    try {
      setVaccineError("");
      const data = {
        email: profile.email,
        name: currentChild,
        date: newVaccine.date,
        place: newVaccine.place,
        vaccineName: newVaccine.name,
      }
      console.log(data)
      const response = await axiosClient.put('/vaccine', data);
      if (response.data.id) {
        let newProfileData = { ...profile }
        newProfileData.children[currentChildArrayPosition].vaccines.push(newVaccine)
        window.localStorage.setItem('profile', JSON.stringify(newProfileData));
        setNewVaccine({
          date: "",
          place: "",
          name: "",
        });
        setLoading(false);
      } else {
        setVaccineError("Error al agregar la vacuna");
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      setVaccineError("Error al agregar la vacuna");
    }
  }

  // Load child data

  function childrenTabs() {
    let childMap = profile.children ? profile.children.map((child, index) => (
      {
        tabButton: child.name,
        tabContent: (
          <GridContainer justify="center">
            <GridItem>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <Typography>Datos personales</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Card>
                    <CardHeader color="success">
                      <h4 className={classes.cardtypeWhite}>
                        Información
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={4}>
                          <TextField
                            id="birthDate"
                            type="date"
                            label="Fecha de nacimiento"
                            defaultValue={child.birthDate}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <TextField
                            id="blood-type"
                            label="Grupo Sanguíneo"
                            variant="standard"
                            defaultValue={child.bloodType}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <TextField
                            id="alergies"
                            label="Alergias"
                            variant="standard"
                            defaultValue={child.alergies}
                            fullWidth
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <TextField
                            id="diseases"
                            label="Enfermedades crónicas y/o patologías"
                            variant="standard"
                            defaultValue={child.diseases}
                            fullWidth
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  aria-controls="panel2d-content"
                  id="panel2d-header"
                >
                  <Typography>Control pediátrico</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Card>
                    <CardHeader color="success">
                      <Button
                        color="transparent"
                        simple
                        onClick={() => { setClassicModal2(true); setCurrentChild(child.name); setCurrentChildArrayPosition(index) }}
                      >
                        <AddCircleIcon
                          className={classes.icons}
                        />
                        Registrar nuevo control
                      </Button>
                      <Dialog
                        classes={{
                          root: classes.center,
                          paper: classes.modal,
                        }}
                        open={classicModal2}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setClassicModal2(false)}
                        aria-labelledby="classic-modal-slide-type"
                        aria-describedby="classic-modal-slide-description"
                      >
                        <DialogContent
                          id="classic-modal-slide-description"
                          className={classes.modalBody}
                        >
                          <Card>
                            <CardHeader color="info">
                              <h4
                                className={classes.cardtypeWhite}
                              >
                                Nuevo control pediátrico
                              </h4>
                            </CardHeader>
                            <CardBody>
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={4}>
                                  <TextField
                                    id="date"
                                    label="Fecha"
                                    margin="dense"
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                              </GridContainer>
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={4}>
                                  <TextField
                                    id="weight"
                                    label="Peso (kg)"
                                    fullWidth
                                    margin="dense"
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                  <TextField
                                    id="height"
                                    label="Altura (cm)"
                                    fullWidth
                                    margin="dense"
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                  <TextField
                                    id="headSize"
                                    label="Circ. cefálica (cm)"
                                    fullWidth
                                    margin="dense"
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                              </GridContainer>
                              <br></br>
                              <Divider
                                variant="middle"
                              />
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                  <TextField
                                    id="observation"
                                    label="Observaciones"
                                    margin="dense"
                                    fullWidth
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                              </GridContainer>
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                  <TextField
                                    id="test"
                                    label="Estudios a realizar"
                                    margin="dense"
                                    fullWidth
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                  <TextField
                                    id="testResult"
                                    label="Resultados de estudios"
                                    margin="dense"
                                    fullWidth
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                              </GridContainer>
                              <br></br>
                              <Divider
                                variant="middle"
                              />
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={4}>
                                  <TextField
                                    id="medicineName"
                                    label="Medicamento(s)"
                                    margin="dense"
                                    fullWidth
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                  <TextField
                                    id="medicineAmount"
                                    label="Dosis"
                                    margin="dense"
                                    fullWidth
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={4}>
                                  <TextField
                                    id="dose"
                                    label="Período"
                                    margin="dense"
                                    fullWidth
                                    onChange={updateNewCheckup}
                                  />
                                </GridItem>
                              </GridContainer>
                            </CardBody>
                            <CardFooter>
                              <Button disabled={loading} onClick={addCheckup}>
                                Confirmar
                              </Button>
                              {checkupError !== '' ?
                                <Alert severity="error">
                                  {checkupError}
                                </Alert>
                                : null
                              }
                            </CardFooter>
                          </Card>
                        </DialogContent>
                        <DialogActions
                          className={classes.modalFooter}
                        >
                          <Button
                            onClick={() =>
                              setClassicModal2(false)
                            }
                            color="danger"
                            simple
                          >
                            Cerrar
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </CardHeader>
                    <CardBody>
                      <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                          <TableHead>
                            <TableRow>
                              <TableCell />
                              <TableCell align="center">
                                Fecha
                              </TableCell>
                              <TableCell align="center">
                                Peso (kg)
                              </TableCell>
                              <TableCell align="center">
                                Altura (cm)
                              </TableCell>
                              <TableCell align="center">
                                Circunf. cefálica (cm)
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {child.checkups.map((checkupData, index) => (
                              <Row key={index} checkupData={checkupData} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <Typography>Vacunación</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Card>
                    <CardHeader color="success">
                      <Button
                        color="transparent"
                        simple
                        onClick={() => { setClassicModal3(true); setCurrentChild(child.name); setCurrentChildArrayPosition(index) }}
                      >
                        <AddCircleIcon
                          className={classes.icons}
                        />
                        Registrar vacuna aplicada
                      </Button>
                      <Dialog
                        classes={{
                          root: classes.center,
                          paper: classes.modal,
                        }}
                        open={classicModal3}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setClassicModal3(false)}
                        aria-labelledby="classic-modal-slide-type"
                        aria-describedby="classic-modal-slide-description"
                      >
                        <DialogContent
                          id="classic-modal-slide-description"
                          className={classes.modalBody}
                        >
                          <Card>
                            <CardHeader color="info">
                              <h4
                                className={classes.cardtypeWhite}
                              >
                                Nueva aplicación
                              </h4>
                            </CardHeader>
                            <CardBody>
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                  <TextField
                                    id="name"
                                    label="Vacuna"
                                    variant="standard"
                                    defaultValue=""
                                    onChange={updateNewVaccine}
                                  />
                                </GridItem>
                              </GridContainer>
                              <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                  <TextField
                                    id="date"
                                    label="fecha"
                                    defaultValue=""
                                    fullWidth
                                    margin="dense"
                                    onChange={updateNewVaccine}
                                  />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={6}>
                                  <TextField
                                    id="place"
                                    label="Lugar"
                                    defaultValue=""
                                    fullWidth
                                    margin="dense"
                                    onChange={updateNewVaccine}
                                  />
                                </GridItem>
                              </GridContainer>
                            </CardBody>
                            <CardFooter>
                              <Button disabled={loading} onClick={addVaccine}>
                                Confirmar
                              </Button>
                              {vaccineError !== '' ?
                                <Alert severity="error">
                                  {vaccineError}
                                </Alert>
                                : null
                              }
                            </CardFooter>
                          </Card>
                        </DialogContent>
                        <DialogActions
                          className={classes.modalFooter}
                        >
                          <Button
                            onClick={() =>
                              setClassicModal3(false)
                            }
                            color="danger"
                            simple
                          >
                            Cerrar
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </CardHeader>
                    <CardBody>
                      <img src={VaccineCalendar} alt="Calendario de vacunacion" width="100%" />
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 650 }}
                          size="small"
                          aria-label="a dense table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Fecha</TableCell>
                              <TableCell align="right">
                                Vacuna aplicada
                              </TableCell>
                              <TableCell align="right">
                                Lugar
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {child.vaccines.map((row, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th":
                                    { border: 0 },
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                >
                                  {row.date}
                                </TableCell>
                                <TableCell align="right">
                                  {row.name}
                                </TableCell>
                                <TableCell align="right">
                                  {row.place}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
              >
                <AccordionSummary
                  aria-controls="panel4d-content"
                  id="panel4d-header"
                >
                  <Typography>Consulta de percentiles</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Card>
                    <CardHeader color="success">
                      <h4 className={classes.cardtypeWhite}>
                        Comparación con tabla de percentiles
                      </h4>
                    </CardHeader>
                    <CardBody style={{ width: "100%", height: "300px" }}>
                      <ResponsiveContainer>
                        <LineChart
                          width={500}
                          height={300}
                          data={data}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="pv"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardBody>
                  </Card>
                </AccordionDetails>
              </Accordion>
            </GridItem>
          </GridContainer>
        ),
      })) : []

    childMap.push(
      {
        tabButton: "+",
        tabContent: (
          <GridContainer justify="center">
            <GridItem>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <Typography>Agregar niño/niña </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Card>
                    <CardHeader color="success">
                      <h4 className={classes.cardtypeWhite}>
                        Información
                      </h4>
                    </CardHeader>
                    <CardBody>

                      <GridContainer>
                        <GridItem xs={12} sm={12} md={4}>
                          <TextField
                            id="birthDate"
                            type="date"
                            label="Fecha de nacimiento"
                            defaultValue={"2020-01-01"}
                            onChange={updateNewChild}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={3}>
                          <TextField
                            id="bloodType"
                            fullWidth
                            label="Grupo Sanguineo"
                            label="Grupo Sanguíneo"
                            variant="standard"
                            onChange={updateNewChild}
                            defaultValue={""}
                          />
                        </GridItem>
                      </GridContainer>
                      
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <TextField
                            id="alergies"
                            label="Alergias"
                            variant="standard"
                            defaultValue={""}
                            fullWidth
                            onChange={updateNewChild}
                          />
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <TextField
                            id="diseases"
                            label="Enfermedades crónicas y/o patologías"
                            variant="standard"
                            defaultValue={""}
                            fullWidth
                            onChange={updateNewChild}
                          />
                        </GridItem>
                      </GridContainer>

                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <TextField
                            id="name"
                            label="Nombre"
                            variant="standard"
                            defaultValue={""}
                            fullWidth
                            onChange={updateNewChild}
                          />
                        </GridItem>
                      </GridContainer>

                    </CardBody>
                    <CardFooter>
                      <Button disabled={loading} onClick={addChild}>
                        Confirmar
                      </Button>
                      {childError !== '' ?
                        <Alert severity="error">
                          {childError}
                        </Alert>
                        : null
                      }
                    </CardFooter>
                  </Card>
                </AccordionDetails>
              </Accordion>
            </GridItem>
          </GridContainer>
        )
      }
    )
    return childMap
  }

  return (
    <div>
      <Header
        color="transparent"
        brand={"A&A"}
        rightLinks={
          <>
            <Button
              color="transparent"
              simple
              onClick={() => setClassicModal1(true)}
            >
              <LibraryBooks className={classes.icon} />
              Mis datos
            </Button>
            <Dialog
              classes={{
                root: classes.center,
                paper: classes.modal,
              }}
              open={classicModal1}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setClassicModal1(false)}
              aria-labelledby="classic-modal-slide-type"
              aria-describedby="classic-modal-slide-description"
            >
              <DialogContent
                id="classic-modal-slide-description1"
                className={classes.modalBody}
              >
                <Card>
                  <CardHeader color="info">
                    <h4 className={classes.cardtypeWhite}>Perfil</h4>
                  </CardHeader>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          id="first"
                          InputProps={{
                            readOnly: true,
                          }}
                          label="Nombre(s)"
                          defaultValue={profile.firstName}
                          margin="dense"
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          id="last"
                          InputProps={{
                            readOnly: true,
                          }}
                          label="Apellido(s)"
                          defaultValue={profile.lastName}
                          margin="dense"
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <TextField
                          id="email"
                          InputProps={{
                            readOnly: true,
                          }}
                          label="Email"
                          defaultValue={profile.email}
                          margin="dense"
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          id="dni"
                          InputProps={{
                            readOnly: true,
                          }}
                          label="DNI"
                          defaultValue={profile.dni}
                          margin="dense"
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          id="phone"
                          InputProps={{
                            readOnly: true,
                          }}
                          label="Teléfono"
                          defaultValue={profile.phone}
                          margin="dense"
                        />
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                  {/* 
                  TODO: enable profile update
                  <CardFooter>
                    <Button>Guardar cambios</Button>
                  </CardFooter> */}
                </Card>
              </DialogContent>
              <DialogActions className={classes.modalFooter}>
                <Button
                  onClick={() => setClassicModal1(false)}
                  color="danger"
                  simple
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
            <Button color="transparent" className={classes.navLink} href={"/"} onClick={logout}>
              <LockIcon className={classes.icons} /> Cerrar sesión
            </Button>
          </>
        }
        fixed
        changeColorOnScroll={{
          height: 200,
          color: "white",
        }}
        {...rest}
      />
      <Parallax
        small
        filter
        image={require("assets/img/profile-banner.jpg").default}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                <NavPills
                  alignCenter
                  color="info"
                  tabs={
                    childrenTabs()
                  }
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}