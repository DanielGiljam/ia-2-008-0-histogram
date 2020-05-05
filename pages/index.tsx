import {useEffect} from "react"

import {useMachine} from "@xstate/react"

import Typography from "@material-ui/core/Typography"
import InsertPhotoRoundedIcon from "@material-ui/icons/InsertPhotoRounded"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import clsx from "clsx"

import {useDropzone} from "react-dropzone"

import ErrorMessageSnackbar from "../src/components/ErrorMessageSnackbar"
import stateMachine from "../src/stateMachine"
import {breakpoint as bp} from "../src/theme/constants"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      alignItems: "center",
      backgroundColor: theme.palette.grey[100],
      border: `1px solid ${theme.palette.divider}`,
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
    paperDragover: {
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
    paperImageData: {
      border: "unset",
      maxHeight: "unset",
      maxWidth: "unset",
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

function Index (): JSX.Element {
  const styles = useStyles()
  const [state, send] = useMachine(stateMachine)
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
    <>
      <div
        className={clsx(
          styles.paper,
          state.matches("dropzone.dragover") && styles.paperDragover,
          state.context.imageData && styles.paperImageData,
        )}
        id={"picturePreview"}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <canvas hidden={!state.context.imageData} id={"canvas"}></canvas>
        <InsertPhotoRoundedIcon color={"action"} fontSize={"large"} />
        <Typography
          align={"center"}
          color={"textSecondary"}
          component={"span"}
          noWrap
        >
          Drag and drop a picture
          {state.matches("dropzone.dragover") ? undefined : (
            <>
              <br />
              or click to load a picture manually
            </>
          )}
        </Typography>
      </div>
      <ErrorMessageSnackbar
        isShown={!!state.context.errorMessage}
        message={
          state.context.errorMessage || state.history?.context.errorMessage
        }
        onHide={(): void => {
          send("CLEAR_ERROR_MESSAGE")
        }}
      />
    </>
  )
}

export default Index
