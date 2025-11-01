// get the openai
import OpenAI from 'https://cdn.skypack.dev/openai';
const openai = new OpenAI({
    apiKey: '', // secret key goes here
    dangerouslyAllowBrowser: true
});


document.addEventListener('DOMContentLoaded', () => {
    // get the items
    const main = document.querySelector('main') ?? console.error("No main found!");
    const inp = main.querySelector('#text') ?? console.error("No image input found!");
    const generate_btn = main.querySelector('#generate-btn') ?? console.error("No generate button found!");


    // function to handle fetching the images
    async function fetch_images(result) {
        if (!result) {
            console.error("No result given!");
            return;
        }

        // create the loading text
        const loading_text = document.createElement('p');
        loading_text.textContent = "Loading image...";
        main.appendChild(loading_text);

        try {
            // generate the image
            const response = await openai.images.generate({
                model: "gpt-image-1",
                prompt: `${result}`,
                size: "auto",
            });

            // create the image
            const img = document.createElement('img');
            img.src = `data:image/png;base64,${response.data[0].b64_json}`; // fixes header too large error
            img.alt = "Generated Image";
            img.loading = 'lazy';
            img.fetchPriority = 'high';
            main.appendChild(img);

            // image loaded, remove the loading text
            main.removeChild(loading_text);

        } catch (err) {
            throw new Error(`Image fetch error: ${err}`);
        }
    }


    // add a new event listener for the image form
    generate_btn.addEventListener('click', (e) => {
        e.preventDefault(); // prevent page refresh

        // get the input value
        const result = inp.value;

        // exit on empty values
        if (result === "") {
            return;
        }

        // fetch the images
        fetch_images(result);
    })
});
