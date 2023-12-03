'use client'

import React, { useState } from 'react'

const LogUploader = () => {
  const [file, setFile] = useState<File | null>(null)   


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
    console.log(file)
  }

  const handleConfirm = () => {
    if (file) {
      // Process log
      file = file.split('\n')
    }
  }

  return (
    <>
      <div>
        <label htmlFor="file" className="rounded-lg bg-slate-200 border border-blue-400 px-5 py-6 transition-colors hover:bg-gray-100 hover:border-blue-600">
          Select Log
        </label> 
        <input id="file" className="hidden" type="file" onChange={handleFileChange}/>
      </div>
      { file && (
        <section className="rounded-lg px-5 bg-slate-200 py-6 my-8 border border-blue-400">
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}
      {file && (
        <label htmlFor="upload" className="rounded-lg bg-slate-200 border border-blue-400 px-5 py-6 transition-colors hover:bg-gray-100 hover:border-blue-600">Upload</label> 
      ) && (
        <button id="upload" className="rounded-lg bg-slate-200 border border-green-400 px-5 py-6 transition-colors hover:bg-gray-100 hover:border-green-600" type="button" onClick={handleConfirm}>Read Log</button>
      )}
    </>
  )
}

export default LogUploader
