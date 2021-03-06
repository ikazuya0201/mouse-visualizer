import React, { useState, useEffect } from "react";
import Canvas from "./Canvas";
import fetchResult, { Result } from "./fetch";
import { defaultInput, InputForm } from "./input";
import Loader from "react-loader";
import clsx from "clsx";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import {
  Drawer,
  Container,
  Grid,
  Slider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  PlayArrow,
  Stop,
  FastForward,
  FastRewind,
  Replay,
} from "@material-ui/icons";

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

export default function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [input, setInput] = useState(defaultInput);

  const [value, setValue] = useState(0.0);
  const [isPlaying, setPlaying] = useState(false);

  const [result, setResult] = useState<Array<Result>>([]);

  const speeds = [0.25, 0.5, 0.75, 1.0, 2.0, 3.0, 4.0, 8.0];

  const [speedIndex, setSpeedIndex] = useState(3);

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && result.length > 0) {
        setValue((value) =>
          Math.min(
            value + (100.0 / result.length) * 50.0 * speeds[speedIndex],
            100.0
          )
        );
      }
    }, 50);
    return () => clearInterval(interval);
  });

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        color="inherit"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <Menu />
          </IconButton>
          <Container maxWidth="xs">
            <Typography variant="h6" noWrap>
              Micromouse Simulator
            </Typography>
          </Container>
          <Container maxWidth="xl">
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <Slider
                  value={value}
                  onChange={(_event, newValue) => {
                    setValue(newValue as number);
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">?? {speeds[speedIndex]}</Typography>
              </Grid>
            </Grid>
          </Container>
          <Container maxWidth="xs">
            <IconButton
              onClick={() => {
                if (speedIndex > 0) {
                  setSpeedIndex(speedIndex - 1);
                }
              }}
            >
              <FastRewind />
            </IconButton>
            <IconButton color="secondary" onClick={() => setPlaying(false)}>
              <Stop />
            </IconButton>
            <IconButton color="primary" onClick={() => setPlaying(true)}>
              <PlayArrow />
            </IconButton>
            <IconButton
              onClick={() => {
                if (speedIndex + 1 < speeds.length) {
                  setSpeedIndex(speedIndex + 1);
                }
              }}
            >
              <FastForward />
            </IconButton>
            <IconButton
              onClick={() => {
                setValue(0);
              }}
            >
              <Replay />
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <InputForm
          input={input}
          onSubmit={(event) => {
            setLoading(true);
            setInput(event.formData);
            setPlaying(false);
            fetchResult(event.formData)
              .then((res) => {
                setResult(res);
                setValue(0);
                setLoading(false);
              })
              .catch((error) => {
                setLoading(false);
                console.log(error);
              });
          }}
        />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Grid container alignItems="center" justify="center">
          <Grid item xs={8}>
            <Loader loaded={!isLoading} zIndex={1600} />
            <Canvas
              mazeString={input.maze_string}
              setMazeString={(newMazeString) => {
                setInput({
                  ...input,
                  maze_string: newMazeString,
                });
              }}
              results={result}
              value={value}
            />
          </Grid>
        </Grid>
      </main>
    </div>
  );
}
