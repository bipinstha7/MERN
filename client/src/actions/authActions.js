import {GET_ERRORS} from "./types";
import axios from "axios";

// Register User
export const registerUser = userData => dispatch => {
  axios.post("/api/users/register", userData)
    .then(result => console.log("result.data",result.data))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};