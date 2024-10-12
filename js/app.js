function inicarApp() {

    const selectCategories = document.querySelector('#categorias');
    selectCategories.addEventListener('change', seleccionarCategoria);

    const resultado = document.querySelector('#resultado')
    const modal = document.querySelector('#modal');
    const modalContent = document.querySelector('#modal-content');
    const closeModal = document.querySelector('#close-modal')

    obtenerCategorias();

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

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
                modal.style.display = 'flex'
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

        
        limpiarHTMLModal(modalContent)
        const { idMeal, strInstructions, strMeal, strMealThumb } = receta;
        console.log(receta)

        const ingredientes = document.createElement('DIV');
        ingredientes.classList.add('container-ingredientes');

        ingredientes.textContent = strMeal;
        ingredientes.innerHTML = `
            <h2>${strMeal}</h2>
            <img class="imagen" src="${strMealThumb}" alt="receta ${strMeal}"/>
            <h3>Instrucciones</h3>
            <h3>${strInstructions}</h3>
            <h3>Ingredientes y Cantidades</h3>
        `

        const listGroup = document.createElement('UL');
        listGroup.classList.add('list-group')
        //mostrar cantidades e ingredientes
        for (let i = 1; i < 20; i++) {
            if(receta[`strIngredient${i}`]) {
                const ingrediente = receta[`strIngredient${i}`]
                const cantidad = receta[`strMeasure${i}`]


                const ingredienteLi = document.createElement('LI');

                ingredienteLi.classList.add('list-grupo-item');
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`

                listGroup.appendChild(ingredienteLi)
                
            }
            
        }
        ingredientes.appendChild(listGroup)

        const modalFooter = document.querySelector('.modal-footer')
        limpiarHTML(modalFooter)

        //Botones de cerrar y favorito
        const btnFavorito = document.createElement('BUTTON');
        btnFavorito.classList.add('save-favorities')
        btnFavorito.textContent = 'Guardar Favorito'
        btnFavorito.textContent = existeStorage(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito'

        //localStorage
        btnFavorito.onclick = function() {

            if(existeStorage(idMeal)) {
                eliminarFavorito(idMeal)
                btnFavorito.textContent = 'Guardar Favorito'
                mostrarToast('Eliminado Correctamente')
                return 
            }

            agregarFavorito({
                id: idMeal,
                titulo: strMeal,
                img: strMealThumb
            })
            btnFavorito.textContent = 'Eliminar Favorito'
            mostrarToast('Agregado Correctamente')
        }

        const btnCerrar = document.createElement
        ('BUTTON');
        btnCerrar.classList.add('save-favorities');
        btnCerrar.textContent = 'Cerrar';

        btnCerrar.onclick = function() {
            modal.style.display = 'none';
        }

        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrar);
       
        modalContent.appendChild(ingredientes);
    }

    function agregarFavorito(receta) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
    }

    function existeStorage(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        return favoritos.some(favorito => favorito.id === id);
    }

    function mostrarToast(mensaje){
        const toasrDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = document.createElement('DIV');

        toasrDiv.style.display = 'flex'

        setTimeout(() => {
            toasrDiv.style.display = 'none'
        }, 5000);
        
        toastBody.textContent = mensaje;

    }

    function limpiarHTMLModal(selector) {
        while(selector.firstChild) {
            selector.removeChild(selector.firstChild)
        }
    }

    function limpiarHTML(selector) {
        while(selector.firstChild) {
            selector.removeChild(selector.firstChild)
        }
    }

}

document.addEventListener('DOMContentLoaded', inicarApp);