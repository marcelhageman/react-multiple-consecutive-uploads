import axios from 'axios'
import uploadFileTypes from './uploadFile.types'

export const setUploadFile = data => ({
  type: uploadFileTypes.SET_UPLOAD_FILE,
  payload: data,
})

export const setUploadProgress = (id, progress) => ({
  type: uploadFileTypes.SET_UPLOAD_PROGRESS,
  payload: {
    id,
    progress,
  },
})

export const successUploadFile = id => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE,
  payload: id,
})

export const failureUploadFile = id => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE,
  payload: id,
})

export const uploadFile = files => async dispatch => {
  if (files.length) {
    /**
     * Async generator to upload multiple files in sequence.
     * @param {*} files Collection of form files.
     */
    async function* uploadFile(files) {
      for (let i = 0; i !== files.length; i++) {
        const file = files[i];
        const formPayload = new FormData();
        formPayload.append('file', file.file);

        await axios({
          baseURL: 'http://localhost:5001',
          url: '/file',
          method: 'put',
          data: formPayload,
          onUploadProgress: progress => {
            const { loaded, total } = progress
            const percentageProgress = Math.floor((loaded / total) * 100)
            dispatch(setUploadProgress(file.id, percentageProgress))
          },
        });

        // Simulate a short wait between each upload
        await new Promise(resolve => setTimeout(resolve, 500));

        // Yield the success of this file
        yield file.id;
      }

    }

    /**
     * Create the generator with the provided files and await each iteration
     * to return the successful yield of a file upload.
     */
    let generator = uploadFile(files);
    for await (let value of generator) {
      dispatch(successUploadFile(value));
    }

  }
}
