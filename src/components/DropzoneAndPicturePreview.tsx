import {useEffect} from "react"

import {Interpreter, State} from "xstate"

import Typography from "@material-ui/core/Typography"
import InsertPhotoRoundedIcon from "@material-ui/icons/InsertPhotoRounded"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import clsx from "clsx"

import {useDropzone} from "react-dropzone"

import {
  StateMachineContext,
  StateMachineEvent,
  StateMachineSchema,
} from "../stateMachine"
import {breakpoint as bp} from "../theme/constants"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: "center",
      backgroundAttachment: "fixed",
      backgroundColor: theme.palette.grey[100],
      border: `1px solid ${theme.palette.divider}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
      minHeight: theme.breakpoints.values[bp] * 0.3,
      maxHeight: theme.breakpoints.values[bp] * 0.3,
      maxWidth: theme.breakpoints.values[bp] * 0.4,
      transition: theme.transitions.create("background-color"),
      userSelect: "none",
      width: "100%",
      "& > canvas": {
        position: "absolute",
      },
      "& > *": {
        transition: theme.transitions.create("opacity"),
      },
      "&:hover": {
        "& > canvas": {
          opacity: theme.palette.action.focusOpacity,
        },
        "& > :not(canvas)": {
          zIndex: 1,
        },
      },
    },
    onDragover: {
      border: `4px solid ${theme.palette.divider}`,
      cursor: "copy",
      "&.$withImageData": {
        backgroundColor: theme.palette.grey[100],
      },
      "& > svg": {
        animation: `${
          theme.transitions.duration.complex * 2
        }ms infinite linear alternate $iconOnDragoverAnimation`,
        fontSize: theme.typography.h1.fontSize,
      },
      "& > canvas": {
        opacity: theme.palette.action.focusOpacity,
      },
      "& > :not(canvas)": {
        opacity: 1,
        zIndex: 1,
      },
    },
    withImageData: {
      backgroundColor: "unset",
      backgroundImage: `linear-gradient(45deg, ${theme.palette.grey[100]} 25%, transparent 25%), linear-gradient(-45deg, ${theme.palette.grey[100]} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${theme.palette.grey[100]} 75%), linear-gradient(-45deg, transparent 75%, ${theme.palette.grey[100]} 75%)`,
      backgroundSize: "20px 20px",
      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
      border: "unset",
      justifySelf: "start",
      maxHeight: "unset",
      maxWidth: "unset",
      "& > :not(canvas)": {
        opacity: 0,
      },
      "&:hover": {
        backgroundColor: theme.palette.grey[100],
        "& > :not(canvas)": {
          opacity: 1,
        },
      },
    },
    "@keyframes iconOnDragoverAnimation": {
      from: {
        transform: "scale(0.75)",
      },
      to: {
        transform: "scale(1)",
      },
    },
  }),
)

interface DropzoneAndPicturePreviewProps {
  state: State<StateMachineContext, StateMachineEvent, StateMachineSchema>;
  send: Interpreter<
    StateMachineContext,
    StateMachineSchema,
    StateMachineEvent
  >["send"];
}

function DropzoneAndPicturePreview ({
  state,
  send,
}: DropzoneAndPicturePreviewProps): JSX.Element {
  const styles = useStyles()
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: "image/*",
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles, fileRejections) =>
      send({type: "FILES", acceptedFiles, fileRejections}),
    preventDropOnDocument: true,
  })
  useEffect(() => {
    send(isDragActive ? "DRAGOVER_START" : "DRAGOVER_END")
  }, [isDragActive])
  return (
    <div
      className={clsx(
        styles.root,
        state.matches("dropzone.dragover") && styles.onDragover,
        state.context.imageData && styles.withImageData,
      )}
      id={"picturePreview"}
      {...getRootProps()}
    >
      <input id={"input"} {...getInputProps()} />
      <canvas hidden={!state.context.imageData} id={"canvas"} />
      <InsertPhotoRoundedIcon color={"action"} fontSize={"large"} />
      <Typography
        align={"center"}
        color={"textSecondary"}
        component={"span"}
        noWrap
      >
        Drag and drop a picture
      </Typography>
    </div>
  )
}

export default DropzoneAndPicturePreview
