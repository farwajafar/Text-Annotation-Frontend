import React from "react";
import { AppBar,Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  typography: {
    width: 72,
    height: 72,
    
  },

  avatar: {
    width: 72,
    height: 72,
    position: "absolute",
    top: 92,
    padding: 8,
    background: theme.palette.background.default,
    boxSizing: "content-box",
    left: "48%",
    transform: "translateX(-50%)",
    transition: theme.transitions.create("all", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    "& > img": {
      borderRadius: "50%",
    },
  },
}));

function UserNavbarHeader(props) {
  const user = useSelector(({ auth }) => auth.user);

  const classes = useStyles();
  // console.log(user.data);

  return (
    <AppBar
      position="static"
      style = {{background : 'yellowgreen',}}
      elevation={0}
      classes={{ root: classes.root }}
      className="user relative flex flex-col items-center "
    >
      <Typography
        
        className="username whitespace-no-wrap hidden sm:flex"
        padding="8"
        variant="h3"
      >
        User - {user.data.displayName}
      </Typography>
      {/* <Typography
        className="email text-13 mt-8 opacity-50 whitespace-no-wrap"
        color="inherit"
      >
        {user.data.email}
      </Typography> */}
      {/* <Avatar
        className={clsx(classes.avatar, "avatar")}
        alt="user photo"
        src={
          user.data.photoURL && user.data.photoURL !== ""
            ? user.data.photoURL
            : "assets/images/avatars/profile.jpg"
        }
      /> */}
    </AppBar>
  );
}

export default UserNavbarHeader;
