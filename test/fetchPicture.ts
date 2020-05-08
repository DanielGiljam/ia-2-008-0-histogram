import fetch from "isomorphic-unfetch"

const pictureURL = "http://localhost:3000/test-picture.jpg"

function fetchPicture (): Promise<File> {
  return fetch(pictureURL)
    .then((res) => res.blob())
    .then((blob) => new File([blob], "test-picture.jpg"))
}

export default fetchPicture
