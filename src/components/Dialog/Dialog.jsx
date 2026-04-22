import styles from "./Dialog.module.css";

function Dialog({
  text = "Текст",
  title = "Название метода",
  true_text = "Создать",
  false_text = "Отмена",
  onClose,
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close_button} onClick={onClose}>
          <img src="/icons/close.svg" draggable="false" alt="Закрыть" />
        </button>
        <h2 className={styles.title}>{title}</h2>
        <form className={styles.form}>
          <div className={styles.input}>
            <label for="name">Название:</label>
            <input type="text" id="name" />
            <label for="from">Откуда:</label>
            <select id="from">
              <option value="1">1</option>
            </select>
            <label for="to">Куда:</label>
            <select id="to">
              <option value="1">1</option>
            </select>
            <label for="weight">Вес:</label>
            <input type="text" id="weight" />
            <label for="weighted">Взвешенный?</label>
            <input type="checkbox" id="weight" />
            <label for="directed">Ориентированный?</label>
            <input type="checkbox" id="directed" />
          </div>
          <div className={styles.buttons}>
            <button className={styles.ok_button}>{true_text}</button>
            <button className={styles.cancel_button}>{false_text}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dialog;
