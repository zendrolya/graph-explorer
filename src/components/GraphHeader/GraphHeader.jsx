import styles from "./GraphHeader.module.css";
function GraphHeader({
  toggleFullscreen,
  isFullscreen,
  hasGraph,

  // Диалоги / попапы
  onCreateGraph,
  onDeleteGraph,
  onShowGraphsList,

  // Методы / примеры
  onMethodSelect,
  onExampleSelect,

  // Работа с файлами
  onSaveGraph,
  onLoadGraph,
}) {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={`${styles.button} ${styles.graphs_list_button}`}
        onClick={onShowGraphsList}
        title="Список графов"
      >
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
          type="button"
          className={`${styles.button} ${styles.header_button} ${styles.add_button}`}
          title="Создать граф"
          onClick={onCreateGraph}
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
          type="button"
          className={`${styles.button} ${styles.header_button} ${styles.delete_button}`}
          title="Удалить граф"
          onClick={onDeleteGraph}
          disabled={!hasGraph}
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
          <summary
            role="button"
            className={`${styles.button} ${styles.header_button} ${hasGraph ? "" : styles.summary_disabled}`}
          >
            <img
              className={styles.header_button_icon}
              src="/icons/methods.svg"
              draggable="false"
              alt="Методы"
            />
            Методы
          </summary>

          <ul className={styles.dropdown_list}>
            <li
              onClick={() =>
                hasGraph && onMethodSelect("Степень вершины графа")
              }
            >
              Степень вершины графа
            </li>

            <li
              onClick={() =>
                hasGraph && onMethodSelect("Вершины графа, не смежные с данной")
              }
            >
              Вершины графа, не смежные с данной
            </li>

            <li
              onClick={() =>
                hasGraph && onMethodSelect("Оставить только взаимные дуги")
              }
            >
              Оставить только взаимные дуги
            </li>

            <li
              onClick={() =>
                hasGraph && onMethodSelect("Сильно связные компоненты")
              }
            >
              Сильно связные компоненты
            </li>

            <li
              onClick={() =>
                hasGraph && onMethodSelect("Кратчайшие пути до вершины")
              }
            >
              Кратчайшие пути до вершины
            </li>

            <li onClick={() => hasGraph && onMethodSelect("Минимальный остов")}>
              Минимальный остов
            </li>

            <li
              onClick={() =>
                hasGraph && onMethodSelect("Кратчайшие пути u1, u2 → v")
              }
            >
              Кратчайшие пути u1, u2 → v
            </li>

            <li
              onClick={() =>
                hasGraph && onMethodSelect("Кратчайшие пути u → v1, v2")
              }
            >
              Кратчайшие пути u → v1, v2
            </li>

            <li
              onClick={() =>
                hasGraph && onMethodSelect("Пары с бесконечно малым путем")
              }
            >
              Пары с бесконечно малым путем
            </li>

            <li
              onClick={() => hasGraph && onMethodSelect("Максимальный поток")}
            >
              Максимальный поток
            </li>
          </ul>
        </details>

        <details name="accordion" title="Примеры">
          <summary
            role="button"
            className={`${styles.button} ${styles.header_button}`}
          >
            Примеры
          </summary>

          <ul className={styles.dropdown_list}>
            <li onClick={() => onExampleSelect("Ориентированный невзвешенный")}>
              Ориентированный невзвешенный
            </li>

            <li onClick={() => onExampleSelect("Ориентированный взвешенный")}>
              Ориентированный взвешенный
            </li>

            <li
              onClick={() => onExampleSelect("Неориентированный невзвешенный")}
            >
              Неориентированный невзвешенный
            </li>

            <li onClick={() => onExampleSelect("Неориентированный взвешенный")}>
              Неориентированный взвешенный
            </li>
          </ul>
        </details>

        <button
          type="button"
          className={`${styles.button} ${styles.header_button} ${styles.save_button}`}
          title="Сохранить граф"
          onClick={onSaveGraph}
          disabled={!hasGraph}
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
          type="button"
          className={`${styles.button} ${styles.header_button} ${styles.load_button}`}
          title="Загрузить граф"
          onClick={onLoadGraph}
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
        type="button"
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
