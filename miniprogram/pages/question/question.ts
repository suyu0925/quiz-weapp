// pages/sequence/sequence.js
import qs from '../../resource/res'
import { QuestionControl } from '../../utils/question_control'
const questioncontrol = new QuestionControl()

Page({
  data: {
    questions: qs,
    learning_type: 'sequence' as QuestionType,
    question: null as unknown as Question,
    answer: '',
    favorite: false,
    correctid: '',
    wrongid: '',
    disable: '',
    pending: false,
    animation: null as unknown as WechatMiniprogram.Animation
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options: { type: QuestionType }) {
    const t = options.type
    this.setData({ learning_type: t })
    // let questions = this.loadQuestions().questions
    const view_list_str = wx.getStorageSync(t + 'list') as string
    let favorite_list = wx.getStorageSync('favorite_list') as string[]
    if (favorite_list) {
      favorite_list = (favorite_list as unknown as string).split(',')
      questioncontrol.setFavoriteList(favorite_list)
    }
    if (t == 'favorite') {
      questioncontrol.view_list = favorite_list
      questioncontrol.vid = -1
      this.nextQuestion()
      return
    }
    let wrong_list = wx.getStorageSync('wrong_list') as string[]
    if (wrong_list) {
      wrong_list = (wrong_list as unknown as string).split(',')
      questioncontrol.setWrongList(wrong_list)
    }

    let vid = wx.getStorageSync(t + 'vid') as number
    if (vid) {
      vid = parseInt(String(vid))
    } else {
      vid = 0
    }

    if (vid > 3) {
      const view_list = view_list_str.split(',')
      wx.showModal({
        title: '是否继续学习',
        content: '上次你学习到' + String(vid + 1) + '个问题，是否继续？',
        success: res => {
          if (res.confirm) {
            questioncontrol.vid = vid - 1
            questioncontrol.view_list = view_list
            this.nextQuestion()
          }
          else {
            questioncontrol.vid = -1
            questioncontrol.view_list = this.generateList(t, questioncontrol.getQuestionCount())
            this.nextQuestion()
          }
        },
        fail: function () {
          // ignore
        }
      })
    } else {
      questioncontrol.vid = -1
      questioncontrol.view_list = this.generateList(t, questioncontrol.getQuestionCount())
      this.nextQuestion()
    }
  },
  generateList: function (t: string, count: number) {
    let list: string[] = []
    for (let i = 0; i < count; i++) {
      list.push(String(i))
    }
    if (t == 'random') {
      list = this.shuffle(list)
    }
    return list
  },

  shuffle: function (a: string[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  nextQuestion: function () {
    if (questioncontrol.finishedYet()) {
      wx.showModal({
        title: 'Congratulations!',
        content: '全部学完了',
      })
      return
    }
    const question = questioncontrol.getNextQuestion()
    const favorite = questioncontrol.isFavorite()
    this.setNewQuestion(question, favorite)
  },
  previousQuestion: function () {
    const question = questioncontrol.getPreviousQuestion()
    const favorite = questioncontrol.isFavorite()
    this.setNewQuestion(question, favorite)
  },
  setNewQuestion: function (question: Question, favorite: boolean) {
    this.setData({
      question: question,
      answer: question.answer,
      favorite: favorite,
      correctid: '',
      wrongid: '',
      disable: '',
      pending: false
    })
  },
  selectAnswer: function (evt: any) {
    const selected: string = evt.currentTarget.dataset.id
    const act = this.data.answer
    if (selected == act) {
      this.setData({
        correctid: selected,
        disable: 'disabled',
        pending: true
      })
      setTimeout(() => {
        this.nextQuestion()
      }, 1000)
    }
    else {
      this.setData({ wrongid: selected })
    }
  },
  addFavorite: function () {
    const isFavorite = questioncontrol.toggleFavorite()
    this.setData({ favorite: isFavorite })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    })

    animation.translate(10).step()
    animation.translate(-10).step()
    animation.translate(0).step()

    this.setData({
      animation,
      animationData: animation.export()
    })
  },

  onUnload: function () {
    const t = this.data.learning_type
    if (questioncontrol.finishedYet()) {
      wx.removeStorageSync(t + 'list')
      wx.removeStorageSync(t + 'vid')
      wx.setStorageSync('favorite_list', Array.from(questioncontrol.favorite_list).toString())
      return
    }
    wx.setStorageSync(t + 'list', questioncontrol.view_list.toString())
    wx.setStorageSync(t + 'vid', questioncontrol.vid)
    wx.setStorageSync('favorite_list', Array.from(questioncontrol.favorite_list).toString())
    return
  }
})
