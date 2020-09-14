import React from "react";
import { useParams } from "react-router-dom";

export default function Notes() {
  const { set } = useParams();
  
  return (
    <div className="Play">
      Hello {set}
    </div>
  );
}