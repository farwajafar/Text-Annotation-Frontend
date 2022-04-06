import React from "react";
import axios from "axios";


class Annotation extends React.Component {
  constructor() {
    super();
    this.state = {
      images: [],
      show: false,
      buttonText: true
    };
  }
  // handleClick = () => {
    componentDidMount = () => {
//     let user = JSON.parse(sessionStorage.getItem('data'));
// const token = user.data.id
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubm90YXRvcl8xIiwidXNlcklkIjoiNjIxZGE3YmI1ODZhYzRlNmIxODBmZmRhIiwicm9sZSI6IkFubm90YXRvciIsImlhdCI6MTY0NzQxMDQ5OSwiZXhwIjoxNjQ3NDk2ODk5fQ.K5HMZaqePsRlXqGh9NodM5ZH5NsFis5FXytNPstYWCY'
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
// };

  render() {
    return (
    //   <div className="App">
    <>
        <div>
          <u className="h4 text-secondary font-italic font-weight-bold">
            Text Annotation
          </u>
        </div>
        {/* <button
          className="mt-3 btn btn-outline-success"
          type="button"
          onClick={this.handleClick}
        >
          {this.state.buttonText ? "View Images" : "Hide Images"}
        </button> */}
        
        <div>
          {
          // this.state.show &&
            this.state.images.map(image => (
              <img
                className="border border-success mt-3 w-50 d-inline"
                 src={'http://localhost:8080'+ image.filePath}
                // src={'http://localhost:8080'+ image.filePath}
                key={image.id}
                alt="images"
              />
             
            ))}
        </div>
        
        </>
    );
  }
}
export default Annotation
