const API_KEY_WEATHER = 'a8ae03291b5bc0d4184e9c5e70e2b3f4';

const widgetsContainer = document.querySelector('.widgets');
const modal = document.querySelector('#add-widget-modal');
const modalOverlay = document.querySelector('#modal-overlay');
const form = document.querySelector('#form-add-widget');
const btnAddWidget = document.querySelector('#btn-add-widget');
const btnCloseModal = document.querySelector('#btn-close-modal');
const citySelect = document.querySelector('#city');

let editWidgetId = null;

const openModal = (widgetId) => {
    if (widgetId) {
        const widget = widgets.find((widget) => widget.id === widgetId);
        const elements = form.elements;

        elements.city.value = widget?.city ?? '';
        elements.color.value = widget?.color ?? 'green';

        editWidgetId = widgetId;
    }

    modal.classList.add('modal--visible');
};

const closeModal = () => {
    modal.classList.remove('modal--visible');
    form.reset();
};

const getWidgets = () => {
    return JSON.parse(localStorage.getItem('widgets')) ?? [];
};

const saveWidgets = () => {
    localStorage.setItem('widgets', JSON.stringify(widgets));
};

let widgets = [];

const createWidget = (widget) => {
    return `
        <div class="widget widget--${widget.color}" data-id="${widget.id}" data-pinned=${widget.pinned}>
            <div class="widget__tools">
                ${
                    widget.pinned
                        ? `
                            <button class="btn btn--info" onclick="unpinWidget(${widget.id}); saveWidgets();">
                                <span>📌 Unpin</span>
                            </button>`
                        : `
                            <button class="btn btn--info" onclick="pinWidget(${widget.id}); saveWidgets();">
                                <span>📌 Pin</span>
                            </button>`
                }
                <button class="btn btn--warning" onclick="openModal(${widget.id})">Edit</button>
                <button class="btn btn--danger" onclick="deleteWidget(${widget.id}); saveWidgets();">Delete</button>
            </div>
            <div class="widget__content">
                <div class="widget__title">${widget.city} ${widget.temperature}℃ 
                    <img src="http://openweathermap.org/img/wn/${widget.icon}.png" alt="weather icon">
                </div>
                <div class="text">Wilgotność powietrza: ${widget.humidity}%</div>
            </div>
        </div>`;
};

const addWidget = (widget, beforeId) => {
    const widgetEl = createWidget(widget);

    if (beforeId) {
        const index = widgets.findIndex((widget) => widget.id === beforeId);
        widgets.splice(index, 0, widget);

        const widgetBeforeEl = document.querySelector(`[data-id="${beforeId}"]`);

        widgetBeforeEl.insertAdjacentHTML('beforebegin', widgetEl);
    } else {
        widgets.push(widget);
        widgetsContainer.insertAdjacentHTML('beforeend', widgetEl);
    }
};

const editWidget = (widgetId, newWidget) => {
    const index = widgets.findIndex((widget) => widget.id === widgetId);
    const beforeId = widgets.at(index + 1)?.id ?? null;

    deleteWidget(widgetId);
    addWidget(newWidget, beforeId);
};

const deleteWidget = (widgetId) => {
    widgets = widgets.filter((widget) => widget.id !== widgetId);

    const widgetEl = document.querySelector(`[data-id="${widgetId}"]`);
    widgetEl && widgetEl.remove();
};

const pinWidget = (widgetId) => {
    const widget = widgets.find((widget) => widget.id === widgetId);
    widget.pinned = true;

    deleteWidget(widgetId);
    addWidget(widget, widgets[0]?.id ?? null);
};

const unpinWidget = (widgetId) => {
    const widget = widgets.find((widget) => widget.id === widgetId);
    widget.pinned = false;

    deleteWidget(widgetId);
    addWidget(widget);
};

const onSubmit = async (event) => {
    event.preventDefault();

    if (!editWidgetId && widgets.length >= 10) {
        alert('Nie możesz dodać więcej niż 10 widgetów');
        return;
    }

    const elements = event.target.elements;
    const city = elements.city.value;
    const color = elements.color.value;
    const lat = citySelect.options[citySelect.selectedIndex].getAttribute('data-lat');
    const lon = citySelect.options[citySelect.selectedIndex].getAttribute('data-lon');

    const response = await fetchWeather(lat, lon);

    if (editWidgetId) {
        const widget = widgets.find((widget) => widget.id === editWidgetId);
        const newWidget = {
            id: editWidgetId,
            city: city,
            color: color,
            pinned: widget.pinned,
            lat,
            lon,
            temperature: response.main.temp,
            humidity: response.main.humidity,
            icon: response.weather[0]?.icon,
        };

        editWidget(editWidgetId, newWidget);
        editWidgetId = null;
    } else {
        const newWidget = {
            id: Date.now(),
            city: city,
            color: color,
            pinned: false,
            lat,
            lon,
            temperature: response.main.temp,
            humidity: response.main.humidity,
            icon: response.weather[0]?.icon,
        };

        addWidget(newWidget);
    }

    saveWidgets();
    closeModal();
};

const fetchLocations = async () => {
    const response = await fetch(
        `http://geodb-free-service.wirefreethought.com/v1/geo/countries/PL/places?limit=10&offset=0&sort=-population`
    );

    if (!response.ok) {
        throw new Error('API NIE DZIAŁA :/');
    }

    return response.json();
};

const fetchWeather = async (lat, lon) => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY_WEATHER}&units=metric`
    );

    if (!response.ok) {
        throw new Error('API NIE DZIAŁA :/');
    }

    return response.json();
};

const init = async () => {
    const response = await fetchLocations();

    response.data.forEach((city) => {
        const option = new Option(city.name, city.name);

        option.setAttribute('data-lat', city.latitude);
        option.setAttribute('data-lon', city.longitude);

        citySelect.add(option);
    });

    widgets = getWidgets();

    for (const widget of widgets) {
        const response = await fetchWeather(widget.lat, widget.lon);

        widget.temperature = response.main.temp;
        widget.humidity = response.main.humidity;
        widget.icon = response.weather[0]?.icon;

        const widgetEl = createWidget(widget);
        widgetsContainer.insertAdjacentHTML('beforeend', widgetEl);
    }
};

init();

btnAddWidget.addEventListener('click', openModal.bind(null, null));
btnCloseModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
form.addEventListener('submit', onSubmit);
