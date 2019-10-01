import React, { useState } from "react";
import Head from "next/head";

import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  FormGroup,
  FormControl,
  InputLabel,
  NativeSelect as Select
} from "@material-ui/core";

import { ThemeProvider } from "@material-ui/styles";
import {
  createMuiTheme,
  responsiveFontSizes,
  makeStyles
} from "@material-ui/core/styles";

import stations_json from "../processor/stations_codes.json";
import trip_times from "../processor/trip_times.json";

let stations_codes = {};
Object.keys(stations_json)
  .sort()
  .forEach(function(key) {
    stations_codes[key] = stations_json[key];
  });

let theme = responsiveFontSizes(createMuiTheme());

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  card: {
    minWidth: 275,
    marginTop: theme.spacing(3)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  span: {
    color: "darkred",
    fontWeight: "bold"
  }
}));

const Promise = props => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant='body1'>
          Based on estimates, you will receive a Rush Hour Promise credit if
          your journey takes longer than{" "}
          <span className={classes.span}>{props.time} minutes.</span>
        </Typography>
      </CardContent>
    </Card>
  );
};

const Home = () => {
  const classes = useStyles();
  const [sourceStation, setSourceStation] = useState();
  const [destStation, setDestStation] = useState();

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='sm'>
        <Head>
          <title> WMATA Rush Hour Promise Calculator</title>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
          />
        </Head>

        <Box className='hero'>
          <Typography variant='h2' component='h1' mb={2}>
            WMATA Rush Hour Promise Calculator
          </Typography>

          <FormGroup>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor='source-station'>Origin station</InputLabel>
              <Select
                className={classes.selectEmpty}
                onChange={event => setSourceStation(event.target.value)}
                inputProps={{
                  name: "source",
                  id: "source-station"
                }}
                className='station-select'
              >
                <option disabled selected value>
                  {" "}
                  -- select an option --{" "}
                </option>
                {Object.keys(stations_codes).map(index => {
                  const value = Array.isArray(stations_codes[index])
                    ? stations_codes[index][0]
                    : stations_codes[index];
                  const key = "s-" + value;
                  return (
                    <option value={value} key={key}>
                      {index}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor='dest-station'>
                Destination station
              </InputLabel>
              <Select
                className={classes.selectEmpty}
                inputProps={{
                  name: "destination",
                  id: "dest-station"
                }}
                className='station-select'
                onChange={event => setDestStation(event.target.value)}
              >
                <option disabled selected value>
                  {" "}
                  -- select an option --{" "}
                </option>
                {Object.keys(stations_codes).map(index => {
                  const value = Array.isArray(stations_codes[index])
                    ? stations_codes[index][0]
                    : stations_codes[index];
                  const key = "d-" + value;
                  return (
                    <option value={value} key={key}>
                      {index}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </FormGroup>

          <Box className='panel'>
            {sourceStation && destStation && sourceStation !== destStation ? (
              <Promise time={trip_times[sourceStation][destStation] + 10} />
            ) : null}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
