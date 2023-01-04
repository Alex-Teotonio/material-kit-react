
import {colors} from './Colors'

export default function setRandomColor() { 
  const intensities = [400, 500, 600, 700, 800, 900];
  return colors[Math.floor(Math.random() * colors?.length)][intensities[Math.floor(Math.random() * intensities?.length)]];
}