<script>
  import NoteForm from './components/NoteForm.svelte';
  import NoteList from './components/NoteList.svelte';
  let NoteListComponent;

  function handleNoteChange() {
    NoteListComponent.loadNotes();
  }
</script>

<main>
  <h1 style="margin-bottom:90px;">Aplikacja do zarządzania notatkami (MVP)</h1>  

  <section id="nl">
  <h1>Lista notatek</h1>
    <NoteList bind:this={NoteListComponent} on:changedNotes={handleNoteChange}/>
  <section>

  <section id="nf">
    <NoteForm on:changedNotes={handleNoteChange}/>
  </section>


</main>
<style>  
</style>
