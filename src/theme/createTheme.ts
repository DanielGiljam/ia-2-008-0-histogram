import {Theme} from "@material-ui/core/styles"

import {breakpoint as bp} from "./constants"
import enhanceResponsiveHeader from "./enhanceResponsiveHeader"

function createTheme (theme: Theme): Theme {
  const maxWidth = theme.breakpoints.values[bp]
  const minHeight = maxWidth * 0.75
  const bpMediaQuery = `${theme.breakpoints.up(
    bp,
  )} and (min-height: ${minHeight}px)`
  const {toolbarCompensation, MuiAppBar, MuiToolbar} = enhanceResponsiveHeader(
    theme,
    bpMediaQuery,
  )
  theme.overrides = {
    MuiCssBaseline: {
      "@global": {
        "html, body": {height: "100%"},
        body: {
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          [bpMediaQuery]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
          },
        },
        "#__next": {
          alignItems: "inherit",
          backgroundColor: theme.palette.background.paper,
          border: "unset",
          display: "inherit",
          flexDirection: "inherit",
          height: "100%",
          justifyContent: "inherit",
          width: "100%",
          [bpMediaQuery]: {
            height: "unset",
            minHeight,
            maxWidth,
          },
        },
        main: {
          alignItems: "inherit",
          display: "inherit",
          flexDirection: "inherit",
          height: "100%",
          "justify-content": "inherit",
          width: "100%",
          ...toolbarCompensation,
          [bpMediaQuery]: {
            ...(toolbarCompensation[bpMediaQuery] as object),
            border:
              theme.palette.type === "light"
                ? `1px solid ${theme.palette.divider}`
                : undefined,
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
  return theme
}

export default createTheme
