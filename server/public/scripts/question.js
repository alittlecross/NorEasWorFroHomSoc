$(document).ready(_ => {
  $('#picture-url').on('input', _ => {
    const url = $('#picture-url').val()

    $('.img-container img').attr('src', url)

    if (url) {
      $('.img-container').removeAttr('hidden')
    } else {
      $('.img-container').attr('hidden', true)
    }
  })

  $('.img-card').click(function () {
    const url = $('img', this).attr('src')

    $('#img-container-enlarged img').attr('src', url)

    $('#img-container-enlarged').removeAttr('hidden')
  })

  $('#img-container-enlarged').click(_ => {
    $('#img-container-enlarged').attr('hidden', true)

    $('#img-container-enlarged img').attr('src', '')
  })
})
