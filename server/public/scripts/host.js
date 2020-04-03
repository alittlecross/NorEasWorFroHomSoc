const updateHostOptions = _players => {
  $('select').html(_ => {
    let html = '<option value="" disabled selected>Select</option>'

    for (const id in _players) {
      html += `<option value="${id}">${_players[id].name}</option>`
    }

    return html
  })
}
