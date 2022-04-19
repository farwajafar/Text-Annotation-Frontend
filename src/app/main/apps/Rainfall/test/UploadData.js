import React, {Component} from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import "./styles.css";
import {Annotator} from 'image-labeler-react';
// import EditableText from './EditableText';
import EdiText from 'react-editext'
import Api from 'app/Api';


export default class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          offset: 0,
          data: [],
          perPage: 1,
          currentPage: 0,
          trsInfer: [],
          defaultSceneType: undefined,
          

      };
      this.handlePageClick = this
          .handlePageClick
          .bind(this);
  }
  onSave = val => {
    console.log('Edited Value -> ', val)
    // setValue(val);
  }
  applyBoxInfo(box_info) {
    //box info pd.trsBoundingBoxCoordinates
  //   [[1,2],[2,3],[3,4],[4,5]]
  let cordinatesData=box_info.trsBoundingBoxCoordinates
  let annotationData=  box_info.trsInfer
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
          annotation: '',
      };
      console.log('Pushed',boxObj)
      boxObjArray.push(boxObj);
  });
  return boxObjArray;
}

 boxDataAdjust(box_info) {
  let newBoxObjArray = "";
  box_info.forEach((data) => {
      const height = parseInt(data.h);
      const width = parseInt(data.w);
      const x = parseInt(data.x); //MINIMUM VALUE X
      const y = parseInt(data.y); //MINIMUM VALUE Y
      const x1 = parseInt(x);
      const y1 = parseInt(y);
      const x2 = parseInt(width + x); // width + minimum X
      const y2 = parseInt(y);
      const x3 = parseInt(width + x); // width + minimum X
      const y3 = parseInt(height + y); // height + minimum X
      const x4 = parseInt(x);
      const y4 = parseInt(height + y);
      const result = x1 + "," +y1 +"," +x2 +"," + y2 +"," +x3 +"," +y3 +"," + x4 +"," +y4 +"\n";
      newBoxObjArray = newBoxObjArray + result;
  });
  return newBoxObjArray;
}


  receivedData() {
  
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubm90YXRvcl8xIiwidXNlcklkIjoiNjIxZGE3YmI1ODZhYzRlNmIxODBmZmRhIiwicm9sZSI6IkFubm90YXRvciIsImlhdCI6MTY1MDM0ODkxMiwiZXhwIjoxNjUwNDM1MzEyfQ.CHbcN8qnT6dHd9BQODDTZaxj57aQw4eEllZzabMJXd0'
     axios.get(`/annotator/annotation-list`,{ headers: {"x-auth-token" : token} },
  
      )
          .then(res => {
                // console.log('hiiiiiiiiiiii',res);
              const data = res.data;
              const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
              const postData = slice.map((pd,index)=> (
              <>
              <div class="container">
                <Annotator 
                    height={555} 
                    width={985} 
                    imageUrl={'http://localhost:8080'+ pd.filePath} 
                    asyncUpload={async (labeledData)=>{
                      const boxData = this.boxDataAdjust(labeledData.pd  );
                      const status = 2;
                        const newData = {
                            // emp_id: this.props.parentState.emp_id,
                            boxData,
                            status,
                            trsInfer: this.state.trsInfer, 
                          };
                            console.log("new Data", newData);
                              Api.postVideoData(newData)
                                .then((response) => {
                                  console.log('new video',response);
                            // Api.getVideoData(this.state.videoId)
                            // .then(response=>{
                            // //  console.log('Reacheeeedddddddddd',response)
                             
                            //  this.state.EducationalCallBack(response.data)
                            // }
                            //   ).catch(error =>{
                            //   console.log(error)
                            //   })
                                })
                                .catch((error) => {
                                  console.log(error);
                                });

                        
                     }}
                    
                    types={pd.trsInfer}
                    defaultType={""}
                    defaultSceneType={this.defaultSceneType}
                    defaultBoxes={this.applyBoxInfo(pd)}
                    disableAnnotation={false}
                />
            
    
                  <div className="text-block">
                <EdiText showButtonsOnHover value={pd.trsInfer} onSave={this.onSave}/>
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