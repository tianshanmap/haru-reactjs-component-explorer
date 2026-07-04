import { useState, useEffect } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
// Or, you can use ariakit, shadcn, etc.
import { BlockNoteView } from "@blocknote/mantine";
// Default styles for the mantine editor
import "@blocknote/mantine/style.css";
// Include the included Inter font
import "@blocknote/core/fonts/inter.css";
import styles from "./text_editor_pro.module.css";
import { 
        saveNotes,
        getNotes,
      } from "../api/api_service_8080";

import { PDFExporter, pdfDefaultSchemaMappings } from "@blocknote/xl-pdf-exporter";
import * as ReactPDF from "@react-pdf/renderer";      
import FileNameDialog from "./dialog/FileNameDialog";

export default function TextEditorPro({isExisting,name,parent,onExit,onSave}) {
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const [isEditorOpen,setIsEditorOpen] = useState(true);
  // Create a new editor instance
  const editor = useCreateBlockNote();
  useEffect(() => {
    // 1. Declare the async function inside the effect
    const fetchData = async () => {
      if (isExisting){
        const saved = await getNotes(name);
        if (saved) {
          const blocks = JSON.parse(saved);
          editor.replaceBlocks(editor.document, blocks);
        }
      }
    };

    // 3. Call the function immediately
    console.log("VideoList::useEffect is called");
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

 // 1. Saving Content
  const saveContent = async () => {
    const jsonBlocks = JSON.stringify(editor.document);
    localStorage.setItem("editorContent", jsonBlocks);
    let request = {
      "file_path": name,
      "content": jsonBlocks,
      "created_by": "neil",
    };
    try {
         const data = await saveNotes(request); // Parse the server response
         console.log(data);
    } catch (error) {
         console.error('Error:', error);
    }
    onSave();
  };

 // 2. Loading Content
  const loadContent = async () => {
    // const saved = localStorage.getItem("editorContent");
    // if (saved) {
    //   const blocks = JSON.parse(saved);
    //   editor.replaceBlocks(editor.document, blocks);
    // }
    const saved = await getNotes(name);
    if (saved) {
      const blocks = JSON.parse(saved);
      editor.replaceBlocks(editor.document, blocks);
    }
  };

  const handleExit = async () => {
    onExit(parent);
  }

  const onClickPDF = async (event) => {
      setIsEditorOpen(false);
      setIsDialogOpen(true);
  };

  const onCancel = async (event) => {
    setIsDialogOpen(false);
    setIsEditorOpen(true);
  }
  const handleExportPDF = async (name) => {
    // 1. Initialize the exporter with BlockNote's schema
    const exporter = new PDFExporter(editor.schema, pdfDefaultSchemaMappings);
    
    // 2. Convert blocks to a React-PDF Document component
    const pdfDocument = await exporter.toReactPDFDocument(editor.document);
    
    // 3. Render and trigger the PDF download
    const blob = await ReactPDF.pdf(pdfDocument).toBlob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    if (!name.endsWith(".pdf"))
      link.download = name + ".pdf";
    else
      link.download = name;

    link.click();
    setIsEditorOpen(true);
    setIsDialogOpen(false);
  };
  // Render the editor
  return (
    <>
      {isEditorOpen &&
        <div className={styles.text_editor_parent}>
            <div className={styles.text_editor_tools}>
                <button onClick={saveContent}>Save</button>
                <button onClick={onClickPDF}>PDF</button>
                <button onClick={loadContent}>Load</button>
                <button onClick={handleExit}>Exit</button>
            </div>
            <div className={styles.text_editor_container}>
                <BlockNoteView editor={editor} />
            </div>
        </div>
      }
      {isDialogOpen &&
        <FileNameDialog
          title="Assign a name for your pdf"
          message="The generated PDF will be stored at your ~/Download folder as the assigned name"
          label="PDF Name : "
          onConfirm={handleExportPDF}
          onCancel={onCancel}
        />             
      }
    </>
  );
}