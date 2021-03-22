import { Question } from "./questions.js";

const noQuestionAlertMsg = "There is no quiz provided, please go to admin page and create quizes!";
const notCompleteAlertMsg = "You need to solve all questions!";
const qeustionContainerClass = "question-part";
const radioBtnsContainerClass = "optionsContainer";
const btnContainerClass = "form-check";
const radioBtnClass = "form-check-input";
const optionLblClass = "form-check-label";
const answerRadioBtnClass = "answerRadioBtn";
const answerLblClass = "answerLbl";
const correctBorderStyle = "2px solid #5f885f";
const wrongBorderStyle = "2px solid red";
const wrongColor = "red";
const correctColor = "#5f885f";

const noQuizQuestionsText = "There is no quiz provided, please go to admin page and create quizes!";
const localStorageKey = "questions";
const rootElementTag = "root";
const solveAllQuestionsText = "You need to solve all questions!";
const allQuestionsCorrectText = "Congratulations! You got all the questions correct! 🎉";

document.addEventListener("DOMContentLoaded", () => {
  let questionsStr = window.localStorage.getItem(localStorageKey);
  let questionsObject = JSON.parse(questionsStr);

  let questionObject = null;
  if (questionsStr === null || questionsObject.arr.length == 0) {
    alert(noQuizQuestionsText);
    let root = document.getElementById(rootElementTag);
    createBackBtn(root);
    return;
  } else {
    questionObject = JSON.parse(questionsStr);
  }

  let questions = questionObject["arr"];
  displayQuestions(questions);
});

const displayQuestions = (questions) => {
  let root = document.getElementById(rootElementTag);

  let answers = [];

  questions.map((q, inx) => {

    let qObj = new Question(
      q["content"],
      q["question_num"],
      q["answer_one"],
      q["answer_two"],
      q["answer_three"],
      q["answer_four"],
      q["answer_key"]
    );

    let questionContainer = document.createElement("div");
    questionContainer.id = "q" + qObj.question_num + "-block";
    questionContainer.classList.add("col-sm-12", "code-block");

    let questionHeader = document.createElement("h5");
    let questionHeaderTextNode = document.createTextNode("Q" + qObj.question_num);
    questionHeader.appendChild(questionHeaderTextNode);

    questionContainer.appendChild(questionHeader);
    root.append(questionContainer);


    let contentContainer = document.createElement("div");
    contentContainer.classList.add("question-part", "textarea");
    questionContainer.appendChild(contentContainer);

    contentContainer.innerHTML += highlightReservedWords(qObj.content);


    let optionsContainer = document.createElement("div");
    optionsContainer.classList.add("optionsContainer", "mt-3");
    questionContainer.appendChild(optionsContainer);

    let optOne = createOptions(qObj.answer_one, qObj.question_num, 1, qObj.answer_key);
    let optTwo = createOptions(qObj.answer_two, qObj.question_num, 2, qObj.answer_key);
    let optThree = createOptions(qObj.answer_three, qObj.question_num, 3, qObj.answer_key);
    let optFour = createOptions(qObj.answer_four, qObj.question_num, 4, qObj.answer_key);

    optionsContainer.appendChild(optOne);
    optionsContainer.appendChild(optTwo);
    optionsContainer.appendChild(optThree);
    optionsContainer.appendChild(optFour);

    answers.push(qObj.answer_key + 1);
  });

  createSubmitBtn(root, answers);
  createBackBtn(root);
};

const createOptions = (option, qNum, value, answerKey) => {
  let btnContainer = document.createElement("div");
  btnContainer.classList.add(btnContainerClass);

  let radioBtn = document.createElement("input");
  radioBtn.classList.add(radioBtnClass);
  radioBtn.setAttribute("type", "radio");
  radioBtn.setAttribute("name", "q" + qNum);
  radioBtn.setAttribute("value", value);

  let optionLbl = document.createElement("label");
  optionLbl.classList.add(optionLblClass);
  optionLbl.innerHTML += option;

  if (value == answerKey + 1) {
    radioBtn.classList.add(answerRadioBtnClass);
    optionLbl.classList.add(answerLblClass);
  }

  btnContainer.appendChild(radioBtn);
  btnContainer.appendChild(optionLbl);

  return btnContainer;
};

