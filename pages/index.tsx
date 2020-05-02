import {useEffect} from "react"

import {useMachine} from "@xstate/react"

import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import InsertPhotoRoundedIcon from "@material-ui/icons/InsertPhotoRounded"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import clsx from "clsx"

import {useDropzone} from "react-dropzone"

import pictureLoaderMachine from "../src/stateMachine"
import {breakpoint as bp} from "../src/theme/constants"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      alignItems: "center",
      backgroundColor: theme.palette.grey[100],
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
      maxHeight: theme.breakpoints.values[bp] * 0.3,
      maxWidth: theme.breakpoints.values[bp] * 0.4,
      padding: theme.spacing(2),
      width: "100%",
      "& > canvas": {
        position: "absolute",
      },
      "&:hover": {
        backgroundColor: theme.palette.grey[200],
        cursor: "pointer",
        "& > canvas": {
          opacity: theme.palette.action.focusOpacity,
          transition: theme.transitions.create("opacity"),
        },
        "& > :not(canvas)": {
          zIndex: 1,
        },
      },
    },
    paperDragActive: {
      backgroundColor: theme.palette.grey[200],
      cursor: "copy",
      "& > svg": {
        animation: `${
          theme.transitions.duration.complex * 2
        }ms infinite linear alternate $iconDragActiveAnimation`,
        fontSize: theme.typography.h1.fontSize,
      },
      "& > canvas": {
        opacity: theme.palette.action.focusOpacity,
        transition: theme.transitions.create("opacity"),
      },
      "& > :not(canvas)": {
        zIndex: 1,
      },
    },
    "@keyframes iconDragActiveAnimation": {
      from: {
        transform: "scale(0.75)",
      },
      to: {
        transform: "scale(1)",
      },
    },
  }),
)

// TODO: display snackbar when there are error messages
function Index (): JSX.Element {
  const styles = useStyles()
  const [current, send] = useMachine(pictureLoaderMachine)
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: "image/*",
    multiple: false,
    onDropAccepted: ([picture]) => send({type: "ACCEPT", picture}),
    onDropRejected: (fileRejections) => send({type: "REJECT", fileRejections}),
    preventDropOnDocument: true,
  })
  useEffect(() => {
    send(isDragActive ? "DRAGOVER_START" : "DRAGOVER_END")
  }, [isDragActive])
  return (
    <Paper
      className={clsx(
        styles.paper,
        current.matches("dropzone.dragover") && styles.paperDragActive,
      )}
      id={"paper"}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <canvas hidden={!current.context.imageData} id={"canvas"}></canvas>
      <InsertPhotoRoundedIcon color={"action"} fontSize={"large"} />
      <Typography
        align={"center"}
        color={"textSecondary"}
        component={"span"}
        noWrap
      >
        Drag and drop a picture
        {current.matches("dropzone.dragover") ? undefined : (
          <>
            <br />
            or click to load a picture manually
          </>
        )}
      </Typography>
    </Paper>
  )
}

export default Index
