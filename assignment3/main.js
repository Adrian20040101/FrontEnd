import fetchData from "./fetch-data.js";

const data = await fetchData();

// grab each author and make the array into a set to avoid storing duplicates, then convert back to array
const authorsSet = new Set(data.map(item => item.author));
const authors = [...authorsSet];

const select = document.getElementById('authors');
authors.forEach(author => {
    const option = document.createElement('option');
    option.value = author;
    option.innerHTML = author;
    select.appendChild(option);
});

const displayAutherData = (selectedAuthor) => {
    const selectedAuthorData = data.filter(item => item.author == selectedAuthor);

    const imageGrid = document.getElementById('images-grid');
    imageGrid.innerHTML = "";    // clear the previously shown info
    selectedAuthorData.forEach(elementBox => {
        const element = document.createElement('div');
        element.classList.add('element');

        const image = document.createElement('img');
        image.src = elementBox.download_url;
        image.alt = "Author's image"; 

        const title = document.createElement('h2')
        title.textContent = elementBox.author

        const body = document.createElement('p');
        body.textContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod voluptatibus aliquid autem labore ullam harum necessitatibus aspernatur quam eum tenetur.";

        element.appendChild(image);
        element.appendChild(title);
        element.appendChild(body);

        imageGrid.appendChild(element);
    });
}

// display the first author in the array when the page is initially loaded
displayAutherData(authors[0]);

// track changes in the select to update the author data
select.addEventListener('change', (event) => { 
    const selectedAuthor = event.target.value;
    displayAutherData(selectedAuthor);
});