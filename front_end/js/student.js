const GET = "GET";
const endPoint = "http://localhost:8888/questions";

let totalQuestionNumber = null;
let correctAnswers = [];

window.addEventListener('load', () => getAllQuestion())

const getAllQuestion = () => {
  const xhttp = new XMLHttpRequest();
  xhttp.open(GET, endPoint);  
  xhttp.send();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200)
      displayQuestions({ questions: JSON.parse(xhttp.responseText)});
  }
}

const displayQuestions = async ({ questions }) => {  
  totalQuestionNumber = questions.length;

  const questionsDisplayBlock = document.getElementById("questionsDisplayBlock");

  if (!questions.length)  {
    alert("There is no question yet. Please ask admin to create questions");
    questionsDisplayBlock.innerHTML = "There is no question yet. Please ask admin to create questions"
    return;
  }

  for (let i = 0; i < questions.length; ++i) {

    const { DESCRIPTION, QUESTION_NUMBER, CORRECT_ANSWER, FIRST_OPTION, SECOND_OPTION, THIRD_OPTION, FOURTH_OPTION } = questions[i];

    correctAnswers.push(CORRECT_ANSWER);

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
      
      option.appendChild(optionInput);
      option.appendChild(optionLabel);
      
      optionContainer.appendChild(option);
    }

    const hr = document.createElement("hr");
    
    const saveButton = document.createElement("button");
    saveButton.innerHTML = "Save to DB";
    
    displayQuestionContainer.appendChild(optionContainer);
    displayQuestionContainer.appendChild(hr);
    questionsDisplayBlock.appendChild(displayQuestionContainer);
  }
}

const checkScore = () => {
  const checkedOptions = document.querySelectorAll('.displayOptionInput:checked');

  console.log(correctAnswers)
  console.log(checkedOptions)

  if (checkedOptions.length !== totalQuestionNumber)
    alert("You must solve all questions!")
    
  
  let correctNum = 0;
  for (let i = 0; i < totalQuestionNumber; ++i) {
    const parentId = checkedOptions[i].parentNode.id;
    const checkedOptionNumber = parentId.substr(parentId.length - 1);

    if ((parseInt(checkedOptionNumber) + 1) ===  parseInt(correctAnswers[i])) {
      correctNum++;
    }
  }

  if (correctNum === correctAnswers.length) alert(`Congratulations🎉 You got all ${correctNum} quetions!`);
  else alert(`You can do better than this! You got ${correctNum}/${totalQuestionNumber} 😔`)
}

