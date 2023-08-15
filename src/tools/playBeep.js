import beepFile from '../assets/beep.wav'

const beep = new Audio(beepFile);

export default function () {
beep.play()
}