var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

const matrizPonderada = [
    [120,   -20,   20,    5,    5,   20,   -20,   120],
    [-20,	-40,   -5,	 -5,   -5, 	 -5,   -40,	  -20],
    [ 20,	 -5,   15,	  3,	3,	 15,	-5,	   20],
    [  5,	 -5,    3,	  3,	3,	  3,	-5,	    5],
    [  5,	 -5,    3,	  3,	3,	  3,	-5,	    5],
    [ 20,	 -5,   15,	  3,	3,	 15,	-5,	   20],
    [-20,	-40,   -5,	 -5,   -5, 	 -5,   -40,	  -20],
    [120,   -20,   20,    5,    5,   20,   -20,   120]
];



router.get("/", function (req, res) {
  res.send("Hello World!");
});

router.get("/reversi", function (req, res) {
    //http://www.misitio.com/index.php?turno=0&estado=22222222...............
    //Fichas -> Negras:0    Blancas:1   Matriz -> Espacio en Blanco:2 Negras:0    Blancas:1
    const fichaNegra = 0;
    const fichaBlanca = 1;
    const espacioBlanco = 2;
    console.log(req.query);
    var turno = req.query.turno;
    var estado = req.query.estado;
    var enviar = "";
    
    var matrizTablero = new Array(8);
    var destinos = new Array();
    
    //Llenando matrizTablero con el tablero;
    let contador = 0;
    for (let x = 0; x < 8; x++) {
        matrizTablero[x] = new Array(8);
        for (let y = 0; y < 8; y++) {
            //console.log(estado.charAt(contador));
            matrizTablero[x][y]=parseInt(estado[contador]);
            contador++;
        }
    }
    
    console.log('Mostrando matrizTablero de fichas del tablero: ');
    for (let x = 0; x < 8; x++) {
        let fila = "";
        for (let y = 0; y < 8; y++) {
            fila+=matrizTablero[x][y]+" ";
        }
        console.log(fila);
    }
    console.log("-----------------------------------------------")
    
    let fichaTurnoActual=-1;
    let fichaEnemigo=-1;
    
    if(turno == fichaBlanca){
        console.log('Turno Blanco: '+turno);
        console.log('Estado: '+estado);
        fichaTurnoActual = fichaBlanca;
        fichaEnemigo = fichaNegra;
    }else{  //fichas negras
        console.log('Turno Negro: '+turno);
        console.log('Estado: '+estado);
        fichaTurnoActual = fichaNegra;
        fichaEnemigo = fichaBlanca;
    }
    
    let estadoSiguiente = -1;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {

            if(matrizTablero[x][y] == fichaTurnoActual){
                //----------------- ARRIBA -----------------
                for (let x1 = x; x1 > -1; x1--) {
                    if(x1 > 0){ estadoSiguiente = matrizTablero[x1-1][y]; }
                    else{ break; }
                    if(estadoSiguiente == fichaEnemigo){ 
                        continue; }
                    else {
                        if(estadoSiguiente == fichaTurnoActual){
                            break;
                        }else if(estadoSiguiente == espacioBlanco){//Guardar la posicion
                            if(matrizTablero[x1][y] == fichaEnemigo){
                                let destino = {
                                    x: y,
                                    y: x1-1,
                                    ponderacion: matrizPonderada[x1-1][y]
                                }
                                destinos.push(destino);
                            }
                            break;
                        }
                    }
                }

                //----------------- ABAJO -----------------
                for (let x1 = x; x1 < 8; x1++) {
                    if(x1 < 7){ estadoSiguiente = matrizTablero[x1+1][y]; }
                    else{ break; }
                    if(estadoSiguiente == fichaEnemigo){ 
                        continue; }
                    else {
                        if(estadoSiguiente == fichaTurnoActual){
                            break;
                        }else if(estadoSiguiente == espacioBlanco){//Guardar la posicion
                            if(matrizTablero[x1][y] == fichaEnemigo){
                                let destino = {
                                    x: y,
                                    y: x1+1,
                                    ponderacion: matrizPonderada[x1+1][y]
                                }
                                destinos.push(destino);
                            }
                            break;
                        }
                    }
                }

                //----------------- IZQUIERDA -----------------
                for (let y1 = y; y1 > -1; y1--) {
                    if(y1 > 0){ estadoSiguiente = matrizTablero[x][y1-1]; }
                    else{ break; }
                    if(estadoSiguiente == fichaEnemigo){ 
                        continue; }
                    else {
                        if(estadoSiguiente == fichaTurnoActual){
                            break;
                        }else if(estadoSiguiente == espacioBlanco){//Guardar la posicion
                            if(matrizTablero[x][y1] == fichaEnemigo){
                                let destino = {
                                    x: y1-1,
                                    y: x,
                                    ponderacion: matrizPonderada[x][y1-1]
                                }
                                destinos.push(destino);
                            }
                            break;
                        }
                    }
                }

                //----------------- DERECHA -----------------
                for (let y1 = y; y1 < 8; y1++) {
                    if(y1 < 7){ estadoSiguiente = matrizTablero[x][y1+1]; }
                    else{ break; }
                    if(estadoSiguiente == fichaEnemigo){ 
                        continue; }
                    else {
                        if(estadoSiguiente == fichaTurnoActual){
                            break;
                        }else if(estadoSiguiente == espacioBlanco){//Guardar la posicion
                            if(matrizTablero[x][y1] == fichaEnemigo){
                                let destino = {
                                    x: y1+1,
                                    y: x,
                                    ponderacion: matrizPonderada[x][y1+1]
                                }
                                destinos.push(destino);
                            }
                            break;
                        }
                    }
                }

                //----------------- ARRIBA-DERECHA -----------------
                let xt = x;
                for (let y1 = y; y1 < 8; y1++) {
                    if(y1 < 7 && xt > 0){ estadoSiguiente = matrizTablero[xt-1][y1+1]; }
                    else{ break; }
                    if(estadoSiguiente == fichaEnemigo){ 
                        xt--;
                        continue; 
                    }else {
                        if(estadoSiguiente == fichaTurnoActual){
                            break;
                        }else if(estadoSiguiente == espacioBlanco){//Guardar la posicion
                            if(matrizTablero[xt][y1] == fichaEnemigo){
                                let destino = {
                                    x: y1+1,
                                    y: xt-1,
                                    ponderacion: matrizPonderada[xt-1][y1+1]
                                }
                                destinos.push(destino);
                            }
                            break;
                        }
                    }
                    xt--;
                }

                //----------------- ARRIBA-IZQUIERDA -----------------
                xt = x;
                for (let y1 = y; y1 > -1; y1++) {
                    if(y1 > 0 && xt > 0){ estadoSiguiente = matrizTablero[xt-1][y1-1]; }
                    else{ break; }
                    
                    if(estadoSiguiente == fichaEnemigo){ 
                        xt--;
                        continue; 
                    }else {
                        if(estadoSiguiente == fichaTurnoActual){
                            break;
                        }else if(estadoSiguiente == espacioBlanco){//Guardar la posicion
                            if(matrizTablero[xt][y1] == fichaEnemigo){
                                let destino = {
                                    x: y1-1,
                                    y: xt-1,
                                    ponderacion: matrizPonderada[xt-1][y1-1]
                                }
                                destinos.push(destino);
                            }
                            break;
                        }
                    }
                    xt--;
                }

                //----------------- ABAJO-IZQUIERDA -----------------
                let yt = y;
                for (let x1 = x; x1 < 8; x1++) {
                    if(x1 < 7 && yt>0){ estadoSiguiente = matrizTablero[x1+1][yt-1]; }
                    else{ break; }
                    
                    if(estadoSiguiente == fichaEnemigo){ 
                        yt--;
                        continue; }
                    else {
                        if(estadoSiguiente == fichaTurnoActual){
                            break;
                        }else if(estadoSiguiente == espacioBlanco){//Guardar la posicion
                            if(matrizTablero[x1][yt] == fichaEnemigo){
                                let destino = {
                                    x: yt-1,
                                    y: x1+1,
                                    ponderacion: matrizPonderada[x1+1][yt-1]
                                }
                                destinos.push(destino);
                            }
                            break;
                        }
                    }
                    yt--;
                }

                //----------------- ABAJO-DERECHA -----------------
                yt = y;
                for (let x1 = x; x1 < 8; x1++) {
                    if(x1 < 7 && yt < 7){ estadoSiguiente = matrizTablero[x1+1][yt+1]; }
                    else{ break; }
                    
                    if(estadoSiguiente == fichaEnemigo){ 
                        yt++;
                        continue; }
                    else {
                        if(estadoSiguiente == fichaTurnoActual){
                            break;
                        }else if(estadoSiguiente == espacioBlanco){//Guardar la posicion
                            if(matrizTablero[x1][yt] == fichaEnemigo){
                                let destino = {
                                    x: yt+1,
                                    y: x1+1,
                                    ponderacion: matrizPonderada[x1+1][yt+1]
                                }
                                destinos.push(destino);
                            }
                            break;
                        }
                    }
                    yt++;
                }

            }

        }
    }

    destinos = Ordenar(destinos);
    console.log("Destinos:")
    for (let a = 0; a < destinos.length; a++) {
        console.log(destinos[a]);
        enviar=destinos[a].y+""+destinos[a].x;
        //break;
    }

    if(destinos.length>0){
        let n = destinos.length-1;
        //enviar = destinos[n].y+""+destinos[n].x;
        enviar = destinos[n].x+""+destinos[n].y;
    }



    
    //console.log("ponderacion: "+ getPonderacion(5,3)); //3
    
    console.log("Coordenada Final: "+ enviar); //3
    //res.send(enviar.toString());
    res.send(enviar.toString());






});


function Ordenar(lista) {
    var n, i, k, aux;
    n = lista.length;
    for (k = 1; k < n; k++) {
        for (i = 0; i < (n - k); i++) {
            if (lista[i].ponderacion > lista[i + 1].ponderacion) {
                aux = lista[i];
                lista[i] = lista[i + 1];
                lista[i + 1] = aux;
            }
        }
    }
    return lista;
}

app.use(router);
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), ()=>{
    console.log ( `server on port ${app.get('port')}` )
});