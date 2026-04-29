import styles from "./Popup.module.css";

function Popup({ text = "Текст", title = "Сообщение", onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close_button} onClick={onClose}>
          <img src="/icons/close.svg" draggable="false" alt="Закрыть" />
        </button>

        <h2 className={styles.title}>{title}</h2>

        <p className={styles.text}>{text}</p>

        <button className={styles.ok_button} onClick={onClose}>
          ОК
        </button>
      </div>
    </div>
  );
}

export default Popup;
