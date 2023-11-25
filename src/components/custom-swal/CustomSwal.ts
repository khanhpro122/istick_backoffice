import Swal from 'sweetalert2'

export const CustomSwal = Swal.mixin({
  customClass: {
    confirmButton: '',
    cancelButton: ''
  },
  // buttonsStyling: false,
  reverseButtons: true
})
