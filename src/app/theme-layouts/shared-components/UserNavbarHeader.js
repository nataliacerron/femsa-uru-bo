import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { getUserById } from "app/store/userSlice";
import { useDispatch } from "react-redux";

const Root = styled("div")(({ theme }) => ({
  "& .username, & .email": {
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },

  "& .avatar": {
    background: theme.palette.background.default,
    transition: theme.transitions.create("all", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    bottom: 0,
    "& > img": {
      borderRadius: "50%",
    },
  },
}));

function UserNavbarHeader(props) {
  const dispatch = useDispatch();
  const userDatos = useSelector(selectUser);
  const [userData, setUserData] = useState([]);
  const [dispatched, setDispatched] = useState(false);
  /*useEffect(() => {
    dispatch(getUserById(userDatos.id)).then((res) => {
      setUserData(res.payload);
      console.log('res.payload', res.payload)
      setDispatched(true);
    });

  }, []);*/

  console.log("userDatos", userDatos);
  return (
    <Root className="user relative flex flex-col items-center justify-center p-16 pb-14 shadow-0">
      <div className="flex items-center justify-center mb-24">
        <Avatar
          sx={{
            backgroundColor: "background.paper",
            color: "text.secondary",
            border: "solid",
            borderColor: "#6B7280",
            borderWidth: "1px",
          }}
          className="avatar text-32 font-bold w-96 h-96"
          src={userDatos?.photo_url}
          alt={userDatos?.email}
        ></Avatar>
      </div>
      <Typography className="username text-14 whitespace-nowrap font-medium">{userDatos?.first_name + " " + userDatos?.last_name}</Typography>
      <Typography className="email text-13 whitespace-nowrap font-medium" color="text.secondary">
        {userDatos?.email}
      </Typography>
    </Root>
  );
}

export default UserNavbarHeader;
