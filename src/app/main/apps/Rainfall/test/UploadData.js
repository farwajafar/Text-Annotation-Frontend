import React, {Component} from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import "./styles.css";
import {Annotator} from 'image-labeler-react';
// import EditableText from './EditableText';
import EdiText from 'react-editext'
import Api from 'app/Api';
// import ShowHide from './ShowHide';



export default class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          offset: 0,
          data: [],
          perPage: 1,
          currentPage: 0,
          trsInfer: {},
          defaultSceneType: undefined,
          

      };
      this.handlePageClick = this.handlePageClick.bind(this);
  }
  onSave = val => {
    console.log('Edited Value -> ', val)
    // setValue(val);
    this.setState({trsInfer: [val]})
  }

  applyBoxInfo(box_info) {
    //box info pd.trsBoundingBoxCoordinates
  //   [[1,2],[2,3],[3,4],[4,5]]
  let cordinatesData=box_info.trsBoundingBoxCoordinates
  let annotationData=  box_info.trsInfer
  let annotateAray=[]
  annotationData.map((data)=>{
    annotateAray.push(data)
  })
  console.log('cordinatesData',cordinatesData,'annotationData',annotationData)
  let boxObjArray = [];
  // console.log('box', box_info);
  cordinatesData.map((data,key) => {
    console.log(data,'tadata=>>>>>')
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
          // annotation: annotateAray[key],
          annotation: '',
      };
      console.log('Pushed',boxObj)
      boxObjArray.push(boxObj);
  });
  return boxObjArray;
}

 boxDataAdjust(box_info) {
  let newBoxObjArray = [];
  console.log('box_info',box_info);
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
      let array1=[x1,y1]
      let array2=[x2,y2]
      let array3=[x3,y3]

      let array4=[x4,y4]

      // const result ={ x1 ,y1 ,x2 ,y2 ,x3,y3, x4,y4} ;
      let final=[array1,array2,array3,array4]
      newBoxObjArray.push(final);
  });
  console.log('newBoxObjArray',newBoxObjArray);
  return newBoxObjArray;
}


  receivedData() {
  
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubm90YXRvcl8xIiwidXNlcklkIjoiNjIxZGE3YmI1ODZhYzRlNmIxODBmZmRhIiwicm9sZSI6IkFubm90YXRvciIsImlhdCI6MTY1Mzg5MjE4NCwiZXhwIjoxNjUzOTc4NTg0fQ.bJHG-3VISEG7t3p-EpQIl6DYnRzzHPqZguhgL_Hv-UE'
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
                      console.log('labeledData',labeledData);
                      const boxData = this.boxDataAdjust(labeledData.boxes );
                  
                      const id = pd.id
                        const newData = {
                            // frame: values.frame_id,
                            trsBoundingBoxCoordinatesUpdated : boxData,
                            id: id,
                            trsInferUpdated : this.state.trsInfer, 
                            
                          };
                          console.log("trsssss", );
                            console.log("new Data", newData);
                              Api.postImageData(newData)
                                .then((response) => {
                                  console.log('new data',response);
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
            
    {pd.trsInfer.map((data,key)=>(
      // <div>
      //   <div class="bottom-left" style={{ position: 'absolute',bottom: '100px',left: '160px'}}> <EdiText showButtonsOnHover value={data} id={key[0]} onSave={this.onSave}/></div>
      //   <div class="top-left"><EdiText showButtonsOnHover value={data}  id={key[1]} onSave={this.onSave}/></div>
      //   <div class="top-right">Top Right</div>
      //   <div class="bottom-right">Bottom Right</div>
      //   <div class="centered">Centered</div>
      //   </div>
 <div className="row">

                  <div className="text-block ">
                    <EdiText showButtonsOnHover value={data} onSave={this.onSave}/>
                  </div>
 </div> 
// {/* <ShowHide></ShowHide> */}
    ))}
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