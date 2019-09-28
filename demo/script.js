import moment from 'moment-timezone'
import Origin from '../src/Origin'
import Horoscope from '../src/Horoscope'
import { decimalDegreesToDMS } from '../src/utilities/math'
import { dmsString, signDecimalDegrees, signDMS } from '../src/utilities/copy'

class DemoApp {
  constructor() {
    this.form = document.querySelector('#form')
    this.dateInput = document.querySelector('#date')
    this.timeInput = document.querySelector('#time')
    this.latitudeInput = document.querySelector('#latitude')
    this.longitudeInput = document.querySelector('#longitude')
    this.houseSystemSelect = document.querySelector('#houseSystem')

    this.midheavenElement = document.querySelector('#midheaven')
    this.ascendantElement = document.querySelector('#ascendant')
    this.housesElement = document.querySelector('#houses')

    this.displayDateTime = this.displayDateTime.bind(this)
    this.loadHouseSystemSelect = this.loadHouseSystemSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.displayDateTime()
    this.loadHouseSystemSelect()
    this.form.addEventListener('submit', this.handleSubmit)
  }

  displayDateTime() {
    const today = moment(new Date())
    this.dateInput.value = today.format('YYYY-MM-DD');
    this.timeInput.value = today.format('HH:mm:00')
  }

  loadHouseSystemSelect() {
    Horoscope.HouseSystems.forEach(system => {
      var opt = document.createElement('option');
      opt.value = system
      opt.appendChild(document.createTextNode(system))
      this.houseSystemSelect.appendChild(opt)
    })

    this.houseSystemSelect.value = "placidus"

  }

  handleSubmit(e) {
    e.preventDefault()
    const timestamp = moment(`${this.dateInput.value} ${this.timeInput.value}`)
    const locationTimeData = new Origin({
      year: timestamp.year(),
      month: timestamp.month(),
      date: timestamp.date(),
      hour: timestamp.hours(),
      minute: timestamp.minutes(),
      latitude: this.latitudeInput.value,
      longitude: this.longitudeInput.value
    })

    const horoscope = new Horoscope({
      origin: locationTimeData,
      houseSystem: this.houseSystemSelect.value
    })

    this.midheavenElement.innerHTML = `${horoscope.midheaven} || ${dmsString(decimalDegreesToDMS(horoscope.midheaven))} || ${signDecimalDegrees(horoscope.midheaven)} || ${signDMS(horoscope.midheaven)}`

    this.ascendantElement.innerHTML = `${horoscope.ascendant} || ${dmsString(decimalDegreesToDMS(horoscope.ascendant))} || ${signDecimalDegrees(horoscope.ascendant)} || ${signDMS(horoscope.ascendant)}`

    horoscope.houseCusps.forEach((cusp, index) => {
      document.querySelector(`#house-${index + 1}a`).innerHTML = cusp
      document.querySelector(`#house-${index + 1}b`).innerHTML = signDMS(cusp)
    })
  }
}


new DemoApp()