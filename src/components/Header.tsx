import Head from "next/head"

import AppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import GitHubIcon from "@material-ui/icons/GitHub"

const sourceCodeURL = "https://github.com/DanielGiljam/ia-2-008-0-histogram"

export type Anchor = (EventTarget & HTMLButtonElement) | undefined

function Header (): JSX.Element {
  return (
    <>
      <Head>
        <title>IA-2-008 (0) Histogram</title>
        <meta
          content={"A web app that displays a histogram for a photo."}
          name={"description"}
        />
      </Head>
      <AppBar>
        <Toolbar>
          <Typography component={"h1"} variant={"h6"} noWrap>
            IA-2-008 (0) Histogram
          </Typography>
          <IconButton
            aria-label={"Link to repository on GitHub"}
            color={"inherit"}
            component={"a"}
            edge={"end"}
            href={sourceCodeURL}
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
