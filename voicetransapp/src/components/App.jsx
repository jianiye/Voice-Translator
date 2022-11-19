import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FilesUploadComponent from './FileUpload'

function App() {

  return (
    <div>
      <Header />
      <FilesUploadComponent/>
      <Footer />
    </div>
  );
}

export default App;
