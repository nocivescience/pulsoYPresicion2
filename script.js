window.addEventListener('mousemove', function(e) {
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight
    document.body.style.backgroundColor = `rgb(${x * 255}, ${y * 255}, 100)`
})