import React from "react";
import { Overlay, Tooltip } from "react-bootstrap";

export default function ErrorTooltip({
  className = "",
  type = "",
  ...props
}) {
  return (
    <Overlay
      className={`ErrorTooltip ${className}`}
      {...props}
    >
      {(p) => (
        <Tooltip id="overlay-example" {...p}>
            {type == "empty" ? "This field cannot be empty."
              : type == "duplicate" ? "Please enter a non-existing set name." 
              : "error"
            }
        </Tooltip>
      )}
    </Overlay>
  );
}