const createSubmitBtn = (root, answers, questionNums) => {
  let submitBtn = document.createElement("button");
  submitBtn.classList.add("btn", "btn-primary", "btn-space");
  submitBtn.innerHTML = "Submit";
  submitBtn.addEventListener("click", () => {
    validateForm(answers, questionNums);
  });

  root.appendChild(submitBtn);
};

const createBackBtn = (root) => {
  let backBtn = document.createElement("button");
  backBtn.innerHTML = "Back";
  backBtn.classList.add("btn", "btn-dark");
  backBtn.setAttribute("onclick", "location.href='./'");

  root.appendChild(backBtn);
};

const validateForm = (answers) => {
  if (answers.length !== getCheckedOptionsNumber()) {
    alert(solveAllQuestionsText);
    return;
  }

  resetOptionsCSS();

  let usrAnswers = [];

  answers.forEach((answer, inx) => {
    let qNum = "q" + (inx + 1);
    let options = document.getElementsByName(qNum);
    let usrAnswer = false;

    options.forEach((u) => {
      if (u.checked) {
        usrAnswer = parseInt(u.value);
        console.log(`${inx + 1}: ${usrAnswer === answer}`);
        usrAnswers.push(usrAnswer === answer);
      }
    });
  });

  let bAllCorrect = true;
  usrAnswers.forEach((a) => {
    bAllCorrect = bAllCorrect && a;
  });

  colorIncorrectQs(answers, usrAnswers);
  alertMessage(bAllCorrect, usrAnswers);

  usrAnswers.length = 0; // empty array for next submission
};

const colorIncorrectQs = (answers, usrAnswers) => {
  usrAnswers.forEach((a, inx) => {
    let qBlockId = "q".concat(inx + 1, "-block");
    let wrongAnswerInputSelector = "div#" + qBlockId + " > div > div > input:checked";
    let wrongAnswerLabelSelector = "div#" + qBlockId + " > div > div > input:checked+label";

    if (a) {
      document.getElementById(qBlockId).style.border = correctBorderStyle;
    } else {
      document.getElementById(qBlockId).style.border = wrongBorderStyle;
      document.querySelector(wrongAnswerInputSelector).style.backgroundColor = wrongColor;
      document.querySelector(wrongAnswerLabelSelector).style.backgroundColor = wrongColor;
      document.querySelector(wrongAnswerLabelSelector).style.color = "white";
    }
  });

  answers.map((a, inx) => {
    let qBlockId = "q".concat(inx + 1, "-block");
    let answerInputSelector = "div#" + qBlockId + " > div > div > .answerRadioBtn";
    let answerLabelSelector = "div#" + qBlockId + " > div > div > .answerLbl";
    document.querySelector(answerInputSelector).style.backgroundColor = correctColor;
    document.querySelector(answerLabelSelector).style.backgroundColor = correctColor;
    document.querySelector(answerLabelSelector).style.color = "white";
  });
};

const alertMessage = (bAllCorrect, usrAnswers) => {
  if (bAllCorrect === true) alert(allQuestionsCorrectText);
  else {
    let correctness = usrAnswers.filter((a) => a === true);
    alert(
      `You got ${correctness.length} questions out of ${usrAnswers.length} questions. Try again 😉 \n(The wrong answers will be wrapped with red box 🟥) \n`
    );
  }
};

const resetOptionsCSS = () => {
  let optionInputs = document.querySelectorAll(".form-check-input");
  let optionLabels = document.querySelectorAll(".form-check-label");

  for (let i = 0; i < optionInputs.length; ++i) {
    optionInputs[i].style.backgroundColor = "initial";
    optionLabels[i].style.backgroundColor = "initial";
    optionLabels[i].style.color = "initial";
  }
};

const getCheckedOptionsNumber = () => {
  let checkedOptionsSelector = document.querySelectorAll("input:checked");
  return checkedOptionsSelector.length;
};

const highlightReservedWords = (content) => {
  let words = content.split(/\s+/);
  let reservedWords = ['let', 'var', 'const', 'for', '{', '}', '(', ')', '+', '-', '*', '/', '='];
  let result = "";
  for (let word of words) {
    let lineBreak = " ";
    if (word.includes("?") || word.includes(";")) lineBreak += "<br>";

    if (reservedWords.includes(word)) {
      result += "<span class = 'reserved'>" + word + lineBreak + "</span>";
    } else {
      result += word + lineBreak;
    }
  }
  return result;
}