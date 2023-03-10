const casoEl=document.querySelector('#caso')
window.addEventListener('mousemove', function(e) {
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight
    const cliente=false
    casoEl.style.cssText = `
        width: ${x * 100}vw;
        height: ${y * 100}vh;
        border-radius: 20px solid black;
        background: ${cliente? 'red' : 'blue'};
    `;
})
