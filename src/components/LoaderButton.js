import React from "react";
import { Button, Spinner } from "react-bootstrap";
import "./LoaderButton.css";

export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      variant="dark"
      size="lg"
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner animation="border" />}
      {props.children}
    </Button>
  );
}