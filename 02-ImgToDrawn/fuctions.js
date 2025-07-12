//selección de elementos
const INPUT = document.getElementById('input');
const BTN = document.getElementById('btn-mostrar');
const BTN_GUARDAR = document.getElementById('btn-guardar');
const DIV = document.querySelector('div');
const P = document.querySelector('p');

//almacen de urls
let url="";


//Mostrar imagenes
BTN.addEventListener('click', () => {
    const IMG = document.createElement('img');
    url = INPUT.value;
    
    IMG.src= url;
    DIV.appendChild(IMG);

    P.textContent = url;
     

});

//guardar urls
BTN_GUARDAR.addEventListener('click', () =>{
    
        const P_GUARDAR = document.createElement('p');
        P_GUARDAR.textContent = INPUT.value;
        document.body.appendChild(P_GUARDAR);
    
});
