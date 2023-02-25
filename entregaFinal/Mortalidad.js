
    //////////////////////////////////////////////////
    /////Declaración de algunas funciones útiles//////
    //////////////////////////////////////////////////

    //Función que devuelve si un número se ha conseguido traducir a entero
    function esEntero(x){
    	var y = parseInt(x);
    	if (isNaN(y)) 
    		return false;
    	return true;
    }

    //Función que devuelve el color del que hay que representar el punto
    //en función del continente
    function color(d){
     	if (d.Continent == "Europa"){
     		return color_europa;
     	}
     	if (d.Continent == "Asia"){
     		return color_asia;
     	}
     	if (d.Continent == "Oceania"){
     		return color_oceania;
     	}
     	if (d.Continent == "Africa"){
     		return color_africa;
     	}
     	if (d.Continent == "America_Del_Norte"){
     		return color_america_del_norte;
     	}
     	if (d.Continent == "America_Del_Sur"){
     		return color_america_del_sur;
     	}
     	return "black";
     }


    //////////////////////////////////////////////////
    ////////////Declaración de constantes/////////////
    //////////////////////////////////////////////////

    //Dimensiones del gráfico
    var h = 650;
    var w = 650;

    //Márgenes del gráfico
    var margin_x = 100;
    var margin_y = 60;

    //Radio de los círculos en el gráfico de dispersión
    var radius = 4.5;

    //Límite de los ejes
    var maxXY = 800;

    //Número de marcas del GRID y de los ejes
    var n_ticks_grid = 8;
    var n_ticks_axis = 9;

    //Duracion de la animacion
    var duracion = 2000;


    //Colores de cada continente
    var color_europa = "DodgerBlue";
    var color_asia = "orange";
    var color_oceania = "Orchid";
    var color_africa = "Brown";
    var color_america_del_norte = "LimeGreen";
    var color_america_del_sur = "DimGrey";

    //Año inicialmente a representar
    var anyo = 2014;


    //////////////////////////////////////////////////
    /////Construcción e inicialización de objetos/////
    //////////////////////////////////////////////////


    //Encontrar los radio buttons de la página
	var radios = document.querySelectorAll('input[type=radio][name="anyo"]');

	//Seleccionar el año actual a representar
	radios.forEach(function(d){
		if(parseInt(d.id)==anyo){
			d.checked = true;
		}
	});

	//Encontrar los checkboxes de la página
    var europa = document.querySelector("input[name=Europa]");
    var asia = document.querySelector("input[name=Asia]");
    var oceania = document.querySelector("input[name=Oceania]");
    var africa = document.querySelector("input[name=Africa]");
    var america_del_norte = document.querySelector("input[name=America_Del_Norte]");
    var america_del_sur = document.querySelector("input[name=America_Del_Sur]");


    //Pintar el texto de los checkboxes del color correspondiente a su continente
    //a modo de leyenda
    d3.select(".Europa").style("color",color_europa);
    d3.select(".Asia").style("color",color_asia);
    d3.select(".Oceania").style("color",color_oceania);
    d3.select(".Africa").style("color",color_africa);
    d3.select(".America_Del_Norte").style("color",color_america_del_norte);
    d3.select(".America_Del_Sur").style("color",color_america_del_sur);


    //Seleccionar todos los checkboxes
    europa.checked = true;
    asia.checked = true;
    oceania.checked = true;
    africa.checked = true;
    america_del_norte.checked = true;
    america_del_sur.checked = true;


    //Crear un array que indica los continentes que se deben mostrar.
    //Inicialmente se dibujan todos
    var continentes = [
      {continente:"Europa", dibujar: europa.checked},
      {continente:"Asia", dibujar: asia.checked}, 
      {continente:"Oceania", dibujar: oceania.checked}, 
      {continente:"Africa", dibujar: africa.checked}, 
      {continente:"America_Del_Norte", dibujar: america_del_norte.checked}, 
      {continente:"America_Del_Sur", dibujar: america_del_sur.checked}, 
    ]


    //Escala de las X
    var xScale = d3.scaleLinear()
        .domain([0,maxXY+50])
        .range([0, w]); 



    //Escala de las Y
    var yScale = d3.scaleLinear()
        .domain([0,maxXY + 50])
        .range([h, 0]);



    //Ejes
    var xAxis = d3.axisBottom()
   		.scale(xScale)
   		.ticks(n_ticks_axis);

    var yAxis = d3.axisLeft()
   		.scale(yScale)
   		.ticks(n_ticks_axis);



   	//GRID
    var yGrid = d3.axisLeft()
		.scale(yScale)
		.ticks(n_ticks_grid)
		.tickSize(-w, 0, 0)
		.tickFormat("");

	var xGrid = d3.axisBottom()
		.scale(xScale)
		.ticks(n_ticks_grid)
		.tickSize(h, 0, 0)
		.tickFormat("");


	//Elemento SVG que va a soportar nuestro gráfico
	var svg = d3.select("body").append("svg")
		.attr("id","grafico")
		.attr("width", w + margin_x)
		.attr("height", h + margin_y + 60)
		.append("g")
		.attr("transform", "translate(" + margin_x + "," + margin_y + ")");


	//Añadir los ejes y el GRID
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + h + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis")
		.call(yAxis);

	svg.append("g")
		.attr("class", "grid")
		.call(yGrid);

	svg.append("g")
		.attr("class", "grid")
		.call(xGrid);



	//Añadir los títulos del Eje X y del Eje Y
	var tituloEjeX = svg.append("text").attr("class","tituloEjeX");
	var tituloEjeY = svg.append("text").attr("class","tituloEjeY");

	tituloEjeX.text("Mortalidad masculina")
		.attr("x",w - 250)
		.attr("y",h + 50);

	tituloEjeY.text("Mortalidad femenina")
		.attr("x",-250)
		.attr("y",-50)
		.attr("transform", "rotate(-90)");



	//Añadir la etiqueta flotante que proporciona información detallada de cada país
	//Se establece a totalmente transparente inicialmente
    var div = d3.select("body")
    	.append("div")
    	.attr("class", "tooltip")
    	.style("opacity", 1e-6);



    //Añadir el título del gráfico (esta fuera del elemento SVG)
    var title = d3.select("body")
        .append("div")
        .attr("class", "title")
        .style("left",(170 + margin_x + w/2 )+ "px")
        .style("top", (margin_y - 50) + "px");
		
	title.append("text")
		.text("Mortalidad masculina VS femenina");

    title.append("br");

    title.append("text")
    	.attr("class","subtitle")
    	.text("(nº fallecidos por cada 1000)");



   	//Añadir una línea correspondiente a la bisectriz del primer cuadrante
   	//Los puntos que estén por debajo de ella tienen más mortalidad masculina
   	//Los puntos por encima tienen más mortalidad femenina
	svg.append("line")
		.attr("class","bisectriz")
		.attr("x1",xScale(0))
		.attr("y1",yScale(0))
		.attr("x2",xScale(maxXY + 200))
		.attr("y2",yScale(maxXY + 200))


    //Se leen los datos
    d3.csv("datos.csv", function(error, data) {

    	//Registrar manejadores de eventos para los radio buttons
    	radios.forEach(function(d){
    		d.addEventListener('change',cambiarAnyo);
    	});

		//Registrar manejadores de eventos para los checkboxes
		europa.addEventListener( 'change', cambiarContinente);
		asia.addEventListener( 'change', cambiarContinente);
		oceania.addEventListener( 'change', cambiarContinente);
		africa.addEventListener( 'change', cambiarContinente);
		america_del_norte.addEventListener( 'change', cambiarContinente);
		america_del_sur.addEventListener( 'change', cambiarContinente);


    	//Se filtran los datos: se recogen únicamente aquellos de los continentes
    	//que se quieren representar. Se añade una columna x y una columna y que indica
    	//los datos a representar
      	var dataset = filtrarDatos();

		//Añadir los puntos
		//La animación hace que se muevan desde el (0,0) hasta su posición
		//La duración de la animación es aleatoria para dar sensación de un flujo
		//de puntos que salen constantemente del (0,0)
		svg.selectAll(".puntos")
			.data(dataset)
			.enter().append("circle")
			.attr("class", "puntos")
			.attr("r", radius)
			.style("fill",function(d){ return color(d); })
	    	.attr("cx",xScale(0))
	    	.attr("cy",yScale(0))
	    	.on("mouseover", handleMouseOver)
	    	.on("mouseout", handleMouseOut)
	   		.transition()
	    	.duration(function(d){return (Math.random()*duracion);})
	    	.attr("cx", function(d) { return xScale(d.x); })
	    	.attr("cy",  function(d) { return yScale(d.y); });



    	//Función que recibe el evento de selección de otro año y desencadena
   		//la modificación del gráfico
    	function cambiarAnyo(event) {
    		anyo = parseInt(this.value);
    		modificar_grafico();
    	}

    	//Función que recibe el evento de alguna modificación en los continentes
    	//y desencadena la modificación del gráfico
    	function cambiarContinente(event) {
    	    continentes[0].dibujar = europa.checked;
    	    continentes[1].dibujar = asia.checked;
    	    continentes[2].dibujar = oceania.checked;
    	    continentes[3].dibujar = africa.checked;
    	    continentes[4].dibujar = america_del_norte.checked;
    	    continentes[5].dibujar = america_del_sur.checked;
    	    modificar_grafico();
    	}

      	//Función que recibe el evento de situarse encima de un punto
      	function handleMouseOver(d, i) { 

      		//Doblar el tamaño del punto
          	d3.select(this).attr("r",2*radius);

          	//Preparar la etiqueta emergente: eliminamos todo su contenido
        	div.selectAll("text").remove();
        	div.selectAll("br").remove();

        	//Se sitúa la etiqueta en el lugar correspondiente
        	div.style("left", (d3.event.pageX ) + "px")
          		.style("top", (d3.event.pageY) + "px");

          	//Se añade el texto del punto correspondiente
        	div.append("text").text(d.Country);
        	div.append("br");
        	div.append("text").text("Mortalidad masculina: "+d.x);
        	div.append("br");
        	div.append("text").text("Mortalidad femenina: "+d.y);

        	//La etiqueta se hace visible poco a poco, para dar un toque elegante
        	div.transition()
        	.duration(300)
        	.style("opacity",1);
      	}


      	//Función que recibe el evento al quitar el ratón del punto
      	function handleMouseOut(d, i) {

      		//Se establece el punto a radio normal
            d3.select(this).attr("r",radius);

            //Se oculta la etiqueta
            div.transition()
                .duration(300)
                .style("opacity", 1e-6);
        }


        //Función que modifica el gráfico cuando se ha cambiado de continente o de año
      	function modificar_grafico (){

      		//Se guarda la posición antigua, necesaria para la animación
        	data.forEach(function(d){
         		d.xAnt = d.x;
          		d.yAnt = d.y;
        	});

        	//Se filtran los datos por continentes.
        	//Quitar o poner continentes no tendrá animación
        	dataset = filtrarDatos();

        	//Se necesita saber qué puntos van a ser eliminados
        	//Esto ocurre cuando sí había datos para el año anterior, pero no hay datos
        	//para el año seleccionado
        	puntosEliminar = data.filter(function(d){
        		return ( (esEntero(d.xAnt)) && (esEntero(d.x)==false) ) 
        	});

        	//Se eliminan los puntos que no son de los continentes seleccionados
        	//Estos puntos no tendrán animación
        	continentes.forEach(function(d){
          		if(d.dibujar == false){
            		puntosEliminar = puntosEliminar.filter(function(m){
            			return (m.Continent != d.continente)}
            		);
          		}
        	});

        	//Se eliminan todos los puntos
        	svg.selectAll(".puntos").remove();

        	//Se concatenan los puntos a representar con los puntos a eliminar
        	var animacion = dataset.concat(puntosEliminar);

        	//Para que la animación sea más llamativa, todos los puntos que se van
        	//a eliminar se irán de forma aleatoria a un nugar fuera de la pantalla
        	var aleatorio = [];
        	var aux = Math.sqrt(2*(maxXY+150)*(maxXY+150));
        	for(i = 0; i < puntosEliminar.length; i++){
          		aleatorio.push(Math.random()*aux);
        	}

        	//Se necesitarán más tarde
        	var num1 = -1;
        	var num2 = -1;
        

        	//Se van a modificar los puntos. Para ello:
        	//todos los puntos que antes estaban representados, se colocan en su posición
        	//antigua. Todos los que no estaban se colocan en el origen de coordenadas
        	//Cada punto se mueve a su nueva posición. Sin embargo, si el punto antiguo
        	//debe desaparecer porque no hay datos para este nuevo año, se coloca fuera
        	//de la pantalla
        	svg.selectAll(".puntos")
          		.data(animacion)
          		.enter().append("circle")
          		.attr("class","puntos")
          		.style("fill",function(d){return color(d)})
          		.attr("cx",function(d){
            		if(esEntero(d.xAnt)){
              			return xScale(d.xAnt);
            		} else {
              			return xScale(0);
            	}})
          		.attr("cy",function(d){
            		if(esEntero(d.yAnt)){
             			return yScale(d.yAnt);
            		} else {
              			return yScale(0);
            	}})
         	 	.attr("r",radius)
          		.on("mouseover",handleMouseOver)
          		.on("mouseout",handleMouseOut)
          		.transition()
          		.duration(function(d){return Math.random()*duracion})
          		.attr("cx",function(d){
            		if (esEntero(d.x)){
              			return xScale(d.x);
            		} else {
              			num1++;
              		return(xScale(aleatorio[num1]));
            	}})
          		.attr("cy",function(d){
            		if (esEntero(d.y)){
              			return yScale(d.y);
            		} else {
              			num2++;
              		return(yScale(Math.sqrt(aux*aux-aleatorio[num2]*aleatorio[num2])));
            	}});
      	}





      	//Esta función modifica el dataset y devuelve uno con los continentes seleccionados
      	//Preparar el dataset. Se va a añadir una columna x y otra y, de forma que
      	//la columna x contiene los datos a representar en el eje de las x y lo mismo para la y
      	//Además, se eliminan los continentes no seleccionados
      	function filtrarDatos (){

      		var dataset;

      		//Se selecciona el año, se modifica la columna de x e y (coordenadas a representar)
      		//en función de ese año
      		if(anyo == 2014){
          		data.forEach(function(d){
            		d.x = parseInt(d.Male2014);
            		d.y = parseInt(d.Female2014);
          		});
          		dataset = data.filter(function(d){return (d.Male2014 != "NA")});
        	}

        	if(anyo == 2013){
         	 	data.forEach(function(d){
            		d.x = parseInt(d.Male2013);
            		d.y = parseInt(d.Female2013);
          		});
          		dataset = data.filter(function(d){return (d.Male2013 != "NA")});
        	}

        	if(anyo == 2012){
          		data.forEach(function(d){
            		d.x = parseInt(d.Male2012);
            		d.y = parseInt(d.Female2012);
          		});
          		dataset = data.filter(function(d){return (d.Male2012 != "NA")});
        	}

        	if(anyo == 2011){
          		data.forEach(function(d){
            		d.x = parseInt(d.Male2011);
            		d.y = parseInt(d.Female2011);
          		});
          		dataset = data.filter(function(d){return (d.Male2011 != "NA")});
        	}

        	if(anyo == 2010){
          		data.forEach(function(d){
            		d.x = parseInt(d.Male2010);
            		d.y = parseInt(d.Female2010);
          		});
          		dataset = data.filter(function(d){return (d.Male2010 != "NA")});
        	}

        	if(anyo == 2005){
          		data.forEach(function(d){
            		d.x = parseInt(d.Male2005);
            		d.y = parseInt(d.Female2005);
          		});
          		dataset = data.filter(function(d){return (d.Male2005 != "NA")});
        	}

        	if(anyo == 2000){
          		data.forEach(function(d){
            		d.x = parseInt(d.Male2000);
            		d.y = parseInt(d.Female2000);
          		});
          		dataset = data.filter(function(d){return (d.Male2000 != "NA")});
        	}

        	if(anyo == 1995){
          		data.forEach(function(d){
            		d.x = parseInt(d.Male1995);
            		d.y = parseInt(d.Female1995);
          		});
          		dataset = data.filter(function(d){return (d.Male1995 != "NA")});
        	}

        	if(anyo == 1990){
          		data.forEach(function(d){
            		d.x = parseInt(d.Male1990);
            		d.y = parseInt(d.Female1990);
          		});
          		dataset = data.filter(function(d){return (d.Male1990 != "NA")});
        	}

        	continentes.forEach(function(d){
          		if(d.dibujar == false){
            		var dataset = dataset.filter(function(m){return (m.Continent != d.continente)});
          		}
       		});

        	return dataset;
      }

   	});
