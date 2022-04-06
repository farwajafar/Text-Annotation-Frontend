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
          trsInfer: []

      };
      this.handlePageClick = this
          .handlePageClick
          .bind(this);
  }

//   applyBoxInfo(box_info) {
//     const boxData = box_info.split("\n");
//     let boxObjArray = [];

//     boxData.forEach((data) => {
//         const singleBoxData = data.split(",");
//         const x1 = parseInt(singleBoxData[0]);
//         const y1 = parseInt(singleBoxData[1]);
//         const x2 = parseInt(singleBoxData[2]);
//         const y2 = parseInt(singleBoxData[3]);
//         const x3 = parseInt(singleBoxData[4]);
//         const y3 = parseInt(singleBoxData[5]);
//         const x4 = parseInt(singleBoxData[6]);
//         const y4 = parseInt(singleBoxData[7]);
//         const minValueX = Math.min(x1, x2, x3, x4);
//         const maxValueX = Math.max(x1, x2, x3, x4);
//         const minValueY = Math.min(y1, y2, y3, y4);
//         const maxValueY = Math.max(y1, y2, y3, y4);
//         const width = maxValueX - minValueX;
//         const height = maxValueY - minValueY;
//         const boxObj = {
//             x: minValueX,
//             y: minValueY,
//             w: width,
//             h: height,
//             annotation: "",
//         };
//         boxObjArray.push(boxObj);
//     });
//     return boxObjArray;
// }

// boxDataAdjust(box_info) {
//     let newBoxObjArray = "";
//     box_info.forEach((data) => {
//         const height = parseInt(data.h);
//         const width = parseInt(data.w);
//         const x = parseInt(data.x); //MINIMUM VALUE X
//         const y = parseInt(data.y); //MINIMUM VALUE Y
//         const x1 = parseInt(x);
//         const y1 = parseInt(y);
//         const x2 = parseInt(width + x); // width + minimum X
//         const y2 = parseInt(y);
//         const x3 = parseInt(width + x); // width + minimum X
//         const y3 = parseInt(height + y); // height + minimum X
//         const x4 = parseInt(x);
//         const y4 = parseInt(height + y);
//         const result =
//             x1 +
//             "," +
//             y1 +
//             "," +
//             x2 +
//             "," +
//             y2 +
//             "," +
//             x3 +
//             "," +
//             y3 +
//             "," +
//             x4 +
//             "," +
//             y4 +
//             "\n";
//         newBoxObjArray = newBoxObjArray + result;
//     });
//     return newBoxObjArray;
// }


  receivedData() {
  
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFubm90YXRvcl8xIiwidXNlcklkIjoiNjIxZGE3YmI1ODZhYzRlNmIxODBmZmRhIiwicm9sZSI6IkFubm90YXRvciIsImlhdCI6MTY0ODgwMzA3OSwiZXhwIjoxNjQ4ODg5NDc5fQ.cDQjIegFYzSZULdSq7XKHhw8Uov_QXA5wP0lTNx0y6M'
    axios.get(`/annotator/annotation-list`,{ headers: {"x-auth-token" : token} },
  
      )
          .then(res => {

              const data = res.data;
              const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
              const postData = slice.map(pd => 
              <React.Fragment>
                  {/* <p>{pd.trsInfer}</p> */}
                  
                  {/* <img 
                  className="border border-success mt-3 w-50 d-inline"
                  src={'http://localhost:8080'+ pd.filePath}
                  // trsInfer= {pd.trsInfer}
                  key={pd.id}
                  alt="images"
                  /> */}
                      <Annotator 
        height={555} 
        width={985} 
        imageUrl={'http://localhost:8080'+ pd.filePath} 
        // asyncUpload={async (labeledData)=>{
        //     // upload labeled data
        // }} 
        // asyncUpload={async (labeledData ) => {
        //     const boxData = this.boxDataAdjust(labeledData.boxes  );
        //     const status = 2;
        //          try {
        //          await dispatch(
        //              detection_post(
        //                values.frame_id,
        //                status,
        //                boxData
        //                ));
        // onSubmitSuccess();
        // enqueueSnackbar(
        //       "Updated Successfully",
        //     {
        //     variant:"success",
        //      });
        //      } catch (error) {} }}
        types={pd.trsInfer}
        defaultType={""}
        // defaultBoxes={
        //     this.applyBoxInfo(pd.trsBoundingBoxCoordinates)
        // }
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
