$(document).ready(_ => {
  $('#copy-link').click(function () {
    const origin = location.origin
    const path = $(this).data('path')

    navigator.clipboard.writeText(origin + path)
  })
})
