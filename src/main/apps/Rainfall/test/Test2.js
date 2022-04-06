import React, {Component} from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import "./styles.css";
// import {Annotator} from 'image-labeler-react';
import ReactImageAnnotate from "react-image-annotate"

export default class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          offset: 0,
          data: [],
          perPage: 1,
          currentPage: 0,
          trsInfer: []

      };
      this.handlePageClick = this
          .handlePageClick
          .bind(this);
  }


  receivedData() {
  
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubm90YXRvcl8xIiwidXNlcklkIjoiNjIxZGE3YmI1ODZhYzRlNmIxODBmZmRhIiwicm9sZSI6IkFubm90YXRvciIsImlhdCI6MTY0OTIyNzMwOSwiZXhwIjoxNjQ5MzEzNzA5fQ.v0nHSmZuhf772lHvDBzSASTItWh7D_Cc-gzYZa5vd4I'
    axios.get(`/annotator/annotation-list`,{ headers: {"x-auth-token" : token} },
  
      )
          .then(res => {

              const data = res.data;
              const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
              const postData = slice.map(pd => 
              <React.Fragment>

       
    <ReactImageAnnotate
    // selectedImage='http://localhost:8080/images/HUM_11_12_45_380502.jpg'
    // taskDescription="# Draw region around each person."
    images={[{ src:'http://localhost:8080'+ pd.filePath}]}
    key={pd.id}
    regionClsList={pd.trsInfer}
    enabledTools={["create-box"]}
    
    />
  

              </React.Fragment>
              )

              this.setState({
                  pageCount: Math.ceil(data.length / this.state.perPage),
                 
                  postData
              })
          });
  }
  handlePageClick = (e) => {
      const selectedPage = e.selected;
      const offset = selectedPage * this.state.perPage;

      this.setState({
          currentPage: selectedPage,
          offset: offset
      }, () => {
          this.receivedData()
      });

  };

  componentDidMount() {
      this.receivedData()
  }
  render() {
      return (
          <div>
              {this.state.postData}
              <ReactPaginate
                  previousLabel={"prev"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={1}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}/>
          </div>

      )
  }
}
