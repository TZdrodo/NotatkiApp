<script>
import {db} from '../lib/db.js';
import {createEventDispatcher} from 'svelte';
import {onMount, onDestroy} from 'svelte';


const dispatch = createEventDispatcher();
let title = '';
let content = '';
let tags = '';

let editor;
let textarea1;
onMount(()=> {
    editor = new SimpleMDE({ element: textarea1, initialValue: content, spellChecker: false, autosave: {enabled:false}, status: false, toolbar: ["bold", "italic", "heading", "unordered-list", "quote"]});

    editor.codemirror.on('change', ()=>{
        content = editor.value();
    });
});
onDestroy(()=> {
    editor.toTextArea();
    editor = null;
});


async function addNote(){
    if (title.trim()!=''){    
        const tagsArr = tags.split(',').map(t => t.trim());
        await db.notes.add({
            title,
            content,
            tags: tagsArr,
            createdDate: new Date()
        });
    
        title = '';
        content = '';
        tags = '';
        editor.value('');

        dispatch("changedNotes");
    }

}
</script>

<input bind:value={title} placeholder="Tytuł notatki"/>
<textarea bind:this={textarea1} placeholder="zacznij pisać"/>
<input bind:value={tags} placeholder = "tag1, tag2, tag3..."/>
<button on:click={addNote}> Zapisz nową notatkę </button>