import React, { useState } from 'react'
import Head from 'next/head'

import {
  Link,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  FormGroup,
  FormControl,
  InputLabel,
  NativeSelect as Select,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button
} from '@material-ui/core'

import { ThemeProvider } from '@material-ui/styles'
import {
  createMuiTheme,
  responsiveFontSizes,
  makeStyles
} from '@material-ui/core/styles'

import stations_json from '../processor/stations_codes.json'
import trip_times from '../processor/trip_times.json'

let stations_codes = {}
Object.keys(stations_json)
  .sort()
  .forEach(function(key) {
    stations_codes[key] = stations_json[key]
  })

let theme = responsiveFontSizes(createMuiTheme())

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  paper: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(3, 2)
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
    color: 'darkred',
    fontWeight: 'bold'
  }
}))

const Promise = props => {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant='body1'>
          Based on estimates, you will receive a Rush Hour Promise credit if
          your journey takes longer than{' '}
          <span className={classes.span}>{props.time} minutes.</span>
        </Typography>
      </CardContent>
    </Card>
  )
}

const Home = () => {
  const classes = useStyles()
  const [sourceStation, setSourceStation] = useState()
  const [destStation, setDestStation] = useState()

  const [collapseOpen, setCollapse] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='md'>
        <Head>
          <title> WMATA Rush Hour Promise Calculator</title>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
          />
        </Head>

        <Box padding={2}>
          <Typography variant='h2' component='h1' mb={2}>
            Rush Hour Promise Calculator
          </Typography>

          <Typography variant='overline'>
            Not endorsed or produced by the Washington Metropolitan Area
            Transportation Authority.
          </Typography>
        </Box>
        <Container maxWidth='sm'>
          <Paper className={classes.paper} elevation={5}>
            <FormGroup>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor='source-station'>Origin station</InputLabel>
                <Select
                  className={classes.selectEmpty}
                  onChange={event => setSourceStation(event.target.value)}
                  inputProps={{
                    name: 'source',
                    id: 'source-station'
                  }}
                  className='station-select'
                >
                  <option disabled selected value>
                    {' '}
                    -- select an option --{' '}
                  </option>
                  {Object.keys(stations_codes).map(index => {
                    const value = Array.isArray(stations_codes[index])
                      ? stations_codes[index][0]
                      : stations_codes[index]
                    const key = 's-' + value
                    return (
                      <option value={value} key={key}>
                        {index}
                      </option>
                    )
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
                    name: 'destination',
                    id: 'dest-station'
                  }}
                  className='station-select'
                  onChange={event => setDestStation(event.target.value)}
                >
                  <option disabled selected value>
                    {' '}
                    -- select an option --{' '}
                  </option>
                  {Object.keys(stations_codes).map(index => {
                    const value = Array.isArray(stations_codes[index])
                      ? stations_codes[index][0]
                      : stations_codes[index]
                    const key = 'd-' + value
                    return (
                      <option value={value} key={key}>
                        {index}
                      </option>
                    )
                  })}
                </Select>
              </FormControl>
            </FormGroup>

            <Box className='panel'>
              {sourceStation && destStation && sourceStation !== destStation ? (
                <Promise time={trip_times[sourceStation][destStation] + 10} />
              ) : null}
            </Box>
          </Paper>
        </Container>
        <Container maxWidth='sm'>
          <Box mt={6}>
            <Paper elevation={1}>
              <Collapse in={collapseOpen}>
                <Card square>
                  <CardContent>
                    <Typography variant='h6' component='h3'>
                      What is this?
                    </Typography>
                    <Typography>
                      This calculates the length of time between two MetroRail
                      stations before Metro owes you a refund under its{' '}
                      <Link
                        href='https://www.wmata.com/fares/smartrip/rush-hour-promise.cfm'
                        target='_blank'
                        rel='nofollow'
                      >
                        Rush Hour Promise
                      </Link>
                      .
                    </Typography>
                  </CardContent>
                </Card>
                <Card square>
                  <CardContent>
                    <Typography variant='h6' component='h3'>
                      Why this app?
                    </Typography>
                    <Typography>
                      Metro does not have an easy-to-use tool to know when a
                      Rush Hour Promise credit is due. This calculator fills in
                      that gap by allowing you to enter any station pair and
                      finding out what the duration should be.
                    </Typography>
                  </CardContent>
                </Card>
                <Card square>
                  <CardContent>
                    <Typography variant='h6' component='h3'>
                      How does Metro determine the Rush Hour Promise?
                    </Typography>
                    <Typography paragraph>
                      Per Metro webpages, a Rush Hour Promise credit is due to
                      customers when travel takes longer than{' '}
                      <strong>10 minutes</strong> than the expected travel time.
                    </Typography>
                    <Typography>
                      The expected travel time is calculated as per{' '}
                      <Link
                        href='https://www.wmata.com/fares/smartrip/faq.cfm#faq64'
                        target='_blank'
                        rel='nofollow'
                      >
                        Metro
                      </Link>{' '}
                      as the sum of:
                      <List>
                        <ListItem>
                          The travel time between the stations according to the
                          journey planner,
                        </ListItem>
                        <ListItem>
                          The maximum amout of time to wait at the platform for
                          a train based on{' '}
                          <Link
                            href='https://www.wmata.com/schedules/timetables/index.cfm'
                            target='_blank'
                            rel='nofollow'
                          >
                            WMATA's timetable
                          </Link>
                          ,
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            The time to travel between the gate line and the
                            platform; specifically, 3 minutes at Rosslyn and
                            Wheaton, 2 minutes at Fort Totten, Gallery Place,
                            L'Enfant Plaza and Metro Center, and 1 minute
                            everywhere else,
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            and 1 minute to complete transfers across platforms.
                          </ListItemText>
                        </ListItem>
                      </List>
                    </Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant='h6' component='h4'>
                      What are the limitations of this app?
                    </Typography>
                    <Typography paragraph>
                      This app makes certain assumptions about travel on the
                      MetroRail network.
                    </Typography>
                    <Typography paragraph>
                      <List>
                        <ListItem>
                          <ListItemText>
                            If both stations share a rail line, no transfer time
                            is included, even if a transfer might have taken
                            place. For example, this app includes no transfer
                            time for a journey from Pentagon City to Capitol
                            South as both stations are on the Blue Line, even
                            though a route on the Yellow Line to Gallery Place
                            might have been faster.
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            If both stations do not share a rail line, 1 minute
                            is added for transfers, even if the transfer time
                            may not have been calculated by WMATA.
                          </ListItemText>
                        </ListItem>
                        <ListItem>
                          <ListItemText>
                            This app only includes the maximum expected wait
                            time for the next train at the source station, and
                            does not include any waiting time at transfer
                            stations.
                          </ListItemText>
                        </ListItem>
                      </List>
                    </Typography>
                  </CardContent>
                </Card>
                <Card square>
                  <CardContent>
                    <Typography variant='h6' component='h4'>
                      Who built this?
                    </Typography>
                    <Typography>
                      Me! A guy named{' '}
                      <Link href='https://leoji.codes/'>Leo Ji</Link>. Say hi on
                      Twitter!{' '}
                      <Link href='https://twitter.com/theleoji'>@theleoji</Link>
                    </Typography>
                  </CardContent>
                </Card>
              </Collapse>

              <Button
                fullWidth
                variant='contained'
                onClick={() => setCollapse(!collapseOpen)}
              >
                {collapseOpen ? 'Close' : 'More info'}
              </Button>
            </Paper>
          </Box>
        </Container>
      </Container>
    </ThemeProvider>
  )
}

export default Home
