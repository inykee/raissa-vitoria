const blocos = document.querySelectorAll(".bloco");
const carrosselBg = document.getElementById("carrossel-bg");
const aviso = document.getElementById("aviso");
let indiceAtual = 0;
let travado = false;
let primeiraInteracao = false;

const audio1 = new Audio("assets/songs/my-love-mine-all-mine.mp3");
audio1.volume = 0.45; 
const audio2 = new Audio("assets/songs/congratulations.mp3");
audio2.volume = 0.45;

const track = document.querySelector("#carrossel-bg .carousel-track");
if(track && !track.dataset.duplicado){
    track.innerHTML += track.innerHTML;
    track.dataset.duplicado = "true";
}

function trocarBloco(proximo){
    if(travado || proximo >= blocos.length) return;
    travado = true;

    const atual = blocos[indiceAtual];
    const novo = blocos[proximo];

    atual.classList.remove("ativo");
    setTimeout(()=>{
        novo.classList.add("ativo");
        indiceAtual = proximo;
        travado = false;

        if(indiceAtual === blocos.length -1){
            document.body.addEventListener("click", finalizarUltimaMensagem, {once:true});
        }
    },400);
}

function proximoBloco(){
    if(indiceAtual < blocos.length -1){
        trocarBloco(indiceAtual +1);
    }
}

document.body.addEventListener("click", ()=>{
    if(!primeiraInteracao){
        primeiraInteracao = true;
        audio1.play().catch(err=>console.log("Erro ao tocar audio:", err));

        audio1.addEventListener("ended", ()=>{
            audio2.play().catch(err=>console.log("Erro ao tocar audio:", err));
        });
    }

    const blocoAtual = blocos[indiceAtual];
    if(blocoAtual.querySelector("button")) return;
    proximoBloco();
});

document.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click", e=>{
        e.stopPropagation();
        proximoBloco();
    });
});

function finalizarUltimaMensagem(){
    const ultimoBloco = blocos[blocos.length-1];
    ultimoBloco.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    ultimoBloco.style.opacity = 0;
    ultimoBloco.style.transform = "scale(0.95) translateY(20px)";
    
    if(aviso) aviso.style.display = "none";

    explodeConfetes();
    setTimeout(()=>{
        ultimoBloco.style.display = "none";
        carrosselBg.style.opacity = "1";
    },600);
}

function explodeConfetes(){
    for(let i=0;i<150;i++){
        const c = document.createElement("div");
        c.classList.add("confete");
        c.style.left = Math.random()*window.innerWidth+"px";
        c.style.backgroundColor = `hsl(${Math.random()*360},80%,65%)`;
        c.style.animationDuration = (2+Math.random()*3)+"s";
        document.body.appendChild(c);
        setTimeout(()=>c.remove(),5000);
    }
}

const style = document.createElement("style");
style.innerHTML = `
@keyframes confeteFall {
    to { transform: translateY(${window.innerHeight + 50}px) rotate(360deg); }
}`;
document.head.appendChild(style);
