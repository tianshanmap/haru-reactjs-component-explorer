
import PathSelect from "./PathSelect";
const MoveCopyDialog = ({ isOpen, title, message, onConfirm, onCancel, onPathSelect }) => {
  if (!isOpen) return null;
  console.log("PathSelect::onPathSelect=" + onPathSelect);
  console.log("PathSelect::onConfirm=" + onConfirm);
  console.log("PathSelect::onCancel=" + onCancel);
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div style={styles.actions}>
          <PathSelect onChange={onPathSelect}/>
          <button onClick={onCancel} style={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={onConfirm} style={styles.confirmBtn}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Basic inline styles (or use Tailwind/CSS modules)
const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
    cancelBtn: {
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '4px',
  },
  confirmBtn: {
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  }
};

export default MoveCopyDialog;