const OPTION_MIN_NUM = 2;
const OPTION_MAX_NUM = 4;

const GET = "GET";
const PUT = "PUT";
const POST = "POST";
const endPoint = "http://localhost:8888/questions";

let questionNumberToUpdate = null;

const handleAnswerInput = (action) => {
  let optionCount = document.getElementsByClassName("optionInputContainer").length;
  
  console.log(action);
  console.log(`OPTION COUNT: ${optionCount}`)
  
  if (action === "add" && optionCount < OPTION_MAX_NUM) {
    createOption(++optionCount);
  }
  else if (action === "remove" && optionCount > OPTION_MIN_NUM) {
    removeOption(optionCount--);
  }
}

window.addEventListener('load', () => getAllQuestion())

const getAllQuestion = () => {
  const xhttp = new XMLHttpRequest();
  xhttp.open(GET, endPoint);  
  xhttp.send();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200)
      console.log("RESPONSE IN ADMIN:" , xhttp.responseText);
      displayQuestions({ questions: JSON.parse(xhttp.responseText)});
  }
}

const createOption = (optionCount) => {
  const optionContainer = document.getElementById("optionContainer");

  const answerInputContainer = document.createElement("div");
  answerInputContainer.id = `option${optionCount}`;
  answerInputContainer.className = "optionInputContainer";
  
  const optionButton = document.createElement("input");
  optionButton.id = `option${optionCount}Button`;
  optionButton.type = "radio";
  optionButton.name = "answer";
  
  const optionLabel = document.createElement("label");
  optionLabel.className = "optionLabel";
  optionLabel.htmlFor = `option${optionCount}`;

  const optionInput = document.createElement("input");
  optionInput.className = "optionInput";
  optionInput.type = "text";

  optionLabel.innerHTML =  `Option ${optionCount}.`; /* space */
  answerInputContainer.appendChild(optionButton);
  answerInputContainer.appendChild(optionLabel);
  answerInputContainer.appendChild(optionInput);
  optionContainer.appendChild(answerInputContainer);
}

const removeOption = (optionCount) => {
  let optionToBeRemoved = document.getElementById(`option${optionCount}`);
  optionToBeRemoved.remove();
}

const handleOnPost = async () => {
  console.log("HANDLE ON POST");

  const questionDescription = document.getElementById("questionTextArea").value;
  const optionInputContainers = document.getElementsByClassName("optionInputContainer");

  const body = createRequestBody(questionDescription, optionInputContainers);
  console.log(body);

  const jsonBody = JSON.parse(body);
  if (jsonBody.CORRECT_ANSWER === "null") {
    alert("Please choose the answer");
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open(POST, endPoint);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(body);
  xhttp.onreadystatechange = () => {
    console.log(`xhttp.readyState: ${xhttp.readyState}, xhttp.status: ${xhttp.status}`)
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      const insertedRows = xhttp.responseText;
      alert(`${insertedRows} row(s) is/are successfully inserted into the database`);
      clearInput();
      location.reload();
    } 
  }
}

const handleOnPut = () => {
  console.log("HANDLE ON PUT");

  const questionDescription = document.getElementById("questionTextArea").value;
  const optionInputContainers = document.getElementsByClassName("optionInputContainer");

  const body = createRequestBody(questionDescription, optionInputContainers);
  console.log(body);

  const xhttp = new XMLHttpRequest();
  xhttp.open(PUT, endPoint);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(body);
  xhttp.onreadystatechange = () => {
    console.log(`xhttp.readyState: ${xhttp.readyState}, xhttp.status: ${xhttp.status}`)
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      const insertedRows = xhttp.responseText;
      if (insertedRows) {
        alert(`The question was successfully updated in the database`);
        clearInput();
        location.reload();
      }
    } 
  }
}

const clearInput = () => {
  const inputs = document.getElementsByTagName("input");
  const textareas = document.getElementsByTagName("textarea");
  
  for (const input of inputs)
    input.value = "";

  for (const textarea of textareas)
    textarea.value = "";
}

const createRequestBody = (questionDescription, optionInputContainers, ) => {
  let formattedDescription = questionDescription.replaceAll('\n', " ");
  let body = `{"DESCRIPTION": "${formattedDescription}", "OPTIONS": {`
  let answer = null;
  const questionNumber = 
      document.getElementById('postBtn').disabled 
        ? questionNumberToUpdate 
        : document.getElementsByClassName("displayQuestionContainer").length;

  for (let i = 0; i < optionInputContainers.length; ++i) {
    const option = optionInputContainers[i];
    const optionButton = option.children[0];
    const inputNode = option.children[2];

    body += `"${option.id}": "${inputNode.value}"`
    if (i !== (optionInputContainers.length - 1))
      body += ", "

    if (optionButton.checked) answer = i + 1;
  }
  body += `}, "CORRECT_ANSWER": "${answer}", "QUESTION_NUMBER": "${questionNumber}" }`;


  console.log(body);
  
  return body;
}

