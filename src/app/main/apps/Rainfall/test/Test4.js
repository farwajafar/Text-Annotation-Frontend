import React, {Component} from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import "./styles.css";
import {Annotator} from 'image-labeler-react';
// import EditableText from './EditableText';
import EdiText from 'react-editext'

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
applyBoxInfo(box_info) {
      //box info pd.trsBoundingBoxCoordinates
    //   [[1,2],[2,3],[3,4],[4,5]]
    let cordinatesData=box_info.trsBoundingBoxCoordinates
    let annotationData=box_info.trsInfer
    console.log('cordinatesData',cordinatesData,'annotationData',annotationData)
    let boxObjArray = [];
    // console.log('box', box_info);
    cordinatesData.forEach((data) => {
        const x1 = parseInt(data[0][0]);
        const y1 = parseInt(data[0][1]);
        const x2 = parseInt(data[1][0]);
        const y2 = parseInt(data[1][1]);
        const x3 = parseInt(data[2][0]);
        const y3 = parseInt(data[2][1]);
        const x4 = parseInt(data[3][0]);
        const y4 = parseInt(data[3][1]);
        const minValueX = Math.min(x1, x2, x3, x4);
        const maxValueX = Math.max(x1, x2, x3, x4);
        const minValueY = Math.min(y1, y2, y3, y4);
        const maxValueY = Math.max(y1, y2, y3, y4);
        const width = maxValueX - minValueX;
        const height = maxValueY - minValueY;
        const boxObj = {
            x: minValueX,
            y: minValueY,
            w: width,
            h: height,
            annotation: annotationData||'',
        };
        boxObjArray.push(boxObj);
    });
    return boxObjArray;
}

// handleSave = (val) => {
//     console.log('Edited Value -> ', val);
//     setValue(val);
//   };
onSave = val => {
    console.log('Edited Value -> ', val)
  }
  receivedData() {
  
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubm90YXRvcl8xIiwidXNlcklkIjoiNjIxZGE3YmI1ODZhYzRlNmIxODBmZmRhIiwicm9sZSI6IkFubm90YXRvciIsImlhdCI6MTY0OTc0NjU3MCwiZXhwIjoxNjQ5ODMyOTcwfQ.kX3vSz7gyftZdpnfR1_k__xLEck6J_PTpi3-1uVlw3c'
    axios.get(`/annotator/annotation-list`,{ headers: {"x-auth-token" : token} },
  
      )
          .then(res => {
                console.log('hiiiiiiiiiiii',res);
              const data = res.data;
              const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
              const postData = slice.map((pd,index)=> (
              <>
              <div class="container">
                <Annotator 
                    height={555} 
                    width={985} 
                    imageUrl={'http://localhost:8080'+ pd.filePath} 
                    // asyncUpload={async (labeledData)=>{
                    //         // upload labeled data
                    //  }}
                    
                    types={pd.trsInfer}
                    defaultType={""}
                    defaultSceneType={this.defaultSceneType}
                    defaultBoxes={this.applyBoxInfo(pd)}
                    disableAnnotation={false}
                />
            
    
                 <div className="text-block">
                     
                 <EdiText
  showButtonsOnHover
  value={pd.trsInfer}
  onSave={this.onSave}
/>
                     {/* {pd.trsInfer} */}
                 {/* <EditableText text={pd.trsInfer} />
                      {console.log('text',pd.trsInfer)} */}
                </div>
                </div>
              </>))

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