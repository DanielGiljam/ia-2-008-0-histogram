import {useEffect} from "react"

import {useMachine} from "@xstate/react"

import Button from "@material-ui/core/Button"

import {createStyles, makeStyles} from "@material-ui/core/styles"

import DropzoneAndPicturePreview from "../src/components/DropzoneAndPicturePreview"
import ErrorMessageSnackbar from "../src/components/ErrorMessageSnackbar"
import Histogram from "../src/components/Histogram"
import stateMachine from "../src/stateMachine"
import {inputLabelButtonHeight as bh} from "../src/theme/constants"
import fetchPicture from "../test/fetchPicture"

const useStyles = makeStyles(() =>
  createStyles({
    noPadding: {
      padding: "unset",
    },
    button: {
      height: bh,
      marginBottom: -bh,
      position: "relative",
      top: bh / -2,
    },
  }),
)

function Index (): JSX.Element {
  const styles = useStyles()
  const [state, send] = useMachine(stateMachine)
  useEffect(() => {
    // REMOVE BEFORE PRODUCTION!
    fetchPicture().then((picture) =>
      send({type: "FILES", acceptedFiles: [picture], fileRejections: []}),
    )
  }, [])
  return (
    <main className={state.context.imageData ? styles.noPadding : undefined}>
      <DropzoneAndPicturePreview send={send} state={state} />
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
      {state.context.imageData ? <Histogram /> : undefined}
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
