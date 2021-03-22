const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

// app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

const endPoint = 'http://localhost:8888';
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "yongjukw_INVD_ASMT"
})

app.get('/questions', async (req, res) => {
  /* GET all questions */
  getQuestions().then((result) => {
    res.end(result);
  })
})

const getQuestions = async () => {
  return new Promise((resolve, reject) => {
    const questionQuery = `SELECT q.DESCRIPTION, q.QUESTION_NUMBER, q.CORRECT_ANSWER, 
                                  a.FIRST_OPTION, a.SECOND_OPTION, a.THIRD_OPTION, a.FOURTH_OPTION
                            FROM QUESTION q 
                            INNER JOIN ANSWER_OPTION a ON q.ANSWER_OPTION_ID = a.ANSWER_OPTION_ID`;
    db.query(questionQuery, (err, result) => {
      if (err) return reject(err);
      console.log("GET REULTS: ", result);
      // console.log("GET FIELDS: ", fields);
      return resolve(JSON.stringify(result));
    })
  }).catch((err) => {
    console.log(err);
  })
}

app.post(`/questions`, async (req, res) => {  
  console.log("[POST] REQ.BODY: ", req.body); 
  res.writeHead(200, {"Content-Type": "text/html"}); 
  /* INSERT AnswerOptions */ 
    insertAnswerOption({ res: res, options: req.body.OPTIONS})
    .then((answerQueryResponse) => {
      /* INSERT Question */
      console.log(`ANSWER QUERY RESOPNSE: ${answerQueryResponse.insertId}`);

      const questionParams = {
        answerOptionId: answerQueryResponse.insertId,
        correctAnswer: req.body.CORRECT_ANSWER,
        description: req.body.DESCRIPTION, 
        questionNumber: req.body.QUESTION_NUMBER,
      }

      insertQuestion({question: questionParams})
        .then((insertQuestionResponse) => {
          const affectedRows = insertQuestionResponse.affectedRows;
          // console.log("[POST] INSERT QUESTION RESPONSE: ", insertQuestionResponse.affectedRows)
          res.end(affectedRows.toString());
        });
  })
})

app.put('/questions', (req, res) => {
  console.log("[PUT] REQ.BODY: ", req.body);
  res.writeHead(200, {"Content-Type": "text/html"});
  /* uppdateQuestion */
  updateQuestion({
    question: {
      DESCRIPTION: req.body.DESCRIPTION, 
      CORRECT_ANSWER: req.body.CORRECT_ANSWER, 
      QUESTION_NUMBER: req.body.QUESTION_NUMBER,
    }
  }).then((updateQuestionResponse) => {
      // console.log(`UPDATE QUESTION RESPONSE: `, updateQuestionResponse);
      getAnswerOptionId({ questionNumber: req.body.QUESTION_NUMBER})
        .then((getAnswerOptionIdReponse) => {
          const answerOptionId = Object.values(getAnswerOptionIdReponse)[0].ANSWER_OPTION_ID;

          updateAnswerOption({ answerOptionId: answerOptionId, options: req.body.OPTIONS })
            .then((updateAnswerOptionResponse) => {
              const affectedRows = updateAnswerOptionResponse.affectedRows;
              console.log(updateAnswerOptionResponse)
              res.end(affectedRows.toString());
            })
        })
  })
  
})

const getAnswerOptionId = ({ questionNumber }) => {
  return new Promise((resolve, reject) => {
    const getAnswerIdQuery = `SELECT ANSWER_OPTION_ID FROM QUESTION
                                WHERE QUESTION_NUMBER = "${questionNumber}"`

  db.query(getAnswerIdQuery, (err, result) => {
    if (err) return reject(err);
    console.log("H");
    console.log(result);
    return resolve(result);
  })                          
  })
}


const updateQuestion = ({ question }) => {
  const { DESCRIPTION, CORRECT_ANSWER, QUESTION_NUMBER } = question;

  return new Promise((resolve, reject) => {
    const updateQuestionQuery = `UPDATE QUESTION q SET ? WHERE ?`;

    const updateQuestionParams = [
      {
        DESCRIPTION: DESCRIPTION, 
        CORRECT_ANSWER: CORRECT_ANSWER
      }, {QUESTION_NUMBER: QUESTION_NUMBER }
      ];

    db.query(updateQuestionQuery, updateQuestionParams, (err, result) => {
      if (err) return reject(err);
      console.log(result);
      return resolve(result);
    })
  }) 
}

const updateAnswerOption = ({ answerOptionId, options }) => {
  const {option1, option2, option3, option4} = options;

  return new Promise((resolve, reject) => {
    const updateAnswerQuery = `UPDATE ANSWER_OPTION SET ? WHERE ?`;

    const updateAnswerParams = [
      {
        FIRST_OPTION: option1,
        SECOND_OPTION: option2,
        THIRD_OPTION: option3,
        FOURTH_OPTION: option4
      }, {ANSWER_OPTION_ID: answerOptionId }
    ]

    db.query(updateAnswerQuery, updateAnswerParams, (err, result) => {
      if (err) return reject(err);
      console.log(result);
      return resolve(result);
    })
  })
}

const insertAnswerOption = ({ options }) => {
  console.log(options);
  const { option1, option2, option3, option4 } = options;

  return new Promise((resolve, reject) => {
    const answerQuery = `INSERT INTO ANSWER_OPTION SET ?`

    const answerParams = {
      "FIRST_OPTION": option1,
      "SECOND_OPTION": option2,
      "THIRD_OPTION": option3 ? option3 : null,
      "FOURTH_OPTION": option4 ? option4 : null,
    }

    db.query(answerQuery, answerParams, (err, result) => {
      if (err) return reject(err);
      console.log(result);
      
      return resolve(result);
    });
  })
}

const insertQuestion = ({ question }) => {
  console.log("QUESTION: ", question);
  const { answerOptionId, correctAnswer, description, questionNumber } = question;

  return new Promise((resolve, reject) => {
    const questionQuery = `INSERT INTO QUESTION SET ?`

    const questionParams = {
      "ANSWER_OPTION_ID": answerOptionId,
      "QUESTION_NUMBER": questionNumber,
      "DESCRIPTION": description,
      "CORRECT_ANSWER": correctAnswer,
    };

    db.query(questionQuery, questionParams, (err, result) => {
      if (err) return reject(err);
      
      return resolve(result);
    })
  })
}

app.listen(8888, () => {
  console.log("Listing on 8888")
})
