const getFrecuency = ( frecuencia ) => {
    if(frecuencia === 'Diario') return 1;
    if(frecuencia === 'Dos dias') return 2;
    if(frecuencia === 'Semanal') return 15;
    if(frecuencia === 'Mensual') return 30;
    return 1;
}

const getDificultad = ( dificultad ) => {
    if(dificultad === 'Sencillo') return 1;
    if(dificultad === 'Fácil') return 2;
    if(dificultad === 'Mediano') return 3;
    if(dificultad === 'Díficil') return 4;
    return 1;
}



module.exports = { getFrecuency, getDificultad }
 
