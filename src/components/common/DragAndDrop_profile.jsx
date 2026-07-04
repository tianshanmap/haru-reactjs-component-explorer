import { useState,useEffect } from "react"
import styles from "./DragAndDrop_profile.module.css"
import {
  getDirectory,
  getViewEndPoint
} from "../api/api_service_8080";


export default function DragAndDropProfile({image_path,onComplete,onExit}) {
  const [items, setItems] = useState([])

  useEffect(() => {
    // 1. Declare the async function inside the effect
    const fetchData = async () => {
      try {
        const result = await getDirectory(image_path);

        // 1. Split the string into an array
        // 2. Use .map() to return an object for each item
        const fruitObjects = result.files.filter(x => !x.name.startsWith(".") && (x.name.endsWith(".jpeg") || x.name.endsWith(".jpg") || x.name.endsWith(".JPG") || x.name.endsWith(".png"))).map(x => {
            return { id: x.path, text: x.name, column: 'left' };
        });
        setItems(fruitObjects);
        console.log(JSON.stringify(fruitObjects));        
      } catch (err) {
        setError(err.message);
      }
    };

    // 3. Immediately invoke the function
    fetchData(); 
  }, []); // Empty array ensures this runs once on mount

  // Store the ID of the item being dragged
  const handleDragStart = (e, id) => {
    console.log("handleDragStart id=" + id);
    e.dataTransfer.setData('text/plain', id);
  };

  // Required to allow a drop to happen over another div
  const handleDragOver = (e) => {
    e.preventDefault();
  };

    // Update state when an item is dropped into a new column
  const handleDrop = (e, targetColumn) => {
    const id = e.dataTransfer.getData('text/plain');
    console.log("handleDrop id=" + id);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, column: targetColumn } : item
      )
    );
  };

  // Helper to filter items per column
  const getItemsByColumn = (columnName) => {
    return items.filter((item) => item.column === columnName);
  };

  const onContinue = (event) => {
    let list = items.filter(x => x.column === 'right').map(x => x.id);
    console.log(list);
    onComplete(list);
  };
  const handleSelectAll = (event) => {
    let list = items.map(x => x.id);
    console.log(list);
    onComplete(list);
  };
  return (
    <div className={styles.drag_drop_top_container}>
      <div className={styles.drag_drop_command}>
        <button className={styles.drag_drop_button} onClick={onContinue}>Continue...</button> 
        <button className={styles.drag_drop_button} onClick={handleSelectAll}>Select All</button> 
        <button className={styles.drag_drop_button} onClick={onExit}>Cancel</button> 
      </div>
      <div className={styles.drag_drop_container}>
        {/* Column 1 */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'left')}
          className={styles.drag_drop_container1}
        >
          <h3 className={styles.corner_title}>Source Images</h3>
          {getItemsByColumn('left').map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={styles.drag_drop_item}
            >
              <img src={getViewEndPoint(item.id)} className={styles.drag_and_drop_img} width="100" height="50" />
            </div>
          ))}
        </div>
              {/* Column 2 */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'right')}
          className={styles.drag_drop_container2}
        >
          <h3 className={styles.corner_title}>Target Images to be included in the video</h3>
          {getItemsByColumn('right').map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={styles.drag_drop_item}
            >
              <img src={getViewEndPoint(item.id)} className={styles.drag_and_drop_img} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}