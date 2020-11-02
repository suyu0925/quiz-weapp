type QuestionType = 'sequence' | 'random' | 'favorite'

interface Question {
  answer: string
  stem: string
  options: {
    content: string
    option: string
  }[]
  img: null | string
  no: number
}
