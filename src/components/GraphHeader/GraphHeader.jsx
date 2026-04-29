import styles from "./GraphHeader.module.css";
function GraphHeader({ toggleFullscreen, isFullscreen }) {
  return (
    <header className={styles.header}>
      <button className={`${styles.button} ${styles.graphs_list_button}`}>
        <img
          className={styles.graphs_list_button_icon}
          src="/icons/graphs-list.svg"
          draggable="false"
          alt="Список графов"
        />
        Список графов
      </button>
      <div className={styles.buttons_container}>
        <button
          className={`${styles.button} ${styles.header_button} ${styles.add_button}`}
          title="Создать граф"
        >
          <img
            className={styles.header_button_icon}
            src="/icons/add-graph-icon.svg"
            draggable="false"
            alt="Создать граф"
          />
          Создать граф
        </button>
        <button
          className={`${styles.button} ${styles.header_button} ${styles.delete_button}`}
          title="Удалить граф"
        >
          <img
            className={styles.header_button_icon}
            src="/icons/del-graph-icon.svg"
            draggable="false"
            alt="Удалить граф"
          />
          Удалить граф
        </button>
        <details name="accordion" title="Методы">
          <summary className={`${styles.button} ${styles.header_button}`}>
            <img
              className={styles.header_button_icon}
              src="/icons/methods.svg"
              draggable="false"
              alt="Методы"
            />
            Методы
          </summary>
          <ul className={styles.dropdown_list}>
            <li>Степень вершины графа</li>
            <li>Вершины графа, не смежные с данной</li>
            <li>Оставить только взаимные дуги</li>
            <li>Сильно связные компоненты</li>
            <li>Кратчайшие пути до вершины</li>
            <li>Минимальный остов</li>
            <li>Кратчайшие пути u1, u2 → v</li>
            <li>Кратчайшие пути u → v1, v2</li>
            <li>Пары с бесконечно малым путем</li>
          </ul>
        </details>
        <details name="accordion" title="Примеры">
          <summary className={`${styles.button} ${styles.header_button}`}>
            Примеры
          </summary>
          <ul className={styles.dropdown_list}>
            <li>Ориентированный невзвешенный</li>
            <li>Ориентированный взвешенный</li>
            <li>Неориентированный невзвешенный</li>
            <li>Неориентированный взвешенный</li>
          </ul>
        </details>
        <button
          className={`${styles.button} ${styles.header_button} ${styles.save_button}`}
          title="Сохранить граф"
        >
          <img
            className={styles.header_button_icon}
            src="/icons/save-graph.svg"
            draggable="false"
            alt="Сохранить граф"
          />
          Сохранить граф
        </button>
        <button
          className={`${styles.button} ${styles.header_button} ${styles.load_button}`}
          title="Загрузить граф"
        >
          <img
            className={styles.header_button_icon}
            src="/icons/load-graph.svg"
            draggable="false"
            alt="Загрузить граф"
          />
          Загрузить граф
        </button>
      </div>
      <button
        className={styles.fullscreen_btn}
        onClick={toggleFullscreen}
        title={
          isFullscreen
            ? "Выйти из полноэкранного режима"
            : "Полноэкранный режим"
        }
      >
        <img
          src="/icons/fullscreen.svg"
          draggable="false"
          alt={
            isFullscreen
              ? "Выйти из полноэкранного режима"
              : "Полноэкранный режим"
          }
        />
      </button>
    </header>
  );
}

export default GraphHeader;
