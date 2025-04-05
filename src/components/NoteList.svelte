<script>
    import {db} from '../lib/db.js';
    import {onMount} from 'svelte';
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();
    let notes = [];
    let selectedNote = null;
    let inEditMode = false;
    let newTitle = '';
    let newContent = '';
    let newTags = '';

    let selectedTags = [];
    let tagsList = [];
    let query = '';

    onMount(loadNotes);
    
    export async function loadNotes() {
        notes = await db.notes.orderBy('id').reverse().toArray();
        tagsList = [...new Set(notes.flatMap(note => note.tags))];
    }

   $: filteredNotes = notes.filter(note => {
        let checkQuery = true;
        let checkTags = true;

        if (query.trim() !== '') {
            checkQuery =
                note.title.toLowerCase().includes(query.trim().toLowerCase()) ||
                note.content.toLowerCase().includes(query.trim().toLowerCase());
        }

        if (selectedTags.length > 0) {
            checkTags = selectedTags.every(tag => note.tags.includes(tag));
        }

        return checkQuery && checkTags;
    });

    function selectNote(note){
        selectedNote = note;
    }

    function deleteNote(note){
        db.notes.delete(note.id);
        selectedNote = null;
        dispatch("changedNotes");
    }
    
    function enterEditMode(note){
        newTitle = note.title;
        newContent = note.content;
        newTags = note.tags.join(', ');
        inEditMode = true;
    }


    async function confirmEdit(note){
        const tagsArr = newTags.split(',').map(t => t.trim());
        await db.notes.update(note.id,{
            title:newTitle,
            content:newContent,
            tags: tagsArr,
        });
    
        inEditMode = false;
        dispatch("changedNotes");
    }

</script>


<div class="wyszukiwanie">
    <h2>Opcje wyszukiwania</h2>
    <input type="text" bind:value={query} placeholder="Szukaj w tytułach i zawartości..." />
    <div class="filtry">
    {#each tagsList as tag}
    <label>
        {tag}
        <input type="checkbox" bind:group={selectedTags} value={tag}/>
    </label>
    {/each}
    </div>

</div>
<ul>
    {#each filteredNotes as note}
        <li>
            {#if note == selectedNote}
                <div class="SelectedlistItem">
                    {#if !inEditMode}
                        <h1 style="margin-bottom:0px">{selectedNote.title}</h1>
                        <small class="tag">{selectedNote.tags.join(' ')}</small>
                        <p>{selectedNote.content}</p>
                    
                        <section class="NoteButtons">
                            <button id= "deleteNote" on:click={()=> deleteNote(selectedNote)}> usuń </button>
                            <button id= "editNote" on:click={()=>{enterEditMode(selectedNote)}}> edytuj </button>
                            <button id="exportNote"> exportuj </button>
                        </section>
                    {:else}
                        <input bind:value={newTitle}/>
                        <textarea bind:value={newContent}/>
                        <input bind:value={newTags}/>
                        <button on:click={()=>{confirmEdit(selectedNote)}}> ok </button>

                    
                    {/if}

                </div>
            {:else}
                <div class="listItem">
                    <p on:click={() => selectNote(note)} style="cursor:pointer; margin-bottom:0px">{note.title}</p>
                    <small class="tag">{note.tags.join(' ')}</small>
                </div>
            {/if}
        </li>
    {/each}
</ul>

<style>
    .listItem{
        font-style: bold;
        font-size: 16px;
    }
    .tag{
        margin:0px;
        padding:0px;
        font-family:"Copperplate";
        font-style: italic;
    }

</style>