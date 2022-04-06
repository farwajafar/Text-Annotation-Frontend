import React from "react";
import { Icon, Typography } from "@material-ui/core";
import { FuseAnimate } from "@fuse";

function SpecificUserFuseHead(props) {
  return (
    <div>
      <br />
      <br />
      <br />

      <div className="flex flex-1 w-full items-center justify-between">
        <div className="flex items-center" >
          <FuseAnimate animation="transition.expandIn" delay={300}>
            <Icon className="text-32 mr-0 sm:mr-12">control_camera</Icon>
          </FuseAnimate>
          <FuseAnimate animation="transition.slideLeftIn" delay={300}>
            <Typography className="hidden sm:flex" variant="h3">
              {props.title}
            </Typography>
          </FuseAnimate>
        </div>
      </div>
    </div>
  );
}

export default SpecificUserFuseHead;
