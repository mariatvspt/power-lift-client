import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";

export default function Notes() {
  const { set } = useParams();
  
  return (
    <div className="Play">
      Hello {set}
    </div>
  );
}