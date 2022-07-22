# Webpack 5 VidaNr calculator
Webpack 5 VidaNr NacionalRe Calculator

<!-- DESARROLLO -->

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de contenidos</summary>
  <ol>
   <li><a href="#desarrollo">Desarrollo</a></li>
    <li>
      <a href="#calculadora-vida">Calculadora Vida</a>
      <ul>
        <li><a href="#introducción">Introducción</a></li>
                <li><a href="#pasos">Pasos</a></li>
        <li><a href="#validación-del-formulario">Formulario</a></li>
         <li><a href="#variables-principales">Variables principales</a>
            <ul>
                <li><a href="#género">Género</a></li>
                <li><a href="#edad">Edad</a></li>
                <li><a href="#peso">Peso</a></li>
                <li><a href="#altura">Altura</a></li>
                 <li><a href="#IMC">IMC</a></li>
                 <li><a href="#tabaco-y-alcohol">Tabaco y alcohol</a></li>
                  <li><a href="#presión-arterial">Presión arterial</a></li>
                      <li><a href="#colesterol-total">Colesterol total</a></li>
            </ul>
         </li>
          <li><a href="#cálculo-inicial-de-los-recargos">Cálculo inicial de los recargos</a>
            <ul>
                <li><a href="#alcohol">Alcohol</a></li>
                <li><a href="#colesterol">Colesterol</a></li>
                <li><a href="#hipertensión">Hipertensión</a></li>
                <li><a href="#índice-de-masa-muscular">Índice de masa muscular</a></li>
                 <li><a href="#tensión">Tensión</a></li>
                  <li><a href="#tabaco">Tabaco</a></li>
            </ul>
         </li>
                <li><a href="#calculo-de-la-variable-nagra">Cálculo de la variable nagra</a></li>
                <li><a href="#calculo-del-factor-máximo">Cálculo del factor máximo</a></li>
                <li><a href="#calculo-final-de-los-recargos">Cálculo final de los recargos</a></li>
                 <li><a href="#cálculos-adicionales">Cálculos adicionales</a></li>
         </li>
      </ul>
    </li>
      <li><a href="#traducción">Traducción</a></li>
    <li><a href="#licencia">Licencia</a></li>
    <li><a href="#referencias">Referencias</a></li>
    <li><a href="#contactos">Contactos</a></li>
  </ol>
</details>


