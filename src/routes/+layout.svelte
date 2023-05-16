<script>
    import '../lib/styles/styles.css'
    import '../lib/styles/utility.css'
    import Sidebar from "../lib/components/Sidebar.svelte";
</script>

<main>
    <Sidebar/>
    <slot></slot>
</main>

<style>
    main {
        display: grid;
        grid-template-columns: 1fr 9fr;
        width: 100%;
    }
</style>