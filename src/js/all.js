import { atRule } from "postcss"
import "../scss/all.css"
let validate = require("validate.js")

const ticketCard = document.querySelector('.ticketCard-area')
const regionSearch = document.querySelector('.regionSearch')
const searchResult = document.querySelector('.searchResult-text')
const addBtn = document.querySelector('.addBtn')
const formInof = document.querySelector('.formInof')
const message = document.querySelectorAll('[data-msg]')
const input = document.querySelectorAll('input[type=text], input[type=number], textarea')
const imgUpload = document.querySelector('#imgUpload')
const textPreview = document.querySelector('.textPreview')
const imgPreview = document.querySelector('#imgPreview')

addBtn.addEventListener('click', verification)
imgUpload.addEventListener('change', addImg)

function init() {
  getData()
  selectArea()
}
init()

let data = []
function getData() {
  fetch('https://mocki.io/v1/897631e8-e390-44bf-a20f-19dada06e841')
    .then(response => response.json())
    .then(ajaxData => {
      data.push(...ajaxData)
      renderCard('全部地區')
      renderC3()
    })
}

function renderCard(area) {
  let card = ''
  let num = 0
  data.forEach(item => {
    if(item.area === area || area === '全部地區') {
      card += `<li>
                <div class="ticketCard-img">
                  <a href="#">
                    <img src="${item.imgUrl}" alt="${item.name}">
                  </a>
                  <div class="ticketCard-region">${item.area}</div>
                  <div class="ticketCard-rank">${item.rate}</div>
                </div>
                <div class="ticketCard-content"> 
                  <h3><a href="#" class="ticketCard-name fw-bold pb-2 mb-3">${item.name}</a></h3>
                  <p class="ticketCard-description">${item.description}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <p class="display-10">
                      <span><i class="bi bi-clock-history"></i></span>
                      剩下最後 <span class="ticketCard-num fw-bold" >${item.group}</span> 組
                    </p>
                    <p>TWD <span class="ticketCard-price display-8 fw-bold">${item.price}</span></p>
                  </div>
                </div>
              </li>`
      num++
    }
  })
  if(regionSearch.value === '地區搜尋') {
    searchResult.textContent = ''
  } else {
    searchResult.textContent = `本次搜尋共 ${num} 筆資料`
  }
  ticketCard.innerHTML = card
}

function selectArea() {
  regionSearch.addEventListener('change', (e) => {
    let value = e.target.value
    renderCard(value)
  })
}

let imgSrc = ''
function addImg(e) {
  textPreview.innerHTML = `<label class="form-label">預覽圖片</label>`
  const fileData = e.target.files[0]
  imgPreview.src = URL.createObjectURL(fileData)
  imgSrc = imgPreview.src
}

function verification(e) {
  e.preventDefault()
  const constraints = {
    '套票名稱': {
      presence: {
        allowEmpty: false,
        message: '是必填欄位'
      }   
    },
    '景點地區': {
      presence: {
        allowEmpty: false,
        message: '是必填欄位'
      }
    },
    '金額': {
      presence: {
        allowEmpty: false,
        message: '是必填欄位'
      }
    },
    '星級': {
      presence: {
        allowEmpty: false,
        message: '是必填欄位'
      },
      numericality: {
        greaterThanOrEqualTo: 1,
        lessThanOrEqualTo: 10,
        message: "必須符合 1-10 的區間"
      }
    },
    '套票組數': {
      presence: {
        allowEmpty: false,
        message: '是必填欄位'
      },
      numericality: {
        greaterThan: 0,
        message: "必須大於 0"
      }
    },
    '套票描述': {
      length: {
        maximum: 100,
        message: '限 100 字'
      }
    },
  }
  let obj = {
    id: Date.now(),
    name: document.querySelector('#ticketName').value.trim(),
    area: document.querySelector('#ticketRegion').value.trim(),
    imgUrl: imgSrc,
    price: Number(document.querySelector('#ticketPrice').value),
    rate: Number(document.querySelector('#ticketRate').value),
    group: Number(document.querySelector('#ticketNum').value),
    description: document.querySelector('#ticketDescription').value.trim()
  }
  let error = validate(formInof, constraints)
  if(error) {
    message.forEach(item => {
      item.textContent = ''
      item.textContent = error[item.dataset.msg]
    })
    input.forEach(inputItem => {
      inputItem.addEventListener('change', (e) => {
        let targetName = inputItem.name
        let error = validate(formInof, constraints)
        inputItem.nextElementSibling.textContent = ''
        if(error) { 
          document.querySelector(`[data-msg = '${targetName}']`).textContent = error[targetName]
        }
      })
    })
  } else {
    addTicket(obj)
  }
}

function renderC3() {
  let areaObj = {}
  data.forEach(item => {
    areaObj[item.area] === undefined ? areaObj[item.area] = 1 : areaObj[item.area]++
  })
  let newData = []
  let areaAry = Object.keys(areaObj)
  areaAry.forEach(item => {
    let ary = []
    ary.push(item)
    ary.push(areaObj[item])
    newData.push(ary)
  })
  const chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: newData,
      type : 'donut',
      colors: {
        '高雄': '#E68618',
        '台中': '#5151D3',
        '台北': '#26BFC7'
      }
    },
    donut: {
      title: '套票地區比重',
      width: 16,
      label: {
        threshold: 1
      }
    },
    size : { 
      height : 240, 
      width : 240 
    }
  })
}

function addTicket(item) {
  data.push(item)
  formInof.reset()
  imgPreview.src = ''
  textPreview.innerHTML = ''
  renderCard('全部地區')
  renderC3()
}