# Desarrollo
Las calculadoras han sido desarrolladas con los lenguajes HTML, CSS y Javascript con la ayuda del empaquetador de módulos [WebPack 5](https://github.com/webpack/webpack).
Webpack se define como un empaquetador de módulos (un bundler en la jerga habitual) pero que hace muchísimas cosas más:

- Gestión de dependencias
- Ejecución de tareas
- Conversión de formatos
- Servidor de desarrollo
- Carga y uso de módulos de todo tipo (AMD, CommonJS o ES2015)


> Webpack se puede considerar como un Task Runner muy especializado en el procesamiento de unos archivos de entrada para convertirlos en otros archivos de salida, para lo cual utiliza unos componentes que se denominan loaders.


## Instalación

- Entrar en la raiz de la carpeta e instalar las dependencias.

```bash
cd 20220119 VidaNr
npm install
```


- Abrir el proyecto en el navegador
http://localhost:8080/

```bash
//  Start Dev Server
npm start
```



## Construir para producción

Building local

```sh
npm run build
```

Building NacionalRe (see package.json)

```sh
npm run build:nacionalRe
```

## Languages:Spanish and English.

Default language is Spanish.

```sh
http://localhost:8080/?lang=es
```

```sh
http://localhost:8080/?lang=en
```

On server:

```sh
https://www.botsoul.com/pruebas/nacionalRe-vidaNr/build/?lang=es
```

```sh
https://www.botsoul.com/pruebas/nacionalRe-vidaNr/build/?lang=en
```




## Features:

- ES6 Support via [babel](https://babeljs.io/) (v7)
- JavaScript Linting via [eslint](https://eslint.org/)
- SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
- Autoprefixing of browserspecific CSS rules via [postcss](https://postcss.org/) and [postcss-preset-env](https://github.com/csstools/postcss-preset-env)
- Style Linting via [stylelint](https://stylelint.io/)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.




# Calculadora de vida

## Introducción
Esta aplicación interactiva calcula los recargos de los seguros de vida, invalidez, accidente y enfermedad grave atendiendo a las observaciones realizadas para el índice de masa muscular, el nivel de tabaco, la ingesta de alcohol, los niveles de tensión arterial y el nivel de colesterol.

Además, en la versión en castellano, calcula la esperanza de vida según el agravamiento y siguiendo las tablas de mortalidad de la población asegurada española PASEM 2010 y GKMF95.

El mercado español en general utiliza las tablas suizas GKMF 95 para el cálculo de prima y reservas del negocio de Vida que involucre riesgo de fallecimiento. 

## Pasos

Para realizar los cálculos, estos serían los pasos principales en orden de realización:

- VALIDACIÓN DEL FORMULARIO: Las campos del formularios son: age, gender, weight, height, IMC, tobacco, alcohol, systolic_1, diastolic_1, systolic_2 (opcional), diastolic_2 (opcional), cholesterol.
- CALCULO DE LAS VARIABLES PRINCIPALES: Las variables finales que calculamos con estos datos son: 
age, actuarial_age, imc, imc_ILT, tobacco, tobacco_ILT, alcohol, alcohol_ILT, tension, cholesterol.
- CALCULO PARCIAL DE LOS RECARGOS: Una vez recogidas estas variables, tenemos que calcular los recargos para:
lnImc, lnImc_ILT, lnTobacco, lnTobacco_ILT, lnAlcohol, lnAlcohol_ILT, lnTension, lnCholesterol.
- CALCULO DE LA VARIABLE NAGRA: Según los recargos de cada variable, se aplica una tasa o factor adicional que llamaremos NAGRA. Sólo existe una variable NAGRA, que se calcula con las variables LIFE (no ILT) y su finalidad es totalizar el número de agravantes que recaen a una persona (1, 2, 3, 4, o 5). Este factor se aplica luego a todas las tarifas.
Para este recargo, se clasifican los siguientes agravantes:
lnImc, lnTobacco, lnAlcohol, lnTension y lnCholesterol.
Cada agravante dará un factor (0 o 1), que luego se sumarán (el resultado puede ser 0 si los cinco agravantes suman 0 o puede llegar hasta 5). Este sumatorio es la variable que hemos llamado Nagra.
- CALCULO DEL FACTOR MÁXIMO DE VIDA:
Para el caso del seguro de vida, se necesita comprobar si el riesgo excede un umbral máximo.
En el caso de superarlo se rechazarán todas tarificaciones de seguros. Esta variable la llamaremos $inMax y necesita la variable Nagra para su cálculo.
- CALCULO FINAL DE LOS RECARGOS:
Finalmente, se aplican las fórmulas para cada seguro.


A continuación se pueden consultar dos pdf con casos prácticos de todo el recorrido hasta llegar al cálculo final.
* [Caso 1](pdf/insurance_calculations_1.pdf).
* [Caso 2](pdf/insurance_calculations_2.pdf).
## Validación del formulario
El primer paso sería la validación de las entradas del formulario. 
El formulario es un documento creado en HTML con unos mínimos ajustes de CSS y mucha interactividad realizada con Javascript.

![Formulario vidaNr][formulario vidaNr]

## Variables principales
- Todos los campos del formulario son obligatorios.
- Los campos para Tabaco y Alcohol están rellenados por defecto con el valor 0.
- Todos los campos tienen un mensaje de alerta ('Campo obligatorio') en el caso de que no estén rellenos.
- El botón de Calcular no se activa hasta que todos los campos sean correctos.
- El teclado tiene desactivado la tecla ENTER para que no corran los campos si se pulsa.




### Género
Dos inputs excluyentes del tipo Radio: Hombre y mujer.
Esta varible será luego importante para calcular distintas patologías.
Es un campo obligatorio.


### Edad
Un input de tipo Date.

- La fecha no puede ser nunca mayor que el día en el que estamos.
"La fecha seleccionada no puede ser mayor que la fecha actual: Por favor, asegúrese de que la fecha es correcta".

- La edad debe estar en un rango entre 13 y 69 años.
"Atención: Fecha fuera de rango".

```bash
date >= 13 && date <=69
```

- Es un campo obligatorio: "La edad debe ser mayor de 13 y menor de 69. Tarificación cancelada".



### Peso
Input de tipo Number.

- Cifra en kilos sin decimales.
- El peso debe ser mayor de 32 kilos.

```bash
weight > 32
```
Es un campo obligatorio: "El peso debe ser mayor de 32 kilos. Faltan datos impresindibles".

### Altura
Input de tipo Number.

- Cifra en centímetros sin decimales.
- La altura debe ser mayor de 120 centímetros.

```bash
height > 120
```
Es un campo obligatorio: "La altura introducida es muy baja. Campo obligatorio".

### IMC
Cálculo directo.
La altura la convertimos a metros y se multiplica por dos.

Peso / ((altura / 100) * 2)

```bash
    w = Number(cm) / 100;
   _imc = (Number(_weight) / (Number(w) * Number(w))).toFixed(2);
```


- Si el índice de masa muscular en menor de 20. se aplicará el color azul a la cifra.

```bash
   if (val < 20) {
        input.classList.add("blue");
        return false;
    }
```


- Si el IMC está en comprendido entre 20 y 28, se aplicará el color verde a la cifra.

```bash
   if (val >= 20 && val <= 28) {
        input.classList.add("green");
        return false;
    }
```

- Si el IMC es mayor de 28 se aplicará el color rojo.





### Tabaco y alcohol
Inputs de tipo Number.

- Cifras sin decimales y siempre positivas.
- Por defecto, se asigna 0.

### Presión arterial
Inputs de tipo Number.

- Al menos debe introducirse una toma (sistólica y diástolica).

- Si se introducen dos tomas, se hace la media entre ambas.

```bash
systolic = (systolic_1 + systolic_2) / 2
diastolic = (diastolic_2 + diastolic_2) / 2
```

- Las tomas sistólica deben estar en el rango 75-200.
```bash
systolic >= 75 && systolic <=200
```
- Las tomas diastólicas deben estar en el rango 45-124.
```bash
diastolic >= 45 && diastolic <=124
```

- Importante: La diferencia entre la media sistólica y la media diástolica debe estar compensada:
La diferencia entre la sistólica y la diastólica debe ser mayor o igual de 20.
No debe dejar pasar el cálculo si la tensión está descompensada.

Tarificación cancelada"
'La diferencia entre la tensión sistólica y la tensión diástolica es menor de 20 y, por tanto, está muy descompensada. Tarificación cancelada.';
'Por favor, asegúrese de que la cifra es correcta para poder realizar la tarificación.'




```bash
systolic - diastolic >= 20
```

- Si la toma sistólica en mayor de 145 o menor de 65, se aplicará el color rojo a la cifra.



```bash
 if (systolic > 145 || systolic < 65) {
        input.classList.add("red");
        return false;
    }
```


- Si la toma sistólica en mayor de 131 , se aplicará el color azul a la cifra.

```bash
  if (systolic > 131) {
        input.classList.add("blue");
        return false;
    }
```

- Para la toma sistólica, en otros casos, se aplicará el color verde.


- Si la toma diastólica en mayor de 95 o menor de 45, se aplicará el color rojo a la cifra.

```bash
   if (diastolic > 95 || diastolic < 45) {
        input.classList.add("red");
        return false;
    }
```


- Si la toma diastólica en mayor de 80 , se aplicará el color azul a la cifra.

```bash
  if (diastolic > 80) {
        input.classList.add("blue");
        return false;
    }
```

- Para la toma diastólica, en otros casos, se aplicará el color verde.

- Si la toma sistólica es menor de 75: "Tensión sistólica muy baja. Tarificación cancelada".

- Si la toma sistólica es mayor de 200: "Tensión sistólica muy alta. Tarificación cancelada".

- Si la toma diastólica es menor de 45: "Tensión diastólica muy baja. Tarificación cancelada".

- Si la toma diastólica es mayor de 124: "Tensión diastólica muy alta. Tarificación cancelada".

### Colesterol total
Inputs excluyentes del tipo Radio con las distintas franjas.

- Miligramos por decilitro.
- Rangos:
```bash
cho5 = cholesterol > 450
cho4 = cholesterol >= 376 && cholesterol <=450
cho3 = cholesterol >= 301 && cholesterol <=375
cho2 = cholesterol >= 271 && cholesterol <=300
cho1 = cholesterol >= 241 && cholesterol <=270
cho0 = cholesterol <= 240

```


## Cálculo inicial de los recargos

### Edad actuarial
La edad real se utiliza en todos los cálculos, salvo cuando se indica lo contrario (hipertensión).

La edad actuarial es la edad que tienes en tu cumpleaños más cercano, sea el pasado o el futuro (cuando tienes 20,6 años ya tienes 21 por ejemplo). La edad actuarial no solo depende del año de tu nacimiento, sino que también está condicionada por el día y el mes de la fecha en que naciste. Esto es debido a que tu edad actuarial determina los años que tienes según tu cumpleaños más cercano (anterior o posterior). Es decir que si te faltan menos de 6 meses (180 días) para tu cumpleaños, a la hora de contratar tu seguro de vida se considerará que tienes un año más. Se utiliza para el cálculo de la **hipertensión**, del **colesterol**, del **IMC** o del **alcohol**.

Para ver cómo calcular la edad actuarial, es más sencillo verlo con un ejemplo.

Si una persona nació el 16 de diciembre de 1991 y decide contratar su póliza de vida el 16 de marzo de 2022, su edad actuarial será 30 años, coincidiendo con su edad real, ya que tiene 30 años y 3 meses. Pero si decide esperar un poco más y contrata su póliza el 31 de agosto de 2022, la edad que se tendrá en cuenta para calcular el precio de su seguro, será 31 años, la edad que cumplirá el próximo 16 de diciembre, ya que su edad real sería de 30 años y 8 meses.



### Alcohol
Para calcular la tasa para el alcohol existen dos tablas:

- Una tabla para el cálculo para los riesgos de vida, de invalidez, de accidente y de enfermedad grave:
[alcohol.csv](docs/alcohol.csv).
La variable la llamaremos **'lnAlcohol'**.

- Una segunda tabla pra el cálculo del riesgo de incapacidad temporal: 
[alcohol_ilt.csv](docs/alcohol_ilt.csv).
La variable la llamaremos **'lnAlcohol_ILT'**.

- Para el cálculo del alcohol se utiliza, además de las variables del número de vinos, cervezas y licores, la variable de género (hombre o mujer) y la variable de edad actuarial (para **lnAlcohol**)

- Las unidades para el número total de alcohol tiene este cálculo:
La suma de la cifra de vinos + la cifra de cervezas + la cifra de licores multiplicada por dos.

```bash
units = +wines + (+beers) + (+spirits * 2);
```

- Rangos de **género** y unidades para **'lnAlcohol'** y las tasas aplicadas:

```bash
if (gender === 'female') {
        if (units <= 2) {
            result += 0;
        }
        if (units === 3) {
            result += 50;
        }
        if (units === 4) {
            result += 100;
        }
        if (units > 4) {
            result += 999;
        }
    }

    if (gender === 'male') {
        if (units <= 4) {
            result += 0;
        }
        if (units === 5) {
            result += 50;
        }
        if (units === 6) {
            result += 100;
        }
        if (units > 6) {
            result += 999;
        }
    }
    // actuarial age
    if (result > 0 && result < 999 && age > 45) {
        result -= 25;
    }

```

- Importante: Nótese en el caso anterior, la excepción para los **mayores de 45 años**, edad actuarial (se resta a la tasa 25 puntos).
Por ejemplo, el recargo para un hombre de 57 años que bebe 6 vinos en la tabla de alcohol correspondería un recargo de 100.
Sin embargo, por ser mayor de 45 años, se le resta 25 = recargo del 75.

- Rangos de edad y unidades para **'lnAlcohol_ILT'** y los recargos aplicados:

```bash
   if (gender === 'female') {
        if (units <= 1) {
            result += 0;
        }
        if (units === 2) {
            result += 25;
        }
        if (units === 3) {
            result += 50;
        }
        if (units > 3) {
            result += 999;
        }
    }

    if (gender === 'male') {
        if (units <= 2) {
            result += 0;
        }
        if (units === 3) {
            result += 25;
        }
        if (units === 4) {
            result += 50;
        }
        if (units > 4) {
            result += 999;
        }

```
- En el caso anterior, no existe la excepción para los mayores de 45 años.


### Colesterol
- Para calcular la tasa por colesterol existen una única tabla para todos los riesgos:
[colesterol.csv](docs/colesterol.csv).
La variable la llamaremos **'lnCholesterol'**.

- Para el cálculo de la tasa es necesaria la **edad actuarial** del individuo.

```bash
   if (age <= 29) {
        if (cholesterol === 'cho5') { // +Más de 450
            result += 200;
        }
        if (cholesterol === 'cho4') { // de 376 a 450
            result += 100;
        }
        if (cholesterol === 'cho3') { // de 301 a 375
            result += 75;
        }
        if (cholesterol === 'cho2') { // de 271 a  300
            result += 50;
        }
        if (cholesterol === 'cho1') { // de 241 a  270
            result += 25;
        }
    }
    if (age > 29 && age <= 49) {
        if (cholesterol === 'cho5') { // +Más de 450
            result += 150;
        }
        if (cholesterol === 'cho4') { // de 376 a 450
            result += 75;
        }
        if (cholesterol === 'cho3') { // de 301 a 375
            result += 50;
        }
        if (cholesterol === 'cho2') { // de 271 a  300
            result += 25;
        }
        if (cholesterol === 'cho1') { // de 241 a  270
            result += 0;
        }
    }
    if (age > 49 && age <= 59) {
        if (cholesterol === 'cho5') { // +Más de 450
            result += 100;
        }
        if (cholesterol === 'cho4') { // de 376 a 450
            result += 50;
        }
        if (cholesterol === 'cho3') { // de 301 a 375
            result += 25;
        }
        if (cholesterol === 'cho2') { // de 271 a  300
            result += 0;
        }
        if (cholesterol === 'cho1') { // de 241 a  270
            result += 0;
        }
    }
    if (age > 59) {
        if (cholesterol === 'cho5') { // +Más de 450
            result += 75;
        }
        if (cholesterol === 'cho4') { // de 376 a 450
            result += 25;
        }
        if (cholesterol === 'cho3') { // de 301 a 375
            result += 0;
        }
        if (cholesterol === 'cho2') { // de 271 a  300
            result += 0;
        }
        if (cholesterol === 'cho1') { // de 241 a  270
            result += 0;
        }
    }
    result += 0; // cho0

```



### Hipertensión
- Para calcular la tasa por presión arterial (tensión) existen una única tabla para todos los riesgos:
[tension.csv](docs/tension.csv).
La variable la llamaremos **'lnTension'**.


- Para el cálculo necesitaremos las variables 'systolic', 'diastolic' y 'age' (actuarial) obtenidas desde el formulario inicial.

- La matriz de tensión:

![tabla tension][tabla tension]

- Se trata de una tabla compleja, una matriz donde se filtra la edad con el nivel de diastólica y se buca la correspondencia con la sistólica para obtener la tasa de agravamiento.

 - La primera colúmna (key) es informativa, nos interesa quedarnos siempre con la primera fila (systolic) para luego buscar la correspondencia con la fila de edad y tasa de diastólica obtenidas en el formulario.

 - Primero: obtener el grupo de edad: La columna edad son los rangos de edad, 'hastaedad'.
 Importante: la edad para este cálculo es al **edad actuarial**, que se calcula con la edad que obtuvimos en el formulario (age).

 ```bash
    if (age <= 39) {
        return 39;
    }
    if (age > 39 && age <= 49) {
        return 49;
    }
    if (age > 49 && age <= 59) {
        return 59;
    }
    if (age > 59 && age <= 64) {
        return 64;
    }
    if (age > 64 && age <= 69) {
        return 69;
    }
    if (age > 69) {
        return -1
    }


```

 - Segundo: obtener el grupo de diastólica: La columna 'diastolic' son los rangos para la toma diastólica, es decir, con el valor que obtuvimos en el formulario (diasto):
 ```bash
   if (diasto <= 49) {
        return 49;
    }
    if (diasto > 49 && diasto <= 89) {
        return 89;
    }
    if (diasto > 89 && diasto <= 94) {
        return 94;
    }
    if (diasto > 94 && diasto <= 99) {
        return 99;
    }
    if (diasto > 99 && diasto <= 104) {
        return 104;
    }
    if (diasto > 104 && diasto <= 109) {
        return 109;
    }
    if (diasto > 109 && diasto <= 114) {
        return 114;
    }
    if (diasto > 114 && diasto <= 124) {
        return 124;
    }
    if (diasto > 124) {
        return -1;
    }
```

- Tercero: Obtener el grupo para sistólica. Estas son las correspondencias:
 ```bash
   if (systo < 90) {
        return 'c1';
    }
    if (systo >= 90 && systo < 140) {
        return 'c2';
    }
    if (systo >= 140 && systo < 146) {
        return 'c3';
    }
    if (systo >= 146 && systo < 150) {
        return 'c4';
    }
    if (systo >= 150 && systo < 156) {
        return 'c5';
    }
    if (systo >= 156 && systo < 161) {
        return 'c6';
    }
    if (systo >= 161 && systo < 166) {
        return 'c7';
    }
    if (systo >= 166 && systo < 171) {
        return 'c8';
    }
    if (systo >= 171) {
        return 'c9';
    }

```

- Cuarto: Obtener la tasa. Se entenderá mejor con uno ejemplo:

Individuo de 39 años (actuarial) | 161 sistólica | 89 diástolica --> resultado **45**

![tension result][tension result]

 ```bash
 // fila para edad (39 años) y diastólica (89)
age: 39
c1: -1
c2: 0
c3: 0
c4: 0
c5: 10
c6: 25
c7: 45
c8: 60
c9: -1
diastolic: 89
key: "row"

```


 ```bash
 // columna para la sistólica (161)
c7: 45
```
- En la tabla **'-1'**: significa que la tarificación debe ser rechazada y abrir una ventana modal con mensaje.
"Rechazar: Debido a la tensión arterial esta solicitud debe ser rechazada".

Esta sería la tabla resumen con cuatro casos concretos:
[tension_calculations.pdf](pdf/tension_calculations.pdf).


### Índice de masa muscular
Para calcular la tasa para el índice de masa muscular (IMC) existen dos tablas:

- Una tabla para el cálculo para los riesgos de vida, de invalidez, de accidente y de enfermedad grave:
[imc.csv](docs/imc.csv).
La variable la llamaremos **'lnImc'**.

- Una segunda tabla pra el cálculo del riesgo de incapacidad temporal: 
[imc_ilt.csv](docs/imc_ilt.csv).
La variable la llamaremos **'lnImc_ILT'**.


- Para el cálculo se utiliza la edad actuarial.

- En la tabla **'-1'**: significa que la tarificación debe ser rechazada  y abrir una ventana modal con mensaje.
"Debido a la relación peso/altura esta solicitud debe ser rechazada. Ingrese nuevos datos o rechace la solicitud.".

- En la tabla **'-2'**: significa que la tarificación debe ser pospuesta  y abrir una ventana modal con mensaje.
"Debido a la relación peso/altura esta solicitud debe ser aplazada. Ingrese nuevos datos o aplace la solicitud.".

- **'lnImc'**: Tabla de resultados para el IMC de vida, de invalidez, de accidente y de enfermedad grave:

 ```bash
    if (age <= 34) {
        if (imc <= 16) {
            result += -2; // aplazar
        }
        if (imc > 16 && imc <= 18) {
            result += 50;
        }
        if (imc > 18 && imc <= 21) {
            result += 25;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 25;
        }
        if (imc > 30 && imc <= 32) {
            result += 25;
        }
        if (imc > 32 && imc <= 34) {
            result += 50;
        }
        if (imc > 34 && imc <= 37) {
            result += 75;
        }
        if (imc > 37 && imc <= 40) {
            result += 100;
        }
        if (imc > 40 && imc <= 43) {
            result += 125;
        }
        if (imc > 43 && imc <= 45) {
            result += 175;
        }
        if (imc > 45 && imc <= 46) {
            result += 225;
        }
        if (imc > 46) {
            result += -1;
        }
    }
    if (age > 34 && age <= 55) {
        if (imc <= 16) {
            result += -2; // aplazar
        }
        if (imc > 16 && imc <= 18) {
            result += 25;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 0;
        }
        if (imc > 30 && imc <= 32) {
            result += 25;
        }
        if (imc > 32 && imc <= 34) {
            result += 25;
        }
        if (imc > 34 && imc <= 37) {
            result += 50;
        }
        if (imc > 37 && imc <= 40) {
            result += 75;
        }
        if (imc > 40 && imc <= 43) {
            result += 100;
        }
        if (imc > 43 && imc <= 45) {
            result += 150;
        }
        if (imc > 45 && imc <= 46) {
            result += 200;
        }
        if (imc > 46) {
            result += -1;
        }
    }
    if (age > 55) {
        if (imc <= 16) {
            result += -2; // aplazar
        }
        if (imc > 16 && imc <= 18) {
            result += 0;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 0;
        }
        if (imc > 30 && imc <= 32) {
            result += 0;
        }
        if (imc > 32 && imc <= 34) {
            result += 25;
        }
        if (imc > 34 && imc <= 37) {
            result += 25;
        }
        if (imc > 37 && imc <= 40) {
            result += 50;
        }
        if (imc > 40 && imc <= 43) {
            result += 75;
        }
        if (imc > 43 && imc <= 45) {
            result += 125;
        }
        if (imc > 45 && imc <= 46) {
            result += 175;
        }
        if (imc > 46) {
            result += -1;
        }
    }
```

- **'lnImc_ILT'**: Tabla de resultados para el IMC de ILT:
 ```bash
    if (age <= 34) {
        if (imc <= 16) {
            result += 999; // rechazar
        }
        if (imc > 16 && imc <= 18) {
            result += 50;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 25;
        }
        if (imc > 30 && imc <= 32) {
            result += 50;
        }
        if (imc > 32 && imc <= 34) {
            result += 75;
        }
        if (imc > 34 && imc <= 37) {
            result += 100;
        }
        if (imc > 37 && imc <= 40) {
            result += 125;
        }
        if (imc > 40 && imc <= 43) {
            result += 150;
        }
        if (imc > 43 && imc <= 45) {
            result += 999;
        }
        if (imc > 45 && imc <= 46) {
            result += 999;
        }
        if (imc > 46) {
            result += 999;
        }
    }
    if (age > 34 && age <= 55) {
        if (imc <= 16) {
            result += 999; // rechazar
        }
        if (imc > 16 && imc <= 18) {
            result += 25;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 25;
        }
        if (imc > 30 && imc <= 32) {
            result += 50;
        }
        if (imc > 32 && imc <= 34) {
            result += 50;
        }
        if (imc > 34 && imc <= 37) {
            result += 75;
        }
        if (imc > 37 && imc <= 40) {
            result += 100;
        }
        if (imc > 40 && imc <= 43) {
            result += 125;
        }
        if (imc > 43 && imc <= 45) {
            result += 999;
        }
        if (imc > 45 && imc <= 46) {
            result += 999;
        }
        if (imc > 46) {
            result += 999;
        }
    }
    if (age > 55) {
        if (imc <= 16) {
            result += 999; // rechazar
        }
        if (imc > 16 && imc <= 18) {
            result += 25;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 0;
        }
        if (imc > 30 && imc <= 32) {
            result += 25;
        }
        if (imc > 32 && imc <= 34) {
            result += 50;
        }
        if (imc > 34 && imc <= 37) {
            result += 50;
        }
        if (imc > 37 && imc <= 40) {
            result += 75;
        }
        if (imc > 40 && imc <= 43) {
            result += 100;
        }
        if (imc > 43 && imc <= 45) {
            result += 999;
        }
        if (imc > 45 && imc <= 46) {
            result += 999;
        }
        if (imc > 46) {
            result += 999;
        }
    }
```


### Tabaco

- Unidades de tabaco:

```bash
 +cigarretes + (+cigars * 3) + (+pipes * 2);
 
```


- Para calcular la tasa para el tabaco existen dos tablas:

- Una tabla para el cálculo para los riesgos de vida, de invalidez, de accidente y de enfermedad grave:
[tabaco.csv](docs/tabaco.csv).
La variable la llamaremos **'lnTobacco'**.

- Una segunda tabla pra el cálculo del riesgo de incapacidad temporal: 
[tabaco_ilt.csv](docs/tabaco_ilt.csv).
La variable la llamaremos **'lnTabaco_ILT'**.

- **'lnTobacco'**: Tabla de resultados para el tabaco vida, invalidez, accidente y enfermedad grave:
 ```bash
 if (units <= 19) {
        result += 0;
    }
    if (units > 19 && units <= 39) {
        result += 25;
    }
    if (units > 39) {
        result += 50;
    }
  ```

-  **'lnTabaco_ILT'**: Tabla de resultados para el tabaco ILT:
 ```bash
   if (units > 15 && units <= 25) {
        result += 25;
    }
    if (units > 25 && units <= 40) {
        result += 50;
    }
    if (units > 40) {
        result += 100;
    }
  ```




## Cálculo de la variable nagra

Como se ha explicado al inicio, se aplica a cada recargo una tasa o factor adicional que llamaremos  **'nagra'**. Su finalidad es totalizar el número de agravantes que recaen a una persona (1, 2, 3, 4, o 5).
Para este recargo, se clasifican los siguientes agravantes:
lnImc, lnTobacco, lnAlcohol, lnTension y lnCholesterol.
Cada agravante dará un factor (0 o 1), que luego se sumarán (el resultado puede ser 0 si los cinco agravantes suman 0 o puede llegar hasta 5). Este sumatorio es la variable que hemos llamado Nagra.

Aquí se muestran uno ejemplos de cómo se cálcula el factor de cada recargo (si el agravamiento es mayor de 0 se suma 1) y la suma total (la **'nagra'**).


```bash
// nagra

nagra=IIF(lnImc>0,1,0)+IIF(lnTension>0,1,0)+IIF(lnTobacco>0,1,0)+IIF(lnAlcohol>0,1,0)+IIF(lnCholesterol>0,1,0) // foxPro

nagra = (lnAlcohol > 0 ? 1 : 0) + (lnCholesterol > 0 ? 1 : 0)  + (lnImc > 0 ? 1 : 0)  + (lnTension > 0 ? 1 : 0)  + (lnTobacco > 0 ? 1 : 0); // js

  ```




**CASO 1:**
El paciente, tiene un recargo por lnCholesterol, por tanto, la variable Nagra sería +1.
![Nagra: caso 1][Nagra: caso 1]

**CASO 2:**
El paciente, a tener recargos mayores de 0 para lnImc, lnTension y lnCholesterol, la variable Nagra sería +3.

![Nagra: caso 2][Nagra: caso 2]

## Cálculo del factor máximo
- Para el caso del seguro de vida, se necesita comprobar si el riesgo excede un umbral máximo.En el caso de superarlo se rechazarán todas tarificaciones de seguros.
- Esta variable, que llamaremos **'$inMax'**, se calcula de forma sencilla una vez calculada la variable nagra.
- Si la nagra es menor de 2, aplicaremos un valor 200 a  **'$inMax'**, si es igual o mayor a 2, le aplicaremos un valor de 300.

```bash
// $inMax
// IF(nagra<2, 200, 300) // foxPro

   return nagra < 2 ? 200 : 300; // js
  ```

- Una vez conocido $inMax (200 o 300), si lo que se calcule como recargo de Vida supera ese límite, hay que cancelar el resto de cálculos, es decir, no mostrarlos, pues no se puede asegurar ese riesgo: si se rechaza Vida, lo demás no procede.
 "Consulte con la central: Se ha excedido el límite para el cálculo de vida y este supuesto aborta el cálculo de cualquier riesgo".


## Cálculo final de los recargos

El resultado de la calculadora:

![resultado vidaNr][resultado vidaNr]


### VIDA
Se aplicará la siguiente fórmula:


```bash
// foxPro
// lnTVida = ROUND((lnIMC + lnTension + lnTobacco + lnAlcohol + lnCholesterol) * (1.1 ^ (nagra - 1)) / 25, 0) * 25 

// js

 lnTVida = Math.round((lnIMC + lnTension + lnTobacco + lnAlcohol + lnCholesterol) * ((Math.pow(1.1, (nagra - 1))) / 25)) * 25;
  ```

- IMPORTANTE: Aquí es dónde aplicaría la variable $inMax.
Si lnTVida es mayor que $inMax, se rechazarían todas las tarificaciones (no sólo la de vida). Se cancelan todos los cálculos: "Se ha excedido el límite, consulte con la Central".

### INVALIDEZ
Se aplicará la siguiente fórmula:


```bash
// foxPro
// lnTInva=ROUND((lnIMC+lnTension+lnTobacco+IIF(lnAlcohol<=75,lnAlcohol,999)+lnCholesterol)*(1.1^(nagra-1))/25,0)*25

// js

 lnTInva =  Math.round((lnIMC + lnTension + lnTobacco + (lnAlcohol <= 75 ? lnAlcohol : 999) + lnCholesterol) * ((Math.pow(1.1, (nagra - 1))) / 25)) * 25;
  ```

- Un resultado igual o mayor a 999 significa rechazar esta tarificación.


### ACCIDENTES
Se aplicará la siguiente fórmula:


```bash
// foxPro
// lnTAcci = ROUND(((lnIMC / 2) + lnTension + lnTobacco + IIF(lnAlcohol <= 75, lnAlcohol, 999) + lnCholesterol) * (1.1 ^ (nagra - 1)) / 25, 0) * 25

// js

lnTAcci = Math.round(((lnIMC / 2) + lnTension + lnTobacco + (lnAlcohol <= 75 ? lnAlcohol : 999) + lnCholesterol) * ((Math.pow(1.1, (nagra - 1))) / 25)) * 25;
  ```

- Un resultado igual o mayor a 999 significa rechazar esta tarificación.


### ENFERMEDAD GRAVE
Se aplicará la siguiente fórmula:


```bash
// foxPro
// lnTEnf = ROUND((lnIMC + lnTension + (lnTobacco * 1.5) + lnAlcohol + lnCholesterol) * (1.2 ^ (nagra - 1)) / 25, 0) * 25

// js

lnTEnf = Math.round((lnIMC + lnTension + (lnTobacco * 1.5) + lnAlcohol + lnCholesterol) * ((Math.pow(1.2, (nagra - 1))) / 25)) * 25;
  ```

### ILT
Se aplicará la siguiente fórmula:


```bash
// foxPro
// lnTILT = ROUND((lnIMC_ILT + lnTension + lnTobacco_ILT + lnAlcohol_ILT + lnCholesterol) * (1.1 ^ (nagra - 1)) / 25, 0) * 25

// js

lnTILT = Math.round((lnIMC_ILT + lnTension + lnTobacco_ILT + lnAlcohol_ILT + lnCholesterol) * ((Math.pow(1.1, (nagra - 1))) / 25)) * 25;
  ```


## Cálculos adicionales

- Como norma general, si un recargo supera la cifra de 300, se rechazará la tarificación del riesgo.

<p align="right">(<a href="#top">Subir</a>)</p>


# Traducción

Las calculadoras de diabetes y de riesgos se pueden obtener en dos idiomas: inglés y castellano.
La calculadora de esperanza de vida no se ha traducido, ya que las tablas no corresponden a la población anglosajona. Por tanto, en la versión inglés, no aparece el resultado de la esperanza de vida.
Sobre un único código, la aplicación recoge una variable (key) desde la URL que transmite el lenguaje (ES o EN) que se aplicará a las distintas variables del documento HTML.
Es decir, existe un diccionario al que la aplicación consulta la traducción de una determinada variable.

- [Diccionario VidaNr](docs/vidaNR_dictionary.csv).
- [Diccionario Diabetes](docs/diabetes_dictionary.csv).

En catellano:
```bash
http://localhost:8080/?lang=ES

http://davinci.nacionalre.es/nacionalRe-vidaNr/build/?lang=es

```

En inglés:
```bash
http://localhost:8080/?lang=EN

http://davinci.nacionalre.es/nacionalRe-vidaNr/build/?lang=en
```


<p align="right">(<a href="#top">Subir</a>)</p>

# Licencia

Todos los derechos reservados.

Copyright 2022 Nacional de Reaseguros S.A. All Rights Reserved.


```bash
This project is Copyright (C) 2022 Nacional de Reaseguros S.A., all rights reserved.
```
<p align="right">(<a href="#top">Subir</a>)</p>


# Referencias
- Metodología para el cálculo de esperanzas de vida en salud. [Tabla de vida con múltiples decrementos](https://www.ine.es/daco/daco42/discapa/meto_evld.pdf).
- Boletín Oficial del Estado. [PASEM2010](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2012-9776).
- [Unespa, PASEM2010](https://www.unespa.es/main-files/uploads/2017/06/Tablas-mortalidad-PASEM2010.pdf)
- Ministerio de Asuntos Económicos y Transformación Digital, [Tablas biométricas sectoriales](http://www.dgsfp.mineco.es/es/Regulacion/DocumentosRegulacion/V2_Resolucio%CC%81n%20Tablas%20biome%CC%81tricas%20para%20firma%20v4%2020201216%20FINAL%20(002).pdf).


<p align="right">(<a href="#top">Subir</a>)</p>

# Contactos

- Equipo de **[Davinci](http://davinci.nacionalre.es/)** NacionalRe.
- Miguel Ángel Pinilla Lebrato: Responsable de Selección de Riesgos Nacional de Reaseguros S.A. <mpl@nacionalre.es>
- Juan Ignacio Rupérez: Reponsable de informática, NacionalRe. <jir@nacionalre.es>.
- Paloma Velasco Gómez: NacionalRe. <pvg@nacionalre.es>
- Eduardo Cruz: Project Manager, **[Visual Thinking, Comunicación y Creatividad](https://www.visualthinking.es/)**. <eduardo@visualthinking.es>.
- Juantxo Cruz: Web Development. **[juantxocruz.com](https://juantxocruz.com/)**. [@juantxocruz](https://twitter.com/juantxocruz). <jcruz16@gmail.com>

Project Link: [https://github.com/juantxocruz/webpack-VidaNr](https://github.com/juantxocruz/webpack-VidaNr)


<p align="right">(<a href="#top">Subir</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[formulario vidaNr]: img/vidaNr-form.png
[resultado vidaNr]: img/vidaNr-result.png
[tabla tension]: img/tension.png
[tension result]: img/tension-result.png
[tension calculations]: pdf/tension-calculations.png
[Nagra: caso 1]: img/factor-nagra-1.png
[Nagra: caso 2]: img/factor-nagra-2.png



