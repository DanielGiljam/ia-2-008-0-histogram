import {Theme} from "@material-ui/core/styles"

import {breakpoint as bp} from "./constants"
import enhanceResponsiveHeader from "./enhanceResponsiveHeader"

function createTheme (theme: Theme): Theme {
  const bpMediaQuery = theme.breakpoints.up(bp)
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
          [theme.breakpoints.up(bp)]: {
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
          [theme.breakpoints.up(bp)]: {
            height: "unset",
            minHeight: theme.breakpoints.values[bp] * 0.75,
            maxWidth: theme.breakpoints.values[bp],
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
