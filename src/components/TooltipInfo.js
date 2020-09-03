import React from "react";
import { Button, Overlay, OverlayTrigger, Tooltip } from "react-bootstrap";

export default function TooltipInfo({
  className = "",
  type = "",
  // type hover
  text,
  index,
  hoverButton,
  ...props
}) {
  return (
    <>
      { type == "hover" ?
        <OverlayTrigger
          overlay={
            <Tooltip id="button-tooltip-2">
              {text}
            </Tooltip>}>
            {hoverButton}
        </OverlayTrigger>
      : <Overlay className={`ErrorTooltip ${className}`} {...props}>
      {(p) => (
        <Tooltip id="overlay-example" {...p}>
            {type == "empty" ? "This field cannot be empty."
              : type == "duplicate" ? "Please enter a non-existing set name." 
              : {type}
            }
        </Tooltip>
      )}
    </Overlay>}
    </>
  );
}