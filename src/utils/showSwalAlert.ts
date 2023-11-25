import { CustomSwal } from '../components/custom-swal'

const showSwalError = (text: string) => {
  if (!CustomSwal.isVisible()) {
    return CustomSwal.fire({
      icon: 'error',
      text
    })
  }

  return null
}

const showSwalSuccess = (text: string) => {
  return CustomSwal.fire({
    icon: 'success',
    text
  })
}

export { showSwalError, showSwalSuccess }
