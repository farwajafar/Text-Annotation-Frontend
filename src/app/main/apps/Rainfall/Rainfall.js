import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple} from "@fuse";
import SpecificUserFuseHead from "../header";
// import RainData from "./RainData";
// import ImageAnnotate from '../Rainfall/ImageAnnotate'
// import Test2 from './test/Test2'
import Test3 from './test/Test3'
// import Test from "./test/Test";

class Rainfall extends React.Component {
  // Constructor

  render() {
    return (
      <FusePageSimple
        header={
          <div className="p-24">
            <SpecificUserFuseHead title="Text Annotation"></SpecificUserFuseHead>
          </div>
        }
        // content={<Test></Test>}
        // content={<Test2></Test2>}
        content={<Test3></Test3>}
        // content={<ImageAnnotate></ImageAnnotate>}
      />
    );
  }
}

export default withStyles({ withTheme: true })(Rainfall);
