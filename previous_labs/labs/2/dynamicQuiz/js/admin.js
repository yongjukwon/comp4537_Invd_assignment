import { Question, Questions } from "./questions.js";

const questionContainerTag = "questionsContainer";
const buttonContainerTag = "buttonsContainer";
const addButtonTag = "addButton";
const saveButtonTag = "saveButton";
const deleteButtonTag = "deleteButton";
const savingNotificationTag = "savingNotification";

const unableToSaveText = "Unable to save question as no answer was selected";
const emptyQuestionBankText = "Question bank is already empty... add a question";
const addButtonText = "Add";
const saveButtonText = "Save Changes";
const deleteButtonText = "Delete";
const backButtonText = "Back";
const localStorageKey = "questions";
const uncheckedQuestionText = "Please ensure all questions have answers!";
const autoSaveTimer = 4000; // Autosaving every 2 seconds was too quick
document.addEventListener("DOMContentLoaded", (event) => {
  let questions = window.localStorage.getItem(localStorageKey);

  if (!questions) {
    window.localStorage.setItem(localStorageKey, JSON.stringify(new Questions()));
    questions = window.localStorage.getItem(localStorageKey);
  }
  let qObj = JSON.parse(questions);
  if (qObj.arr.length > 0) {
    initializeExistingQuestions();
  } else {
    createFormArea(qObj);
  }

  addButtons();
  window.setInterval(() => {
    autoSaveAnswers();
  }, autoSaveTimer);
});

const initializeExistingQuestions = () => {
  let qObj = JSON.parse(window.localStorage.getItem(localStorageKey));

  for (let i = 0; i < qObj.arr.length; ++i) {
    initializeExistingQuestionForm(qObj.arr[i]);
  }
};

const initializeExistingQuestionForm = (qObj) => {

  let inputForm = document.createElement("form");
  inputForm.id = "question" + qObj.question_num;
  inputForm.className = "form_inputs mb-3";
  inputForm.innerHTML = createInnerHtmlForm(qObj.question_num);

  inputForm.querySelector("textarea").value = qObj.content;

  let answerOneSelector = "input[name='answer_one']";
  let answerTwoSelector = "input[name='answer_two']";
  let answerThreeSelector = "input[name='answer_three']";
  let answerFourSelector = "input[name='answer_four']";
  inputForm.querySelector(answerOneSelector).value = qObj.answer_one;
  inputForm.querySelector(answerTwoSelector).value = qObj.answer_two;
  inputForm.querySelector(answerThreeSelector).value = qObj.answer_three;
  inputForm.querySelector(answerFourSelector).value = qObj.answer_four;

  let radio_buttons = inputForm.getElementsByClassName("radio_option");

  for (let i = 0; i < radio_buttons.length; i++) {
    if (i == qObj.answer_key) {
      radio_buttons[i].checked = true;
    }
  }

  questionsContainer.appendChild(inputForm);
};

const createFormArea = (qObj) => {
  let inx = qObj.arr.length + 1;

  let inputForm = document.createElement("form");
  inputForm.id = "question" + inx;
  inputForm.className = "form_inputs mb-3";
  inputForm.innerHTML = createInnerHtmlForm(inx);

  questionsContainer.appendChild(inputForm);
};

const destroyFormArea = (qNum) => {

  let extraEmptyForm = document.getElementById("question" + (qNum + 1));
  if (extraEmptyForm) {
    extraEmptyForm.remove();
  } else {
    let lastQuestion = document.getElementById("question" + qNum);
    if (lastQuestion) lastQuestion.remove();
  }
};

const createInnerHtmlForm = (num) => {
  let str =
    `<h6 class = 'questionHeader'> Question ` +
    num +
    `</h6>
    <textarea class="mb-2 input_question" rows="6" cols = "40"></textarea>
    <p> Answers* </p>
    <input class = "radio_option" type="radio" name="answer">
    <input type="text" class="option_answer" name="answer_one"/> 
    <br/>
    <input class = "radio_option" type="radio" name="answer">
    <input type="text" class="option_answer" name="answer_two"/> 
    <br/>
    <input class = "radio_option" type="radio" name="answer">
    <input type="text" class="option_answer" name="answer_three"/> 
    <br/>
    <input class = "radio_option" type="radio" name="answer">
    <input type="text" class="option_answer" name="answer_four"/> 
    <br/>
    <hr/>
  `;

  return str;
};

const addBackButton = () => {
  let backButton = document.createElement("BUTTON");
  let text = document.createTextNode(backButtonText);

  backButton.classList.add("btn", "btn-info", "m-4");
  backButton.appendChild(text);

  backButton.setAttribute("onclick", 'window.location.href = "./"');

  root.appendChild(backButton);
};
const getCurrentNumber = () => {
  let questions = window.localStorage.getItem(localStorageKey);
  let questionsObject = JSON.parse(questions);
  return questionsObject.currentIndex + 1;
};

const bEmptyUnsavedFormExists = () => {
  let questions = Questions.class(JSON.parse(window.localStorage.getItem(localStorageKey)));
  let num = questions.currentIndex;
  let extraEmptyForm = document.getElementById("question" + (num + 1));
  if (extraEmptyForm) return true;
};

