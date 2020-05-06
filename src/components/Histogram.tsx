import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import {breakpoint as bp} from "../theme/constants"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    histogram: {
      alignItems: "center",
      background: theme.palette.grey[300],
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      fontFamily: "monospace",
      fontSize: "1.5rem",
      justifyContent: "center",
      minHeight: theme.breakpoints.values[bp] * 0.2,
      padding: theme.spacing(3),
      width: "100%",
    },
  }),
)

function Histogram (): JSX.Element {
  const styles = useStyles()
  return (
    <div className={styles.histogram}>
      This is a placeholder for the histogram.
    </div>
  )
}

export default Histogram
