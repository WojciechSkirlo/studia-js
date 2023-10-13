const form = document.querySelector('form');
const inputs = [...document.querySelectorAll('input[type="number"]')];
const result = document.querySelector('.result');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const values = inputs.map((input) => input.value);
    const sum = values.reduce((acc, value) => acc + +value, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    result.innerHTML = `
        <p>Sum: ${sum}</p>
        <p>Average: ${average}</p>
        <p>Min: ${min}</p>
        <p>Max: ${max}</p>
    `;
});
