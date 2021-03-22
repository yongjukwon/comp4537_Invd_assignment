const answerIds = [2, 4, 2, 4, 4, 3];
let usrAnswers = [];

const validateForm = () => {
  answerIds.forEach((answer, inx) => {
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

  if (usrAnswers.length !== answerIds.length) {
    usrAnswers.length = 0;
    alert("You need to solve all questions!");
    return;
  }

  let bAllCorrect = true;
  usrAnswers.forEach((a) => {
    bAllCorrect = bAllCorrect && a;
  });

  colorIncorrectQs();
  alertMessage(bAllCorrect);

  usrAnswers.length = 0; // empty array for next submission
};

const colorIncorrectQs = () => {
  usrAnswers.forEach((a, inx) => {
    let qBlockId = "q".concat(inx + 1, "-block");
    document.getElementById(qBlockId).style.border = a ? "2px solid green" : "2px solid red";
  });
};

const alertMessage = (bAllCorrect) => {
  if (bAllCorrect === true) alert("Congratulations! You got all the questions correct! 🎉");
  else {
    let correctness = usrAnswers.filter((a) => a === true);
    alert(
      `You got ${correctness.length} questions out of 6 questions. Try again 😉 \n(The wrong answers will be wrapped with red box 🟥) \n`
    );
  }
};
