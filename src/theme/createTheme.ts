import {Theme} from "@material-ui/core/styles"

import {breakpoint} from "./constants"
import enhanceResponsiveHeader from "./enhanceResponsiveHeader"

function createTheme (theme: Theme): Theme {
  const maxWidth = theme.breakpoints.values[breakpoint]
  const minHeight = maxWidth * 0.75
  const breakpointMediaQuery = `${theme.breakpoints.up(
    breakpoint,
  )} and (min-height: ${minHeight}px)`
  const {toolbarCompensation, MuiAppBar, MuiToolbar} = enhanceResponsiveHeader(
    theme,
    breakpointMediaQuery,
  )
  const mainBorder = `1px solid ${theme.palette.divider}`
  theme.overrides = {
    MuiCssBaseline: {
      "@global": {
        "html, body": {height: "100%"},
        body: {
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          [breakpointMediaQuery]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            justifyContent: "center",
          },
        },
        "#__next": {
          alignItems: "inherit",
          display: "inherit",
          flexDirection: "inherit",
          height: "100%",
          width: "100%",
          [breakpointMediaQuery]: {
            height: "unset",
            minHeight,
            maxWidth,
            justifyContent: "inherit",
          },
        },
        main: {
          alignItems: "inherit",
          background: theme.palette.background.paper,
          display: "inherit",
          flexDirection: "inherit",
          height: "100%",
          width: "100%",
          ...toolbarCompensation,
          [breakpointMediaQuery]: {
            ...(toolbarCompensation[breakpointMediaQuery] as object),
            borderBottom: mainBorder,
            borderLeft: mainBorder,
            borderRight: mainBorder,
            justifyContent: "inherit",
          },
        },
      },
    },
    MuiAppBar: {
      ...MuiAppBar,
    },
    MuiToolbar: {
      root: {
        justifyContent: "space-between",
      },
      ...MuiToolbar,
    },
  }
  theme.props = {
    MuiAppBar: {
      elevation: 0,
      variant: "elevation",
    },
    MuiPaper: {
      square: true,
      variant: "outlined",
    },
    MuiSnackbarContent: {
      variant: "elevation",
    },
  }
  return theme
}

export default createTheme
