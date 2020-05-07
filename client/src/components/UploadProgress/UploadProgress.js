import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { size, toArray } from 'lodash'

import { uploadFile } from '../../redux/uploadFile/uploadFile.actions'
import UploadItem from '../UploadItem/UploadItem'
import Styles from './UploadProgress.module.css'

const UploadProgress = props => {
  const { filesToUpload, fileProgress, uploadFile } = props
  const uploadedFileAmount = size(fileProgress)

  useEffect(() => {
    const fileToUpload = toArray(filesToUpload).filter(file => file.progress === 0)
    uploadFile(fileToUpload)
  }, [filesToUpload, uploadFile])

  const fileCount = Object.keys(fileProgress).length;

  return uploadedFileAmount > 0 ? (
    <div className={Styles.wrapper}>
      <h4>Uploading {fileCount} File{fileCount > 1 ? 's' : ''}</h4>
      {size(fileProgress)
        ? toArray(fileProgress).map(file => <UploadItem key={file.id} file={file} />)
        : null}
    </div>
  ) : null
}

const mapStateToProps = state => ({
  filesToUpload: state.UploadFile.filesToUpload,
  fileProgress: state.UploadFile.fileProgress,
})

const mapDispatchToProps = dispatch => ({
  uploadFile: files => dispatch(uploadFile(files)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadProgress)
