import { useState,useEffect } from "react"
import styles from "./DragAndDrop.module.css"
export default function DragAndDrop({base_url,name}) {
  const [items, setItems] = useState([])

  useEffect(() => {
    // 1. Declare the async function inside the effect
    const fetchData = async () => {
      try {
        const response = await fetch(base_url + 'folder?name=' + name);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const result = await response.json();

        // 1. Split the string into an array
        // 2. Use .map() to return an object for each item
        const fruitObjects = result.files.map(x => {
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
  };
  return (
    <div className={styles.drag_drop_top_container}>
      <button className={styles.drag_drop_button} onClick={onContinue}>Continue...</button> 
      <div className={styles.drag_drop_container}>
        {/* Column 1 */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'left')}
          className={styles.drag_drop_container1}
        >
          <h3 class={styles.corner_title}>Source Images</h3>
          {getItemsByColumn('left').map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={styles.drag_drop_item}
            >
              <img src={base_url + "view?name=" + item.id} className={styles.drag_and_drop_img} width="100" height="50" />
            </div>
          ))}
        </div>
              {/* Column 2 */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'right')}
          className={styles.drag_drop_container2}
        >
          <h3 class={styles.corner_title}>Target Images to be included in the video</h3>
          {getItemsByColumn('right').map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={styles.drag_drop_item}
            >
              <img src={base_url + "view?name=" + item.id} className={styles.drag_and_drop_img} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}