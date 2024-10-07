function inicarApp() {

    const selectCategories = document.querySelector('#categorias')

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

}

document.addEventListener('DOMContentLoaded', inicarApp);