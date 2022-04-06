
import React, { Component } from 'react'
import ReactImageAnnotate from "react-image-annotate"
import axios from "axios";


class ImageAnnotate extends Component {
  constructor() {
    super();
    this.state = {
      images: [],
      taskDescription: false,
      // show: false,
      // buttonText: true
    };
  }
  componentDidMount=() =>{

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubm90YXRvcl8xIiwidXNlcklkIjoiNjIxZGE3YmI1ODZhYzRlNmIxODBmZmRhIiwicm9sZSI6IkFubm90YXRvciIsImlhdCI6MTY0ODYyMjQ3NCwiZXhwIjoxNjQ4NzA4ODc0fQ.w3Nhlqn5VZD8f0_tLbthfkcQ74tQXpSqHZAKDhBFeBs'
    axios.get(`/annotator/annotation-list`,{ headers: {"x-auth-token" : token} },
  
      )
      .then(response => {
        console.log(response);
        this.setState({ images: response.data });
      })
      .catch(err => console.log(err));
    // this.setState({
    //   show: !this.state.show,
    //   buttonText: !this.state.buttonText
    // });
  };
  
  render() {
    return (
      <>
      <div>
          <u className="h4 text-secondary font-italic font-weight-bold">
            Text Annotation
          </u>
        </div>   
      
        <div>
        {this.state.images.map(image => (
       
 <ReactImageAnnotate
    // selectedImage='http://localhost:8080/images/HUM_11_12_45_380502.jpg'
    taskDescription="# Draw region around each person."
    // images={[{ src:'http://localhost:8080'+ image.filePath}]}
    images={[{ src:'http://localhost:8080/images/HUM_11_12_45_380502.jpg'}]}
    // key={image.id}
    regionClsList={["girl", "boy"]}
    enabledTools={["create-box"]}
  />
  ))}
  </div>
       </>
    )
  }
}

export default ImageAnnotate
