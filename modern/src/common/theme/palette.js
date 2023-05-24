import {
  deepOrange,
  amber, grey, green, indigo, red, common, purple,
} from '@mui/material/colors';

export default (server) => {
  const colors = {
    white: common.white,
    background: grey[50],
    primary: server?.attributes?.colorPrimary || indigo[900],
    secondary: server?.attributes?.colorSecondary || green[800],
    positive: green[500],
    medium: amber[700],
    negative: red[500],
    neutral: grey[500],
    geometry: '#3bb2d0',
    poi: purple[500],
    route: deepOrange[500],
    routeWaypoints: deepOrange[800],
    liveRoute: amber[800],
  };

  return {
    background: {
      default: colors.background,
    },
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.white,
    },
    colors,
  };
};
