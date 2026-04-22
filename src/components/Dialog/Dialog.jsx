import styles from "./Dialog.module.css";

const dialogType = {
  create_graph: {
    title: "Создать граф",
    content: (
      <>
        <div className={styles.form_container}>
          <label className={styles.form_label} for="name">
            Название:
          </label>
          <input className={styles.form_name} type="text" id="name" />
        </div>
        <div className={styles.checkbox_container}>
          <div className={styles.checkbox}>
            <label className={styles.form_checkbox_label} for="weighted">
              Взвешенный?
            </label>
            <input
              className={styles.form_checkbox}
              type="checkbox"
              id="weighted"
            />
          </div>
          <div className={styles.checkbox}>
            <label className={styles.form_checkbox_label} for="directed">
              Ориентированный?
            </label>
            <input
              className={styles.form_checkbox}
              type="checkbox"
              id="directed"
            />
          </div>
        </div>
      </>
    ),
    ok_text: "Создать",
    cancel_text: "Отмена",
  },
  delete_graph: {
    title: "Удалить граф",
    content: (
      <>
        <div className={styles.form_container}>
          <p className={styles.form_text}>Вы уверены?</p>
        </div>
      </>
    ),
    ok_text: "Нет",
    cancel_text: "Да",
  },
  add_edge: {
    title: "Добавить ребро (дугу)",
    content: (
      <>
        <div className={styles.form_container}>
          <label className={styles.form_label} for="from">
            Откуда:
          </label>
          <select className={styles.form_name} type="text" id="from">
            <option>1</option>
          </select>
        </div>
        <div className={styles.form_container}>
          <label className={styles.form_label} for="to">
            Куда:
          </label>
          <select className={styles.form_name} type="text" id="to">
            <option>1</option>
          </select>
        </div>
        <div className={styles.form_container}>
          <label className={styles.form_label} for="weight">
            Вес:
          </label>
          <input
            className={styles.form_weight}
            type="text"
            pattern="^-?[0-9]\d*(\.\d+)?$"
            id="weight"
          />
        </div>
      </>
    ),
    ok_text: "Добавить",
    cancel_text: "Отмена",
  },
  delete_edge: {
    title: "Удалить ребро (дугу)",
    content: (
      <>
        <div className={styles.form_container}>
          <p className={styles.form_text}>Вы уверены?</p>
        </div>
      </>
    ),
    ok_text: "Нет",
    cancel_text: "Да",
  },
  add_vertex: {
    title: "Добавить вершину",
    content: <></>,
    ok_text: "Добавить",
    cancel_text: "Отмена",
  },
  delete_vertex: {
    title: "Удалить вершину",
    content: (
      <>
        <div className={styles.form_container}>
          <p className={styles.form_text}>Вы уверены?</p>
        </div>
      </>
    ),
    ok_text: "Нет",
    cancel_text: "Да",
  },
};

function Dialog({ type, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close_button} onClick={onClose}>
          <img src="/icons/close.svg" draggable="false" alt="Закрыть" />
        </button>
        <h2 className={styles.title}>{dialogType[type].title}</h2>
        <form className={styles.form}>
          <div className={styles.dialog_content}>
            {dialogType[type].content}
          </div>
          <div className={styles.buttons}>
            <button className={styles.ok_button}>
              {dialogType[type].ok_text}
            </button>
            <button className={styles.cancel_button}>
              {dialogType[type].cancel_text}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dialog;
