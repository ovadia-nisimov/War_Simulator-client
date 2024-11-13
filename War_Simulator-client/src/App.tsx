import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function App() {

  // const dispatch = useDispatch();
  // useEffect(()=>{
  //   const handlePublishVote = (candidateid: addVote) => {
  //     dispatch(addVotes(candidateid))
  //   }
  //   socket.on("updateVotes", handlePublishVote)
  //   return () => {
  //     socket.off("updateVotes", handlePublishVote)
  //   }
  // }, [socket])

  return (
    <div>
      
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Navigate to={"/login"} />} />
      </Routes>
    </div>
  );
}
