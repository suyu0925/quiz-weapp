import questions from '../resource/res'

export class QuestionControl {
  questions = questions
  view_list: string[] = []
  vid = 0
  favorite_list: Set<string> = new Set<string>()
  wrong_list: Set<string> = new Set<string>()

  getNextQuestion(step = 1) {
    this.vid += step
    this.vid = Math.min(this.vid, this.view_list.length - 1)
    const qid = this.view_list[this.vid]
    return this.questions[parseInt(qid)]
  }
  getPreviousQuestion(step = 1) {
    this.vid -= step
    this.vid = Math.max(this.vid, 0)
    const qid = this.view_list[this.vid]
    return this.questions[parseInt(qid)]
  }
  isFavorite() {
    const qid = this.view_list[this.vid]
    return this.favorite_list.has(qid)
  }
  toggleFavorite() {
    const qid = this.view_list[this.vid]
    if (this.favorite_list.has(qid)) {
      this.favorite_list.delete(qid)
      return false
    } else {
      this.favorite_list.add(qid)
      return true
    }
  }
  getQuestionCount() {
    return this.questions.length
  }
  setFavoriteList(list: string[]) {
    this.favorite_list = new Set<string>(list)
  }
  isWrong(qid: string) {
    return this.wrong_list.has(qid)
  }
  setWrongList(list: string[]) {
    this.wrong_list = new Set<string>(list)
  }
  toggleWrong() {
    const qid = this.view_list[this.vid]
    if (this.favorite_list.has(qid)) {
      this.wrong_list.delete(qid)
      return false
    } else {
      this.wrong_list.add(qid)
      return true
    }
  }
  finishedYet() {
    return this.vid >= this.view_list.length - 1
  }
}
