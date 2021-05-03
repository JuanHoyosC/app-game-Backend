const upAttribute = (dificultad, usuario) => {
    if (dificultad <= 3) {
        usuario.saldo += gold(dificultad, usuario.nivel);
    } else {
        usuario.diamantes += diamond(dificultad, usuario.nivel);
    }

    usuario.experiencia += exp(dificultad, usuario.nivel);

    //Aumenta la vida
    usuario.vida += life(dificultad, usuario.nivel);
    usuario.vida_actual = lifeMax(usuario.nivel);
    if (usuario.vida >= usuario.vida_actual) usuario.vida = usuario.vida_actual;

    //Aumenta la experiencia
    if (usuario.experiencia >= expMax(usuario.nivel)) {
        usuario.nivel += 1;
        usuario.experiencia = 0;
        usuario.vida_actual = lifeMax(usuario.nivel);
        usuario.vida = usuario.vida_actual;
    }
}

const downAttribute = (dificultad, usuario) => {
    if (dificultad <= 3) {
        usuario.saldo -= gold(dificultad, usuario.nivel)
        if(usuario.saldo < 0) usuario.saldo = 0;
    } else {
        usuario.diamantes -= diamond(dificultad, usuario.nivel);
        if(usuario.diamantes < 0) usuario.diamantes = 0;
    }

    //Disminuye la vida
    usuario.vida -= life(dificultad, usuario.nivel);
    if(usuario.vida <= 0){
        usuario.vida = 0;
    }
    
    if (usuario.vida <= 0 && usuario.nivel > 1) {
        usuario.nivel -=1;
        usuario.vida_actual = lifeMax(usuario.nivel);
        usuario.vida = usuario.vida_actual;
    }

}

const diamond = (dificultad, nivel) => {
    return 2 * dificultad + nivel;
}

const expMax = (nivel) => {
    return nivel * 100;
}

const exp = (dificultad, nivel) => {
    return dificultad + nivel * 5;
}

const life = (dificultad, nivel) => {
    return dificultad + nivel * 5;
}

const lifeMax = (nivel) => {
    return nivel * 50;
}

const gold = (dificultad, nivel) => {
    return 4 * dificultad + nivel;
}


module.exports = {
    upAttribute,
    downAttribute
}