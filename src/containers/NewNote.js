import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./NewNote.css";

export default function NewNote() {
  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // const [noteResponse, setNoteResponse] = useState("");
  // useEffect(() => {
  //   createNote().then((noteResponse) => {
  //     setNoteResponse(noteResponse);
  //     console.log(noteResponse);
  //   });
  // });

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      // const attachment = file.current ? await s3Upload(file.current) : null;
      const attachment = file.current;

      // createNote({ content, attachment }).then((response) => {
      //   response.json().then((data) => {
      //     console.log(data.express);
      //   });
      // });

      await createNote(content);

      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function createNote(notes) {
    // return API.post("notes", "/notes", {
    //   body: note
    // });

    const request = {
      method : "post",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({workout : notes})
    };

    console.log(request);
    fetch('/post_workout', request).then(response => console.log(response));

    // fetch('./post_workout', request).then(res => console.log("Request complete! ", res));

    // const response = await fetch('/express_backend');
    // console.log(response);
    // const data = await response.json();
    // console.log(data);
    // return data.express;
  }

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <FormControl
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file">
          <ControlLabel>Attachment</ControlLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}