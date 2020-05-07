import React from 'react'
import { connect } from 'react-redux'

import { setUploadFile } from './redux/uploadFile/uploadFile.actions'

import UploadProgress from './components/UploadProgress/UploadProgress'
import Progress from "./components/Progress/Progress";
import "./App.scss";

function App(props) {
  const { setUploadFile } = props;
  const dropArea = React.useRef();

  const handleAttachFIle = files => {
    setUploadFile(files)
  }

  function handlerFunction() {
    console.log("handle stuff")
  }

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function highlight(e) {
    dropArea.current.classList.add('highlight')
  }

  function unhighlight(e) {
    dropArea.current.classList.remove('highlight')
  }

  function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    handleAttachFIle(files)
  }

  React.useEffect(() => {
    if (!dropArea.current) {
      return;
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.current.addEventListener(eventName, preventDefaults, false)
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.current.addEventListener(eventName, highlight, false)
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.current.addEventListener(eventName, unhighlight, false)
    });

    dropArea.current.addEventListener('drop', handleDrop, false);

    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.current.removeEventListener(eventName, preventDefaults, false)
      });
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.current.removeEventListener(eventName, highlight, false)
      });
      dropArea.current.removeEventListener('drop', handleDrop, false);
    }
  }, [dropArea]);

  return (
    <div className="App">
      <div
        ref={dropArea}
        className="upload-area"
      >
        <input type="file" id="file-upload" multiple onChange={e => handleAttachFIle(e.target.files)} />
        <label htmlFor="file-upload">Select your file(s) to upload...</label>
      </div>
      <Progress />
      {/*<UploadProgress />*/}
    </div>
  )
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  setUploadFile: files => dispatch(setUploadFile(files)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
