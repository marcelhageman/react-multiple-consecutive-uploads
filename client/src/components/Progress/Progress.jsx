import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { size, toArray } from 'lodash'

import { uploadFile } from '../../redux/uploadFile/uploadFile.actions'
import UploadItem from '../UploadItem/UploadItem'
import styles from "./Progress.module.scss"

const UploadProgress = props => {
  const { filesToUpload, fileProgress, uploadFile } = props
  const uploadedFileAmount = size(fileProgress);

  useEffect(() => {
    const fileToUpload = toArray(filesToUpload).filter(file => file.progress === 0)
    uploadFile(fileToUpload)
  }, [filesToUpload, uploadFile])

  const fileCount = Object.keys(fileProgress).length;
  const doneCount = Object.keys(fileProgress).filter(file => fileProgress[file].progress === 100).length;

  if (fileCount === 0 || (fileCount - doneCount) === 0) {
    return null;
  }

  const currentFileID = Object.keys(fileProgress).find(file => fileProgress[file].progress !== 100);
  const currentFile = fileProgress[currentFileID];

  return (fileCount - doneCount) > 0 ? (
    <div className={styles.progress}>
      <p>Uploading {currentFile.file.name}</p>
      <p>{doneCount}/{fileCount} files uploaded</p>
      <div className={styles.progressBar}>
        <div style={{ width: `${currentFile.progress}%` }} />
      </div>
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
