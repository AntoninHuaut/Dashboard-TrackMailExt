function hideToast(state) {
    if (!state.toast) return;

    state.toast.dispose();
    state.toast = null;
}

function showToast(state, id, type, text) {
    hideToast(state);

    const toastDiv = document.getElementById(id);
    if (!toastDiv) return;
    const toastBody = toastDiv.querySelector('.toast-body');
    if (!toastBody) return;

    toastDiv.classList.remove('text-bg-primary', 'text-bg-success', 'text-bg-warning', 'text-bg-danger');
    toastDiv.classList.add('text-bg-' + type);
    toastBody.textContent = text;

    state.toast = new bootstrap.Toast(toastDiv);
    state.toast.show();
}