const displayQuestions = async ({ questions }) => {
  const questionsDisplayBlock = document.getElementById("questionsDisplayBlock");

  for (let i = 0; i < questions.length; ++i) {

    const { DESCRIPTION, QUESTION_NUMBER, CORRECT_ANSWER, FIRST_OPTION, SECOND_OPTION, THIRD_OPTION, FOURTH_OPTION } = questions[i];

    const options = [FIRST_OPTION, SECOND_OPTION, THIRD_OPTION, FOURTH_OPTION];
    const notNullOptions = options.filter(option => option !== null);

    /* Create Question */
    const displayQuestionContainer = document.createElement("div");
    displayQuestionContainer.id = `question${QUESTION_NUMBER}`;
    displayQuestionContainer.className = "displayQuestionContainer";
  
    const questionHeader = document.createElement("h5");
    questionHeader.textContent = `✏️ Q${QUESTION_NUMBER}.`;

    const questionTextArea = document.createElement("textarea");
    questionTextArea.id = `displayQuestion${QUESTION_NUMBER}TextArea`
    questionTextArea.rows = 5;
    questionTextArea.cols = 50;
    questionTextArea.textContent = DESCRIPTION;
    questionTextArea.disabled = true;

    displayQuestionContainer.appendChild(questionHeader);
    displayQuestionContainer.appendChild(questionTextArea);
  
    /* Create Options */
    const optionContainer = document.createElement("div");
    optionContainer.id = `displayOptionForQ${QUESTION_NUMBER}Container`;
    optionContainer.className = "displayOptionContainer";
    
    for (let i = 0; i < notNullOptions.length; ++i) {
      const option = document.createElement("div");
      option.id = `question${QUESTION_NUMBER}option${i}`;
      option.className = `question${QUESTION_NUMBER}displayOptions`

      const optionLabel = document.createElement("label");
      optionLabel.htmlFor = option.id;
      optionLabel.textContent = notNullOptions[i];

      const optionInput = document.createElement("input");
      optionInput.type = "radio"
      optionInput.className = "displayOptionInput"
      optionInput.name = `answerForQ${QUESTION_NUMBER}`;
    

      if ((i + 1) == CORRECT_ANSWER) optionInput.checked = true;
      else optionInput.disabled = true;
      
      option.appendChild(optionInput);
      option.appendChild(optionLabel);
      
      optionContainer.appendChild(option);
    }
  
    const updateButton = document.createElement("button");
    updateButton.id = `updateButtonForQ${QUESTION_NUMBER}`;
    updateButton.innerHTML = "Move Data to the form to update";
    updateButton.addEventListener("click", 
              () => moveDataToUpdate(QUESTION_NUMBER, questionTextArea.id, optionContainer.id));

    const hr = document.createElement("hr");
    
    const saveButton = document.createElement("button");
    saveButton.innerHTML = "Save to DB";
    
    displayQuestionContainer.appendChild(optionContainer);
    displayQuestionContainer.appendChild(updateButton);
    displayQuestionContainer.appendChild(hr);
    questionsDisplayBlock.appendChild(displayQuestionContainer);
  }
}

const moveDataToUpdate = async (questionNumber, textAreadId, optionContainerId) => {
  document.getElementById('postBtn').disabled = true;

  questionNumberToUpdate = questionNumber;

  const questionTextArea = document.getElementById(textAreadId);
  const optionContainer = document.getElementById(optionContainerId);
  const optionNumber = optionContainer.childElementCount;
  
  /* TextArea */
  const updateTextArea = document.getElementById("questionTextArea");
  console.log(questionTextArea.textContent);
  updateTextArea.textContent = questionTextArea.textContent;

  /* Options */
  const currentOptionsNumber = document.getElementById("optionContainer").childElementCount;
  if (currentOptionsNumber > optionNumber) {
    for (let i = currentOptionsNumber; i > optionNumber; --i) {
     removeOption(i);
    }
    
  } else if (optionNumber > currentOptionsNumber) {
    for (let i = currentOptionsNumber + 1; i <= optionNumber; ++i) {
     createOption(i);
    }
  }

  const optionClassName = `question${questionNumber}displayOptions`;
  const toBeUpdatedOptions = document.getElementsByClassName(optionClassName);

  for (let i = 1; i <= toBeUpdatedOptions.length; ++i) {
    const updatingOption = document.getElementById(`option${i}`);
    const tobeUpdated = toBeUpdatedOptions[i - 1];
    
    if (updatingOption.childNodes.length < 7) {
      updatingOption.childNodes[2].value = tobeUpdated.textContent;
    } else {
      updatingOption.childNodes[5].value = tobeUpdated.textContent;
    }

    if (tobeUpdated.childNodes[0].checked) 
      document.getElementById(`option${i}Button`).checked = true;
  }  
}