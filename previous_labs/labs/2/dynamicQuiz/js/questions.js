class Questions {
  constructor() {
    this.arr = [];
    this.currentIndex = 0;
  }

  addQuestion(question) {

    let index = question.question_num - 1;

    if (this.arr[index]) {
      this.arr[index] = question;
      this.currentIndex = this.currentIndex + 1;
    } else {
      this.arr.push(question);
      this.currentIndex = this.currentIndex + 1;
    }
    // this.arr[this.currentIndex] = question;
    // this.currentIndex = this.currentIndex + 1;
  }

  saveQuestion(index, question) {
    this.arr[index] = question;
  }

  unSaveQuestion() {
    this.arr.pop();
  }

  deleteQuestion() {
    this.arr.pop();
    this.currentIndex = this.currentIndex - 1;
  }

  static class(obj) {
    let questions = new Questions();
    questions.arr = obj.arr;
    questions.currentIndex = obj.currentIndex;
    return questions;
  }
}

class Question {
  constructor(
    content,
    question_num,
    answer_one,
    answer_two,
    answer_three,
    answer_four,
    answer_key
  ) {
    this.content = content;
    this.question_num = question_num;
    this.answer_one = answer_one;
    this.answer_two = answer_two;
    this.answer_three = answer_three;
    this.answer_four = answer_four;
    this.answer_key = answer_key;
  }
}

export { Question, Questions };
