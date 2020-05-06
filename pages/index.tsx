import {useEffect} from "react"

import {useMachine} from "@xstate/react"

import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import InsertPhotoRoundedIcon from "@material-ui/icons/InsertPhotoRounded"

import {Theme, createStyles, makeStyles} from "@material-ui/core/styles"

import clsx from "clsx"

import {useDropzone} from "react-dropzone"

import ErrorMessageSnackbar from "../src/components/ErrorMessageSnackbar"
import stateMachine from "../src/stateMachine"
import {
  inputLabelButtonHeight as bh,
  breakpoint as bp,
} from "../src/theme/constants"
import fetchPicture from "../test/fetchPicture"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainImageData: {
      padding: "unset",
    },
    div: {
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
    divDragover: {
      border: `4px solid ${theme.palette.divider}`,
      cursor: "copy",
      "&.$divImageData": {
        backgroundColor: theme.palette.grey[100],
      },
      "& > svg": {
        animation: `${
          theme.transitions.duration.complex * 2
        }ms infinite linear alternate $iconDragActiveAnimation`,
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
    divImageData: {
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
    button: {
      height: bh,
      marginBottom: -bh,
      position: "relative",
      top: bh / -2,
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
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles, fileRejections) =>
      send({type: "FILES", acceptedFiles, fileRejections}),
    preventDropOnDocument: true,
  })
  useEffect(() => {
    // REMOVE BEFORE PRODUCTION!
    fetchPicture().then((picture) =>
      send({type: "FILES", acceptedFiles: [picture], fileRejections: []}),
    )
  }, [])
  useEffect(() => {
    send(isDragActive ? "DRAGOVER_START" : "DRAGOVER_END")
  }, [isDragActive])
  return (
    <main
      className={state.context.imageData ? styles.mainImageData : undefined}
    >
      <div
        className={clsx(
          styles.div,
          state.matches("dropzone.dragover") && styles.divDragover,
          state.context.imageData && styles.divImageData,
        )}
        id={"picturePreview"}
        {...getRootProps()}
      >
        <input id={"input"} {...getInputProps()} />
        <canvas hidden={!state.context.imageData} id={"canvas"}></canvas>
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
      <Button
        className={styles.button}
        color={"primary"}
        component={"label"}
        htmlFor={"input"}
        variant={"contained"}
      >
        {state.context.imageData
          ? "Load a picture"
          : "Or load a picture manually"}
      </Button>
      <ErrorMessageSnackbar
        isShown={!!state.context.errorMessage}
        message={
          state.context.errorMessage || state.history?.context.errorMessage
        }
        onHide={(): void => {
          send("CLEAR_ERROR_MESSAGE")
        }}
      />
    </main>
  )
}

export default Index