const deleteFromJSON = () => {
  let questions = Questions.class(JSON.parse(window.localStorage.getItem(localStorageKey)));
  let num = questions.currentIndex;
  if (questions.currentIndex <= 0 || questions.arr.length < 0) {
    alert(emptyQuestionBankText);
    return;
  } else if (questions.currentIndex <= 0) {
    questions.unSaveQuestion();
  } else {
    if (bEmptyUnsavedFormExists()) {
    } else {
      questions.deleteQuestion();
      if (num !== 1) {
      }
    }
  }

  let questionsJSON = JSON.stringify(questions);
  window.localStorage.setItem(localStorageKey, questionsJSON);
};

const getSelectedAnswer = () => {
  let questionContainer = document.getElementById("question" + getCurrentNumber());
  if(!questionContainer) return -1;
  let radioButtons = questionContainer.getElementsByClassName("radio_option");
  let index = 0;

  for (let button of radioButtons) {
    if (button.checked) return index;
    index++;
  }

  return -1;
};

const autoSaveAnswers = () => {
  let savingSpan = document.getElementById(savingNotificationTag);
  if (getSelectedAnswer() == -1) {
    savingSpan.innerHTML = unableToSaveText;
  } else {
    saveQuestions();
    savingSpan.innerHTML = "Saved!";
  }
};

const saveQuestions = () => {
  let questions = Questions.class(JSON.parse(window.localStorage.getItem(localStorageKey)));
  let formDivs = document.getElementsByClassName("form_inputs");

  for (let div of formDivs) {
    let questionNumber = div.id[div.id.length - 1];
    let content = div.getElementsByClassName("input_question")[0].value;
    let inx = questionNumber - 1;

    let optn_answers = div.getElementsByClassName("option_answer");
    let radio_buttons = div.getElementsByClassName("radio_option");
    let selected = -1;

    for (let i = 0; i < radio_buttons.length; i++) {
      if (radio_buttons[i].checked == true) {
        selected = i;
        break;
      }
    }

    if (selected == -1) {
      alert(uncheckedQuestionText);
      return;
    }

    let question = new Question(
      content,
      questionNumber,
      optn_answers[0].value,
      optn_answers[1].value,
      optn_answers[2].value,
      optn_answers[3].value,
      selected
    );
    questions.saveQuestion(inx, question);
  }

  window.localStorage.setItem(localStorageKey, JSON.stringify(questions));
};

const addButtons = (qObj) => {
  let buttonContainer = document.getElementById(buttonContainerTag);
  let addTextNode = document.createTextNode(addButtonText);
  let saveTextNode = document.createTextNode(saveButtonText);
  let deleteTextNode = document.createTextNode(deleteButtonText);

  let addButton = document.createElement("BUTTON");
  addButton.id = addButtonTag;
  addButton.classList.add("btn", "btn-success", "m-1");

  let backButton = document.createElement("BUTTON");
  let text = document.createTextNode(backButtonText);
  backButton.classList.add("btn", "btn-info", "m-1");
  backButton.appendChild(text);
  backButton.setAttribute("onclick", 'window.location.href = "./"');

  let saveButton = document.createElement("BUTTON");
  saveButton.classList.add("btn", "btn-primary", "m-1");
  saveButton.id = saveButtonTag;

  let deleteButton = document.createElement("BUTTON");
  deleteButton.classList.add("btn", "btn-danger", "m-1");
  deleteButton.id = deleteButtonTag;

  deleteButton.addEventListener("click", () => {
    deleteEmptyDiv();
    deleteFromJSON();
  });

  addButton.addEventListener("click", () => {
    let questions = Questions.class(JSON.parse(window.localStorage.getItem(localStorageKey)));
    let inx = questions.currentIndex + 1;

    let selectedAnswer = getSelectedAnswer();
    if (selectedAnswer == -1) {
      alert(unableToSaveText);
      return;
    } else {
      let questionDiv = document.getElementById("question" + inx);
      if (questionDiv === null) {
        questionDiv = document.getElementById("question" + (inx - 1));
        questions.currentIndex = questions.currentIndex - 1;
      }
      let question = questionDiv.getElementsByClassName("input_question");
      let answers = questionDiv.getElementsByClassName("option_answer");
      let q = new Question(
        question[0].value,
        inx,
        answers[0].value,
        answers[1].value,
        answers[2].value,
        answers[3].value,
        selectedAnswer
      );
      questions.addQuestion(q);
      window.localStorage.setItem(localStorageKey, JSON.stringify(questions));
      createFormArea(questions);
    }
  });

  saveButton.addEventListener("click", () => {
    saveQuestions();
  });

  addButton.appendChild(addTextNode);
  saveButton.appendChild(saveTextNode);
  deleteButton.appendChild(deleteTextNode);

  let savingSpan = document.createElement("SPAN");
  savingSpan.id = savingNotificationTag;

  buttonContainer.appendChild(addButton);
  buttonContainer.appendChild(saveButton);
  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(backButton);
  buttonContainer.appendChild(savingSpan);
};


const deleteEmptyDiv = () => {
  let questions = Questions.class(JSON.parse(window.localStorage.getItem(localStorageKey)));
  let indexToDelete = questions.currentIndex + 1;
  let questionDiv = document.getElementById("question" + indexToDelete);
  if(questionDiv && indexToDelete > 1){
    questionDiv.remove();
  }
}