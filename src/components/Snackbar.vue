<script setup>
    import { MDCSnackbar } from '@material/snackbar';
    import { onMounted } from 'vue';

    let snackbar;
    let install_event;

    onMounted(() => {
        const snackbar_element = document.querySelector('.mdc-snackbar');
        snackbar = new MDCSnackbar(snackbar_element);

        window.addEventListener("beforeinstallprompt", (event) => {
            install_event = event;
            snackbar.open();
        });

        snackbar_element.querySelector("#install").addEventListener("click", async () => {
            if (!install_event) return;

            install_event.prompt();
            const { outcome } = await install_event.userChoice;
            install_event = null;

            if (outcome == "dismissed");
                setTimeout(() => {
                    snackbar.close();
                }, 1);
        });

        snackbar_element.querySelector("#close").addEventListener("click", async () => {
            snackbar.close();
        });
    });
</script>

<template>
    <aside class="mdc-snackbar">
        <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
            <div class="mdc-snackbar__label" aria-atomic="false">
                Would you like to install PokeApi?
            </div>
            <div class="mdc-snackbar__actions" aria-atomic="true">
                <button id="install" type="button" class="mdc-button mdc-snackbar__action">
                    <div class="mdc-button__ripple"></div>
                    <span class="mdc-button__label">Install</span>
                </button>
                <button id="close" type="button" class="mdc-button mdc-snackbar__action">
                    <div class="mdc-button__ripple"></div>
                    <span class="mdc-button__label">X</span>
                </button>
            </div>
        </div>
    </aside>
</template>