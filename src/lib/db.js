import Dexie from "dexie";
export const db = new Dexie("notesDB");
db.version(1).stores({
    notes: "++id, cratedDate, tags, title, content"
});