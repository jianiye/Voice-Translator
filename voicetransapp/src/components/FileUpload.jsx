import React, { Component } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import FileUploadTwoToneIcon from '@mui/icons-material/FileUploadTwoTone';
export default class FilesUploadComponent extends Component {

    constructor(props) {
        super(props);
        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
        this.state = {
            profileAudio: '',
            fileName: '',
            text: '',
            trans: '',
            srlan: 'en-US',
            tglan: 'en-US',
            rows: 3
        }
    }
    onFileChange(e) {
        this.setState({ profileAudio: e.target.files[0]})
    }
    onSubmit(e) {
        e.preventDefault()
        const formData = new FormData()
        formData.append('profileAudio', this.state.profileAudio)
        axios.post("http://localhost:8080/uploadRouter/audio", formData, {
        }).then( res => {
        this.setState({ fileName: res.data.audioCreated.encryptedFileName })
        // console.log(this.state)
        this.onClick(e)
        })
    }
    onClick(e) {
        e.preventDefault()
        console.log(this.state.fileName)
        axios.post("http://localhost:8080/voiceRouter/fileVoice", {'filename': this.state.fileName, 'srlan': this.state.srlan, 'tglan': this.state.tglan}, {
        }).then(res => {
            // console.log(res.data)
            this.setState({ text: res.data.origintext, trans: res.data.transtext, rows: Math.floor(res.data.origintext.length/15) })
        })    
    }
    onSelectSr = (e) => {
        // console.log(e.target.value)
        this.setState({ srlan: e.target.value })
    }
    onSelectTg = (e) => {
        // console.log(e.target.value)
        this.setState({ tglan: e.target.value })
    }

    render() {
        return (

            <form className="create-note" onSubmit={this.onSubmit}>
                <textarea
                name="content"
                value={this.state.text}
                placeholder="Your voice file content..."
                rows={this.state.rows}
                onChange={this.onFileChange}
                disabled = "disabled"
                />
                <textarea
                name="transcontent"
                value={this.state.trans}
                placeholder="Your voice file translated content..."
                rows={this.state.rows}
                onChange={this.onFileChange}
                disabled = "disabled"
                />
                <div className="form-group">
                    <input className="file-input" type="file" onChange={this.onFileChange} />
                </div>
                <div>
                <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
                    <InputLabel id="lan-label">Source Language</InputLabel>
                    <Select
                    labelId="lan-label"
                    id="lan-select"
                    value={this.state.srlan}
                    label="Language"
                    onChange={this.onSelectSr}
                    >
                    <MenuItem value={'en-US'}>English</MenuItem>
                    <MenuItem value={'fr'}>French</MenuItem>
                    <MenuItem value={'es'}>Spanish</MenuItem>
                    <MenuItem value={'zh-CN'}>Chinese</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
                    <InputLabel id="lan-label">Target Language</InputLabel>
                    <Select
                    labelId="lan-label"
                    id="lan-select"
                    value={this.state.tglan}
                    label="Language"
                    onChange={this.onSelectTg}
                    >
                    <MenuItem value={'en-US'}>English</MenuItem>
                    <MenuItem value={'fr'}>French</MenuItem>
                    <MenuItem value={'es'}>Spanish</MenuItem>
                    <MenuItem value={'zh-CN'}>Chinese</MenuItem>
                    </Select>
                </FormControl>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" type="submit"><FileUploadTwoToneIcon/></button>
                </div>
            </form>

        )
    }
}