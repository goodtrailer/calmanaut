import { useState } from "react";
import { useParams } from "react-router-dom";
import * as Util from "../lib/Util";

type User = {
  username: string,
  createDate: Date,
  id: number,
};

export const ProfileId = (props: any) => {
  const [user, setUser] = useState<User | undefined | false>(undefined);
  const {id} = useParams();
  
  Util.get("users/" + id, Util.createDateReviver("createDate")).then(res => {
    setUser(res.user);
  }).catch(e => {
    setUser(false);
    console.error(e);
  });
  

  if (user === undefined)
    return <></>;

  if (user === false)
    return <p>User not found.</p>;

  return <>
    <h1>Profile</h1>
    <h2>{user.username}</h2>
    <p>Created on {user.createDate.toLocaleString()}</p>
  </>;
};
