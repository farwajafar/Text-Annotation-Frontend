import React, {Component} from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import "./styles.css";
import {Annotator} from 'image-labeler-react';

export default class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          offset: 0,
          data: [],
          perPage: 1,
          currentPage: 0,
          trsInfer: [],
          defaultSceneType: undefined

      };
      this.handlePageClick = this
          .handlePageClick
          .bind(this);
  }

  receivedData() {
  
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubm90YXRvcl8xIiwidXNlcklkIjoiNjIxZGE3YmI1ODZhYzRlNmIxODBmZmRhIiwicm9sZSI6IkFubm90YXRvciIsImlhdCI6MTY0OTA1MDk2MSwiZXhwIjoxNjQ5MTM3MzYxfQ.xB1yBSmhMh8uauFu1TYXowYOSX5_WpKaNUac4HUmC0Y'
    axios.get(`/annotator/annotation-list`,{ headers: {"x-auth-token" : token} },
  
      )
          .then(res => {
                console.log('hiiiiiiiiiiii',res);
              const data = res.data;
              const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
              const postData = slice.map(pd => 
              <React.Fragment>
           
           {/* const x1=pd.trsBoundingBoxCoordinates[0][0][0] */}
                      <Annotator 
        height={555} 
        width={985} 
        imageUrl={'http://localhost:8080'+ pd.filePath} 
        
        // asyncUpload={async (labeledData)=>{
        //     // upload labeled data
        // }}

        types={pd.trsInfer}
        defaultType={""}
      
        // sceneTypes={['1', '2', '3']}
        defaultSceneType={this.defaultSceneType}
        // style={{
        //   width: 640,
        //   height: 680,
        //   margin: "20px auto",
        //   position: "relative",
        //   backgroundColor: "#368",
        //   borderRadius: 8,
        //   padding: 10
        // }}
        defaultBoxes={[{
          x: 136,
          y: 931,
          w: 300,
          h: 300,
          annotation: ''
        }]}
        disableAnnotation={false}
       
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
