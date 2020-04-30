import Head from "next/head"
import NextLink from "next/link"

import AppBar from "@material-ui/core/AppBar"
import MuiLink from "@material-ui/core/Link"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"

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
            <NextLink href={{pathname: "/"}} passHref>
              <MuiLink color={"inherit"} underline={"none"}>
                IA-2-008 (0) Histogram
              </MuiLink>
            </NextLink>
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
