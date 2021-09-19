import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@mui/material/TextField";
import "./Questionnaire.css";

const Questionnaire = () => {
  const initialDisplay = <div>start answering questions </div>;

  const [display, setDisplay] = useState();
  const [Id, setId] = useState(-1);
  const [questionType, setquestionType] = useState(-1);
  const [question, setQuestion] = useState("-1");
  const [options, setOptions] = useState([]);
  const [answer, setAnswers] = useState([]);
  const [number_of_questions, setNumOfQuestions] = useState(0);

  const serverurl = "http://www.seniyr.com/api";

  useEffect(() => {
    if (process.env.REACT_APP_ENV === "PRODUCTION") {
      console.log("ih");
      axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";
      axios
        .get(serverurl + "/quetions/dir99/description")
        .then((res) => {
          console.log(Number(res.data.number));
          setNumOfQuestions(Number(res.data.number));
        })
        .catch((err) => {
          console.log(`An error occurred: ${err}`);
        });
    }
  }, []);
  // else
  // setNumOfQuestions(3)

  const endOfQuestionnaire = () => {
    const quesionnaire_end_page =
      "We will get back to you with the best matching results!";
    setId(Id + 1);
    setDisplay(quesionnaire_end_page);
  };

  function chooseAnswer(index, unique) {
    let ansList = answer;
    if (unique) ansList.fill(0);
    ansList[index] = 1 - ansList[index];
    setAnswers(ansList);
    setTimeout(() => {
      const opts = options;
      setOptions([]);
      setOptions(opts);
    }, 0);
  }

  function handleQuestion(q) {
    if (q === null) throw Error;
    const qval = q.value;
    console.log(`qval:${qval}`);
    setQuestion(qval);
    console.log(q.quetiontype);
    setquestionType(q.quetiontype);

    if (q.quetiontype === "number") {
      console.log(`question type is number`);
      // lets by default display list
      const options_len = Object.keys(q.options).length;
      console.log(options_len);
      // const ansList = Array(options_len).forEach(0);
      let ansList = Array(options_len);
      ansList.fill(0);
      setAnswers(ansList); // answer list is update asynchronously, So don't worry.
      setOptions(q.options);
    }
    return;
  }

  const setToInitial = () => {
    setDisplay(initialDisplay);
    setId(-1);
    setquestionType(-1);
    setQuestion("-1");
    setOptions([]);
    setAnswers([]);
  };
  const fetchQuestion = (idnum) => {
    const id = Number(Id) + idnum;
    setId(id);
    if (id === -1) return setToInitial();
    const q_url = serverurl + "/quetions/dir99/fetch" + id;
    axios
      .get(q_url)
      .then((res) => {
        handleQuestion(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="questionnaire">
      <br />
      <br />
      <br />
      <br />

      <div id="question-part">
        {(() => {
          if (Id === -1) {
            return <Fragment>Start answering questions</Fragment>;
          } else if (Id >= 0 && Id < number_of_questions) {
            if (questionType === "number") {
              return (
                <Fragment>
                  <div className="question">{question}</div>
                  <br />
                  <div>
                    <ul>
                      {options.map((option, index) => {
                        const option_chosen =
                          answer[index] === 1 ? "chosen_option" : "";
                        // console.log(answer[index]);
                        const option_i = (
                          <li
                            key={index}
                            className={`option ${option_chosen}`}
                            onClick={() => chooseAnswer(index, false)}
                          >
                            {option}
                          </li>
                        );
                        return option_i;
                      })}
                    </ul>
                  </div>
                </Fragment>
              );
            } else if (questionType === "text") {
              return (
                <Fragment>
                  <div className="question">{question}</div>
                  <br />
                  <TextField id="standard-basic" label="" variant="standard" />
                </Fragment>
              );
            }
          } else {
            return (
              <Fragment>
                We will get back to you with the best matching results!
              </Fragment>
            );
          }
        })()}
      </div>
      <br />
      <br />
      <div id="question-navigation">
        {Id >= 0 && Id < number_of_questions && (
          <Button
            id="prevbtn"
            variant="contained"
            color="primary"
            onClick={() => fetchQuestion(-1)}
          >
            Previous
          </Button>
        )}
        {Id < number_of_questions - 1 && (
          <Button
            id="nextbtn"
            variant="contained"
            color="primary"
            onClick={() => fetchQuestion(1)}
          >
            Next
          </Button>
        )}
        {Number(Id) === number_of_questions - 1 && number_of_questions !== 0 && (
          <Button
            id="donebtn"
            variant="contained"
            color="primary"
            onClick={() => endOfQuestionnaire()}
          >
            Done
          </Button>
        )}
        {Id === number_of_questions && Id !== -1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
