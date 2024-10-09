function inicarApp() {

    const selectCategories = document.querySelector('#categorias');
    selectCategories.addEventListener('change', seleccionarCategoria);

    const resultado = document.querySelector('#resultado')
    const modal = document.querySelector('#modal')

    obtenerCategorias();

    function obtenerCategorias() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarCategorias(resultado.categories))

    }

    function mostrarCategorias(categorias = []) {
        categorias.forEach(categoria => {
            console.log(categoria)
            const option = document.createElement('OPTION');
            option.value = categoria.strCategory
            option.textContent = categoria.strCategory
            selectCategories.appendChild(option)
            console.log(option)
        });
    }
    
    function seleccionarCategoria(e) {
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetas(resultado.meals))
    }

    function mostrarRecetas(recetas = []) {

        limpiarHTML(resultado)

        const heading = document.createElement('H2');
        heading.classList.add('aviso');
        heading.textContent = recetas.length ? 'Resultados' : 'No hay Resultados';
        resultado.appendChild(heading)

        //iterar los resultados
        recetas.forEach(receta => {
            const { idMeal, strMeal, strMealThumb } = receta

            const recetaContenerdor = document.createElement('DIV');
            recetaContenerdor.classList.add('receta-contenedor');

            const recetaCard = document.createElement('DIV');
            recetaCard.classList.add('receta-contenedor-card');

            const recetaImagen = document.createElement('IMG');
            recetaImagen.classList.add('receta-contenedor-imagen');
            recetaImagen.alt = `Imagen de la receta ${strMeal}`;
            recetaImagen.src = strMealThumb;

            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body')

            const recetaHeading = document.createElement('H3')
            recetaHeading.classList.add('card-title');
            recetaHeading.textContent = strMeal;

            const recetaButton = document.createElement('BUTTON');
            recetaButton.classList.add('card-button');
            recetaButton.textContent = 'Ver Receta';
            
            recetaButton.onclick = function() {
                seleccionarReceta(idMeal)
            }

            //Inyectar en el codigo HTML
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenerdor.appendChild(recetaCard)

            resultado.appendChild(recetaContenerdor)

        })
    }

    function seleccionarReceta(id) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetaModal(resultado.meals[0]))
    }

    function mostrarRecetaModal(receta) {

    }

    function limpiarHTML(selector) {
        while(selector.firstChild) {
            selector.removeChild(selector.firstChild)
        }
    }

}

document.addEventListener('DOMContentLoaded', inicarApp);