const widgetsContainer = document.querySelector('.widgets');
const modal = document.querySelector('#add-widget-modal');
const modalOverlay = document.querySelector('#modal-overlay');
const form = document.querySelector('#form-add-widget');
const btnAddWidget = document.querySelector('#btn-add-widget');
const btnCloseModal = document.querySelector('#btn-close-modal');

let editWidgetId = null;

const openModal = (widgetId) => {
    if (widgetId) {
        const widget = widgets.find((widgetId) => widgetId.id === widgetId);
        const elements = form.elements;

        elements.city.value = widget?.city ?? '';
        // elements.text.value = widget?.text ?? '';
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

let widgets = getWidgets();

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
                <div class="widget__title">${widget.city}</div>
                </div>
                </div>`;
};
// <div class="widget__text">Text</div>

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

const onSubmit = (event) => {
    event.preventDefault();

    const elements = event.target.elements;

    console.log(elements);

    if (editWidgetId) {
        const widget = widgets.find((widget) => widget.id === editWidgetId);
        const newWidget = {
            id: editWidgetId,
            city: elements.city.value ?? 'No city',
            // text: elements.text.value ?? 'No text',
            color: elements.color.value,
            pinned: widget.pinned,
        };

        editWidget(editWidgetId, newWidget);
        editWidgetId = null;
    } else {
        const newWidget = {
            id: Date.now(),
            city: elements.city.value ?? 'No city',
            // text: elements.text.value ?? 'No text',
            color: elements.color.value,
            pinned: false,
        };

        addWidget(newWidget);
    }

    saveWidgets();
    closeModal();
};

widgets.forEach((widget) => {
    const widgetEl = createWidget(widget);
    widgetsContainer.insertAdjacentHTML('beforeend', widgetEl);
});

btnAddWidget.addEventListener('click', openModal.bind(null, null));
btnCloseModal.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
form.addEventListener('submit', onSubmit);
