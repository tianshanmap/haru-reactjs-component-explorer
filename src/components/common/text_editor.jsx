import { useState, useEffect } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
// Or, you can use ariakit, shadcn, etc.
import { BlockNoteView } from "@blocknote/mantine";
// Default styles for the mantine editor
import "@blocknote/mantine/style.css";
// Include the included Inter font
import "@blocknote/core/fonts/inter.css";
import styles from "./text_editor.module.css";
import { 
        saveNotes,
        getNotes,
      } from "../api/api_service_8080";

export default function TextEditor() {
  // Create a new editor instance
  const editor = useCreateBlockNote();
//   editor.onChange((editor, { getChanges }) => {
//     console.log("Editor content changed");

//     // Get detailed information about what changed
//     const changes = getChanges();
//     console.log("Changes:", JSON.stringify(changes));
//     setEditorContent(JSON.stringify(changes));
//     // Save content, update UI, etc.
//   });

 // 1. Saving Content
  const saveContent = async () => {
    const jsonBlocks = JSON.stringify(editor.document);
    localStorage.setItem("editorContent", jsonBlocks);
    let request = {
      "file_path": "/Users/developer/workspace/test.notes",
      "content": jsonBlocks,
      "created_by": "neil",
    };
    try {
         const data = await saveNotes(request); // Parse the server response
         console.log(data);
    } catch (error) {
         console.error('Error:', error);
    }
  };

 // 2. Loading Content
  const loadContent = async () => {
    // const saved = localStorage.getItem("editorContent");
    // if (saved) {
    //   const blocks = JSON.parse(saved);
    //   editor.replaceBlocks(editor.document, blocks);
    // }
    const saved = await getNotes("/Users/developer/workspace/test.notes");
    if (saved) {
      const blocks = JSON.parse(saved);
      editor.replaceBlocks(editor.document, blocks);
    }
  };

  // Render the editor
  return (
    <div className={styles.text_editor_parent}>
        <div className={styles.text_editor_tools}>
            <button onClick={saveContent}>Save</button>
            <button>PDF</button>
            <button onClick={loadContent}>Load</button>
        </div>
        <div className={styles.text_editor_container}>
            <BlockNoteView editor={editor} theme="light"/>
        </div>
    </div>
  );
}